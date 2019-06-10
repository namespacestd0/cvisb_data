import { Injectable } from '@angular/core';

import { HttpParams } from '@angular/common/http';

import { ApiService } from './api.service';
import { ReleaseNote } from '../_models';

@Injectable({
  providedIn: 'root'
})

export class GetDatacatalogService {
  dataModified: string;
  dataCatalog: Object[];
  cvisbCatalog: Object;
  releaseNotes: ReleaseNote[] = [
    {
      dateReleased: "2019-06-12",
      version: 1,
      notes: [
        {
          endpoint: "Data",
          note: ["Initial publication of HLA data",
            "Initial publication of Lassa and Ebola viral sequencing data"
          ]
        },
        {
          endpoint: "Patient metadata",
          note: [
            "Added Lassa acute patients and metadata",
            "Added Ebola survivor patients and metadata",
            "Added Lassa survivor patients basic data",
          ]
        },
        {
          endpoint: "Samples and sample metadata",
          note: [
            "Added samples from June/July 2018 trip to Kenema Government Hospital in Sierra Leone",
            "Added samples from January 2019 trip to Kenema Government Hospital in Sierra Leone"
          ]
        },
      ]
    }
  ];

  constructor(private apiSvc: ApiService) {

    apiSvc.getPaginated("datacatalog", new HttpParams().set("q", "__all__")).subscribe(res => {
      this.dataCatalog = res['hits'];
      this.cvisbCatalog = this.dataCatalog.filter(d => d['identifier'] === "https://data.cvisb.org/")[0];
      this.dataModified = this.cvisbCatalog['dateModified'];
    })

    this.releaseNotes.sort((a, b) => a.version > b.version ? -1 : 1);

  }
}
