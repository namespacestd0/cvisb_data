import { Injectable } from '@angular/core';

import { HttpHeaders, HttpParams } from '@angular/common/http';
import { map, catchError, mergeMap, tap } from "rxjs/operators";
import { Observable, BehaviorSubject, throwError, forkJoin, pipe } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';

import { environment } from "../../environments/environment";

import { PatientArray, PatientDownload, AuthState, RequestParamArray, PatientSummary } from '../_models';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { GetExperimentsService } from './get-experiments.service';
import { RequestParametersService } from './request-parameters.service';
import { MyHttpClient } from './http-cookies.service';
import { DateRangePipe } from "../_pipes/date-range.pipe";

import { flatMapDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})

export class GetPatientsService {
  // patients: Patient[];
  request_params: RequestParamArray;

  all_data;

  // Event listener for the patient array.
  public patientsSubject: BehaviorSubject<PatientArray> = new BehaviorSubject<PatientArray>(null);
  public patientsState$ = this.patientsSubject.asObservable();

  // Array of variables to calculate the summary stats for.
  summaryVar: string[] = ["patientID.keyword", "cohort.keyword", "outcome.keyword", "country.identifier.keyword", "infectionYear"];

  constructor(
    public myhttp: MyHttpClient,
    // private route: ActivatedRoute,
    // private router: Router,
    private apiSvc: ApiService,
    private exptSvc: GetExperimentsService,
    // private requestSvc: RequestParametersService,
    private datePipe: DateRangePipe,
    // private authSvc: AuthService
  ) {

    // this.authSvc.authState$.subscribe((authState: AuthState) => {
    //   if (authState.authorized) {
    //     // this.getPatients();
    //   }
    // })

    // this.requestSvc.patientParamsState$.subscribe((params: RequestParamArray) => {
    //   console.log(params)
    //   this.request_params = params;
    //   // this.getPatients();
    // })

    // this.patients.sort((a: any, b: any) => (a.availableData && b.availableData) ? (b.availableData.length - a.availableData.length) : (a.patientID < b.patientID ? -1 : 1));
    // this.patients.sort((a: any, b: any) => this.sortFunc(a, b));
  }

  sortFunc(sortVar): string {
    // Sorting func for ES.

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


  getPatient(id: string): any {
    // temp hard-coded shim.
    // return (this.patients.filter((d: any) => d.patientID === id)[0]);
    return this.apiSvc.getOne('patient', id, 'patientID')
  }

  /*
  Call to get both patients and their associated experiments.
  1) Get paginated results for patients.
  2) Use those patientIDs to query /experiment
  3) Merge the two results together.
   */
  getPatients(qParams: HttpParams, pageNum: number, pageSize: number, sortVar: string = "", sortDirection: string) {

    // ES syntax for sorting is `sort=variable:asc` or `sort=variable:desc`
    // BUT-- Biothings changes the syntax to be `sort=+variable` or `sort=-variable`. + is optional for asc sorts
    let sortString: string = sortDirection === "desc" ? `-${this.sortFunc(sortVar)}` : this.sortFunc(sortVar);

    let params = qParams
      .append('size', pageSize.toString())
      .append('from', (pageSize * pageNum).toString())
      .append("sort", sortString);

    return this.myhttp.get<any[]>(environment.api_url + "/api/patient/query", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      mergeMap(patientResults => this.myhttp.get<any[]>(environment.api_url + "/api/experiment/query", {
        observe: 'response',
        headers: new HttpHeaders()
          .set('Accept', 'application/json'),
        params: new HttpParams()
          .set("q", "__all__")
          .set("patientID", `"${patientResults['body']['hits'].map(d => d.patientID).join('","')}"`)
          .set("facets", "privatePatientID.keyword(includedInDataset.keyword)")
          .set("size", "0")
          .set("facet_size", "10000")
      }).pipe(
        map(expts => {
          let patients = patientResults['body']['hits'];

          patients.forEach(patient => {
            let patientExpts = flatMapDeep(expts['body']["facets"]["privatePatientID.keyword"]["terms"].filter(d => patient.alternateIdentifier.includes(d.term)), d => d["includedInDataset.keyword"]["terms"]).map(d => d.term);
            patient['availableData'] = patientExpts;
          })

          return ({ hits: patients, total: patientResults['body']['total'] });
        }),
        catchError(e => {
          console.log(e)
          throwError(e);
          return (new Observable<any>())
        })
      )
      )
    )
  }


  /*
  Gets summary, facetted stats for patients
   */
  getPatientSummary(params: HttpParams): Observable<PatientSummary> {
    let facet_string = this.summaryVar.join(",");

    params = params
      .append('facets', facet_string)
      .append('facet_size', "10000")
      .append('size', "0");

    return this.myhttp.get<any[]>(`${environment.api_url}/api/patient/query`, {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json'),
      params: params
    }).pipe(
      map((res: any) => {
        let summary = new PatientSummary(res.body)
        return (summary);
      }
      )
    );
  }

  getAllPatientsSummary(): Observable<PatientSummary> {
    return forkJoin([this.getPatientSummary(new HttpParams().set("q", "__all__")), this.exptSvc.getExptCounts()]).pipe(
      map(([patientSummary, expts]) => {
        patientSummary["experiments"] = expts;

        let years = patientSummary.patientYears.filter((d: any) => Number.isInteger(d.term)).map((d: any) => d.term);
        let minYear = Math.min(...years);
        let maxYear = Math.max(...years);
        patientSummary["yearDomain"] = [minYear, maxYear];
        patientSummary["cohortDomain"] = patientSummary.patientTypes.map(d => d.term);
        patientSummary["outcomeDomain"] = patientSummary.patientOutcomes.map(d => d.term);
        return (patientSummary)
      }),
      tap(x => console.log(x))
    )
  }


  // Using MyGene fetch_all to grab all the data, unscored:
  // https://dev.cvisb.org/api/patient/query?q=__all__&fetch_all=true
  // subsequent calls: https://dev.cvisb.org/api/patient/query?scroll_id=DnF1ZXJ5VGhlbkZldGNoCgAAAAAAANr9FlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADa_hZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wUWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsGFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbABZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2v8WUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsBFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHcAAAAAAADbAhZQQlJFZEpJdVFCNkM3WlZSWEo4UVB3AAAAAAAA2wMWUEJSRWRKSXVRQjZDN1pWUlhKOFFQdwAAAAAAANsEFlBCUkVkSkl1UUI2QzdaVlJYSjhRUHc=
  // If no more results to be found, "success": false
  // Adapted from https://stackoverflow.com/questions/44097231/rxjs-while-loop-for-pagination
  fetchAllPatients(qParams): Observable<PatientDownload[]> {
    return this.apiSvc.fetchAll("patient", qParams).pipe(
      map((patients) => {
        // console.log("end of API")
        // console.log(patients)
        // last iteration returns undefined; filter out
        // Also call PatientDownload to tidy the results
        patients = patients.map(patient => {
          return (new PatientDownload(patient, this.datePipe));
        })
        return (patients);
      })
    )
  }

}
