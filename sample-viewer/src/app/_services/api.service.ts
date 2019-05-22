// Series of generic wrappers around common functionalities across API endpoints.
// For instance: a generic loop to wipe an entire endpoint.

import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject, throwError, forkJoin, of } from 'rxjs';
import { map, catchError } from "rxjs/operators";

import { environment } from "../../environments/environment";

// services
import { MyHttpClient } from './http-cookies.service';
import { cloneDeep } from 'lodash';
// models


@Injectable({
  providedIn: 'root'
})

export class ApiService {
  public uploadProgressSubject: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  public uploadProgressState$ = this.uploadProgressSubject.asObservable();


  constructor(
    public myhttp: MyHttpClient,
  ) {
  }

  // --- GET ---
  // Generic GET to access a single document with a particular ID.
  getOne(endpoint: string, id: string, idVar: string = 'identifier', returnAll: boolean = false) {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: new HttpParams()
        .set('q', `${idVar}:\"${id}\"`)
    }).pipe(
      map(data => {
        if (returnAll) {
          return (data['body']['hits']);
        } else {
          if (data['body']['total'] === 1) {
            // One result found, as expected.
            return (data['body']['hits'][0])
          } else {
            console.log("More than one object returned. Check if your ID is unique!")
            console.log(data)
          }
        }
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }

  // Sorting function, to convert sort variable into the proper syntax for ES
  // numeric variables should return just their string'd name
  // string variables need to be {string}.keyword
  // and there's a few special cases for nested variables
  sortFunc(sortVar): string {
    let numericVars = ["age"];
    if (numericVars.includes(sortVar) || !sortVar) {
      return (sortVar);
    }

    // custom: nested objects
    if (sortVar === "country") {
      return ("country.name.keyword");
    }

    // Default: string
    // Since any variable which is a string has to be sorted by keyword, doing a bit of transformation:
    return (`${sortVar}.keyword`);
  }


  // based on https://blog.angular-university.io/angular-material-data-table/
  // ex: https://dev.cvisb.org/api/patient/query?q=__all__&size=20&sort=cohort.keyword&sort=age&from=40
  getPaginated(endpoint, qParams, pageNum: number = 0,
    pageSize: number = 25, sortVar: string = "", sortDirection?: string): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    console.log(qParams.toString());

    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let params = qParams
      .append('size', pageSize.toString())
      .append('from', (pageSize * pageNum).toString())
      .append("sort", sortString);

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"])
      }
      )
    );
  }

  // generic get function
  // assumes size = 1000 unless otherwise specified.
  get(endpoint, qParams, pageSize: number = 1000): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    let params = qParams
      .append('size', pageSize.toString());

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"])
      }
      )
    );
  }

  // generic get function
  // assumes size = 1000 unless otherwise specified.
  getPatient(endpoint, patientID, pageSize: number = 1000): Observable<any[]> {

    // this.router.navigate(
    //   [],
    //   {
    //     relativeTo: this.route,
    //     queryParams: { q: qParams.toString() },
    //     queryParamsHandling: "merge", // remove to replace all query params by provided
    //   });

    let params = new HttpParams()
      .set('q', '__all__')
      .set('patientID', patientID)
      .set('size', pageSize.toString());

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(res => {
        console.log(res);
        return (res["body"])
      }
      )
    );
  }

  // Generic getAll, which calls fetchAll. Results will not be sorted.
  getAll(endpoint: string, qString) {
    console.log('starting get all')
    let scrollID = null;
    let done = false;

    let results = [];

    for (let i = 0; i < 3; i++) {
      // while (!done) {
      console.log("still going!")
      console.log(i);

      this.fetchAll(endpoint, qString, scrollID).pipe(
        catchError(e => {
          console.log('error!')
          console.log(e)
          done = true;
          return (new Observable<any>())
        }),
        // finalize(() => this.loadingSubject.next(false))
      )
        .subscribe((result) => {
          console.log('samples from call to backend')
          done = true;
          console.log(result);

          // Remove ES variables that we won't need.
          let resultArr = this.dropCols(result['hits'], ['_score', '_version'], false);
          scrollID = result['_scroll_id'];

          results = results.concat(resultArr);
          console.log(results)
          console.log(results.length / result.total);

        });
    }

    return (results)


  }

  fetchAll(endpoint: string, qString, scrollID: string = null): Observable<any[]> {

    let params = new HttpParams()
      .set('q', qString)
      .append('fetch_all', "true");

    if (scrollID) {
      params = params.append("scroll_id", scrollID);
      console.log(params)
    }

    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map(data => {
        console.log('getAll Backend call:');
        console.log(data);

        // let result = data['body']['hits'];
        return (data['body']);
      }),
      catchError(e => {
        console.log(e)
        throwError(e);
        return (new Observable<any>())
      })
    )
  }

  // Generic function to pull out the ES `_ids` for all entries in an endpoint.
  getESIDs(endpoint: string) {
    return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
      observe: 'response',
      params: new HttpParams()
        .set("q", "__all__")
        .set("facets", "_id")
        .set("facet_size", "10000")
        .set("size", "0"),
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).pipe(
      map(data => {
        let df = data['body']['facets']['_id']['terms'];
        let ids = df.map(d => d.term);
        console.log(ids)

        return (ids);

      }))
  }

  // getIDs(newData: any, endpoint: string, uniqueID: string) {
  //   let ids = newData.map((d) => d[uniqueID]).join(",");
  //
  //   return this.myhttp.get<any[]>(`${environment.api_url}/api/${endpoint}/query`, {
  //     observe: 'response',
  //     headers: new HttpHeaders()
  //       .set('Accept', 'application/json'),
  //     params: new HttpParams()
  //       .set('q', `${uniqueID}:${ids}`)
  //   }).pipe(
  //     map(data => {
  //       if (data) {
  //         let files = data['body']['hits'];
  //
  //         if (!files) {
  //           return (null)
  //         }
  //         let id_dict = files.map((d: any) => {
  //           return ({
  //             '_id': d['_id'],
  //             uniqueID: d[uniqueID]
  //           })
  //         }
  //
  //         );
  //
  //         return (id_dict);
  //       }
  //     }))
  // }

  // --- PUT ---
  // Generic function to add data to a given endpoint on the API
  //
  // putRecursive(endpoint: string, newData: any, idx: number = 0) {
  //   return this.put(endpoint, newData)
  //     .map((response) => {
  //       console.log("put response")
  //       console.log(response)
  //       return ({ data: response; index: idx += 1 });
  //     }, err =>{
  //       console.log(err)
  //     })
  // }


  put(endpoint: string, newData: any): Observable<any> {
    if (newData) {
      // console.log('adding new data')
      return this.myhttp.put<any[]>(`${environment.api_url}/api/${endpoint}`,
        this.jsonify(newData),
        {
          headers: new HttpHeaders()
        });
    } else {
      console.log('no data to add')
    }
  }

  // Generic PUT function, done in `size` pieces.
  // Executed in a cascade, where the previous API completes before
  // Modified from https://stackoverflow.com/questions/41619312/send-multiple-asynchronous-http-get-requests/41620361#41620361
  putPiecewise(endpoint: string, newData: any, size: number = 25, initalUpload: number = 3): Observable<any> {
    let numChunks = Math.ceil(newData.length / size);
    let pct_done = 0;

    let results = [];
    let miniDatasets = [];

    for (let i = 0; i < numChunks; i++) {
      // for i = 0, add in a separate block for the first three entries
      // intended for UX experience -- show something is happening quickly.
      if (i === 0) {
        initialUpload = initialUpload <= size ? initialUpload : size;
        miniDatasets.push(newData.slice(i * size, initialUpload));
        miniDatasets.push(newData.slice(initialUpload, (i + 1) * size));
      } else {
        miniDatasets.push(newData.slice(i * size, (i + 1) * size));
      }
    }

    let singleObservables = miniDatasets.map((data: any[]) => {
      return this.put("patient", data)
        .pipe(
          map(single => {
            pct_done = pct_done + (data.length / newData.length) * 100;
            this.uploadProgressSubject.next(pct_done);
            return (single);
          }),
          catchError(e => {
            pct_done = pct_done + (data.length / newData.length) * 100;
            this.uploadProgressSubject.next(pct_done);
            return of(e);
          })
        )
    });

    return forkJoin(singleObservables);
  }

  // Function to convert to a json object to be inserted by ES
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }


  // --- DELETE ---
  // Generic function to delete a single record.
  deleteObject(endpoint: string, id: string) {
    console.log("attempting to delete obj: " + id)
    // TODO: build-in dialoge box to confirm?
    this.myhttp.delete(`${environment.api_url}/api/${endpoint}/${id}`)
      .subscribe(resp => {
        console.log(resp)
      },
        err => {
          console.log(`Error in deleting object ${id} from endpoint /${endpoint}`)
          console.log(err)
        }
      )
  }

  // Generic function to delete a single record.
  wipeEndpoint(endpoint: string) {
    console.log("attempting to delete all objects from endpoint")
    // TODO: build-in dialoge box to confirm / controls so not anyone can access

    this.getESIDs(endpoint).subscribe(ids => {
      console.log("list of IDs to delete:")
      console.log(ids);

      for (let id of ids) {
        this.deleteObject(endpoint, id);
      }
    })
  }


  // Removes fields from each object in an array of objects.
  dropCols(data, cols, copy = true) {
    let filtered;
    if (copy) {
      filtered = cloneDeep(data)
    } else {
      filtered = data;
    }

    filtered.forEach(d => {
      cols.forEach(col_name => {
        delete d[col_name];
      })
    })

    return (filtered)
  }


}
