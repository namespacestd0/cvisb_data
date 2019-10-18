import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GetExperimentsService {

  constructor(private apiSvc: ApiService) { }

  getExpt(patientID: string, dataset_id: string) {
    let qString = `includedInDataset:"${dataset_id}"`;

    let params = new HttpParams()
      .set('q', qString)
      .set('patientID', patientID);

    return (this.apiSvc.get('experiment', params));
  }

  getExptCounts() {
    let params = new HttpParams()
      .set('q', '__all__')
      .set('facets', 'includedInDataset.keyword')
      .set('facet_size', '1000')

    return this.apiSvc.get('experiment', params, 0).pipe(
      map(results => {
        return (results['facets']['includedInDataset.keyword']['terms']);
      })
    );
  }


}
