import { Injectable } from '@angular/core';

import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, BehaviorSubject } from 'rxjs';

import { environment } from "../../environments/environment";
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class GetFilesService {
  schema_dataset: any;
  files = [
    {
      "@context": "http://schema.org/",
      "@type": "Dataset",
      "identifier": "systemsserology",
      "@id": "<DOI TBD>",

      "name": "Systems Serology",
      "description": "Systems serology profiles of Ebola survivors and contacts",
      "keywords": ["immunology", "Ebola virus", "EBOV"],
      "measurementTechnique": "Systems Serology",
      "dateModified": "2018-10-31",
      "temporalCoverage": "2014/..",
      "spatialCoverage": [{
        "@type": "Country",
        "name": "Sierra Leone",
        "identifier": "SL",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:SL"
      }],
      "includedInDataCatalog": {
        "@type": "DataCatalog",
        "name": "Center for Viral Systems Biology data",
        "description": "Data generated by the Center for Viral Systems Biology",
        "identifier": "<DOI TBD>",
        "url": "https://data.cvisb.org/"
      },
      "author": {
        "@type": "Organization",
        "url": "http://www.ragoninstitute.org/portfolio-item/alter-lab/",
        "name": "Galit Alter laboratory",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "url": "http://www.ragoninstitute.org/portfolio-item/alter-lab/",
          "email": "galter@partners.org"
        }
      },
      "publisher": {
        "@type": "Organization",
        "url": "https://cvisb.org/",
        "name": "Center for Viral Systems Biology",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "url": "https://cvisb.org/",
          "email": "info@cvisb.org"
        }
      },
      "version": "0.1",
      "schemaVersion": "http://schema.cvisb.org/Dataset/0.1",
      "distribution": [{
        "@type": "DataDownload",
        "name": "systems_serology.csv",
        "description": "summary table of systems serology measurements",
        "version": "1.0",
        "additionalType": "summary data",
        "encodingFormat": "application/vnd.ms-excel",
        "measurementTechnique": "Systems serology",
        "datePublished": "2018-04-12",
        "dateModified": "2018-04-12",
        "@id": "<doi>",
        "contentUrl": "<url>"
      },
      ]
    },
    // -----

    {
      "@context": "http://schema.org/",
      "@type": "Dataset",
      "identifier": "hla",
      "name": "HLA Genotype Sequencing of Hemorrhagic Fever Survivors",
      "alternateName": "HLA",
      "description": "HLA Genotype Sequencing of Hemorrhagic Fever Survivors using Illumina TruSight HLA v2 Sequencing Panel",
      "url": "https://github.com/andersen-lab/lassa-ebola-hla",
      "@id": "<DOI TBD>",
      "keywords": ["HLA", "human leukocyte antigen", "Ebola virus", "EBOV", "Lassa virus", "LASV", "sequencing"],
      "measurementTechnique": "HLA sequencing",
      "variableMeasured": "HLA genotype",
      "datePublished": "2017-08-11",
      "dateModified": "2018-09-12",
      "temporalCoverage": "2014/..",
      "spatialCoverage": [{
        "@type": "Country",
        "name": "Sierra Leone",
        "identifier": "SL",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:SL"
      },
      {
        "@type": "Country",
        "name": "Nigeria",
        "identifier": "NG",
        "url": "https://www.iso.org/obp/ui/#iso:code:3166:NG"
      }
      ],
      "includedInDataCatalog": {
        "@type": "DataCatalog",
        "name": "Center for Viral Systems Biology data",
        "description": "Data generated by the Center for Viral Systems Biology",
        "@id": "<DOI TBD>",
        "url": "https://data.cvisb.org/"
      },
      "author": {
        "@type": "Organization",
        "url": "https://andersen-lab.com/",
        "name": "Kristian Andersen laboratory",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "url": "https://andersen-lab.com/",
          "email": "data@andersen-lab.com"
        }
      },
      "publisher": {
        "@type": "Organization",
        "url": "https://cvisb.org/",
        "name": "Center for Viral Systems Biology",
        "contactPoint": {
          "@type": "ContactPoint",
          "contactType": "technical support",
          "url": "https://cvisb.org/",
          "email": "info@cvisb.org"
        }
      },
      "version": "0.1",
      "schemaVersion": "http://schema.cvisb.org/Dataset/0.1",
      "distribution": [{
        "@type": "DataDownload",
        "name": "Genotype_calls.csv",
        "description": "summary table of all HLA genotype assignments",
        "keywords": ["HLA", "human leukocyte antigen", "Ebola virus", "EBOV", "Lassa virus", "LASV"],
        "version": "2.0",
        "additionalType": "summary data",
        "encodingFormat": "text/csv",
        "measurementTechnique": "HLA sequencing",
        "datePublished": "2017-08-11",
        "dateModified": "2018-09-12",
        "@id": "<doi>",
        "contentUrl": "<url>",
        "experimentParameters": [{
          "@type": "Experiment",
          "experimentID": "HLA-summary",
          "patientIDs": [
          ],
          "sampleIDs": [
          ]
        }]
      },
      {
        "@type": "DataDownload",
        "name": "cvisb001-HLA-09012017.bam",
        "description": "raw sequencing data for cvisb001-HLA-09012017",
        "version": "1.0",
        "additionalType": "raw data",
        "encodingFormat": "application/bam",
        "measurementTechnique": "HLA sequencing",
        "datePublished": "2017-09-13",
        "dateModified": "2018-09-12",
        "@id": "<doi>",
        "contentUrl": "<file url>",
        "experimentParameters": [{
          "@type": "andersenSequencing",
          "experimentID": "HLA-Run9",
          "batchID": "Run9",
          "experimentDate": "2017-09-13",
          "patientIDs": ["cvisb001"],
          "sampleIDs": ["cvisb001-DNA1"],
          "libraryVersion": "LIBRARY1",
          "sequencingTechnology": "Illumina",
          "sequencingCenter": "TSRI",
          "sample_type": "PBMC"
        }]
      },

      ],

      "sourceCode": [{
        "@type": "SoftwareSourceCode",
        "name": "HLA Genotype sequencing analysis code",
        "description": "HLA Genotype sequencing analysis code",
        "version": "https://github.com/andersen-lab/lassa-ebola-hla/commit/ac6d7cf7cb756deac17c4d5c80d96cffcdd866be",
        "dateModified": "2018-09-12",
        "@id": "<doi>",
        "codeRepository": "https://github.com/andersen-lab/lassa-ebola-hla",
        "author": {
          "@type": "Organization",
          "url": "https://andersen-lab.com/",
          "name": "Kristian Andersen laboratory",
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "technical support",
            "url": "https://andersen-lab.com/",
            "email": "data@andersen-lab.com"
          }
        }
      }]
    }];


  constructor(public http: HttpClient) {
    this.getFiles();
    this.putFiles(this.files.slice(0,1));
  }

  getFiles() {
    this.http.get<any[]>(environment.api_url + "/api/dataset/query?q=__all__&size=1000", {
      // this.http.get<any[]>(environment.host_url + "/api/sample/test_2", {
      observe: 'response',
      headers: new HttpHeaders()
        .set('Accept', 'application/json')
    }).subscribe(data => {
      let patients = data['body']['hits'];
      // console.log(data)

      // send new patients to subscription services.
      // this.patientsSubject.next(this.patients);
      // this.patientsSubject.next(patients);
    },
      err => {
        console.log('Error in getting files')
        // console.log(err)
      })
    // return this.patients;
    return this.clearSelected(this.files);
  }

  putFiles(datasets: any[]) {
    console.log('attempting to add new record')
    // console.log(this.jsonify(datasets));
    this.http.put<any[]>(environment.api_url + "/api/dataset",
      this.jsonify(datasets),
      {
        // observe: 'response',
        headers: new HttpHeaders()
        // .set('data', )
      }).subscribe(resp => {
        console.log(resp)
      },
        err => {
          console.log(err)
        })
  }

  getSchema(dsid: string) {
    // TODO: check if more than one dataset.
    let dataset = this.files.filter((d: any) => d.identifier === dsid)[0];
    return (this.removeNonSchema(dataset));
  }

  // Function to convert
  jsonify(arr: any[]): string {
    let json_arr = [];

    for (let record of arr) {
      json_arr.push(JSON.stringify(record))
    }
    return (json_arr.join("\n"))
  }

  removeNonSchema(ds) {
    this.schema_dataset = _.cloneDeep(ds); // create copy

    // remove stuff from the dataset object
    let schemaorg = ["@context", "@type", "identifier", "name", "description", "url", "@id", "keywords", "measurementTechnique", "variableMeasured", "datePublished", "dateModified", "temporalCoverage", "spatialCoverage", "includedInDataCatalog", "author", "publisher", "version", "schemaVersion", "distribution"];
    // removes "sourceCode" -- different name in schema.org
    for (let key of Object.keys(this.schema_dataset)) {
      if (!schemaorg.includes(key)) {
        // console.log('deleting ' + key)
        delete this.schema_dataset[key];
      }
      return (this.schema_dataset)
    }

    // remove stuff from individual files
    let schemaorg_distrib = ["@type", "name", "description", "keywords", "version", "additionalType", "encodingFormat", "measurementTechnique", "datePublished", "dateModified", "@id", "contentUrl"];
    for (let file of this.schema_dataset['distribution']) {
      let keys = Object.keys(file);

      for (let key of keys) {
        if (!schemaorg_distrib.includes(key)) {
          delete file[key];
        }
      }
    }
  }

  clearSelected(files: Object[]) {
    // loop over datasets
    // for (let i = 0; i < files.length; i++) {
    //   // loop over data downloads
    //   files[i]['distribution'].map(d => d['selected'] = false);
    // }
    return files;
  }
}
