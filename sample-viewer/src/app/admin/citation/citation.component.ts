import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';

import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { GetDatacatalogService, getDatasetsService } from '../../_services';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-citation',
  templateUrl: './citation.component.html',
  styleUrls: ['./citation.component.scss']
})

export class CitationComponent implements OnInit {
  currentYear: Date = new Date();
  cvisbCatalog: Object;
  host_url: string = environment.host_url;
  loading: boolean = false;

  patients = {
    sources: [
      {
        "@type": "Organization",
        identifier: "VHFC",
        "name": "Viral Hemorrhagic Fever Consortium / Kenema Government Hospital",
        "url": "https://vhfc.org/"
      }]
  }

  experiments: Object[];

  constructor(
    private titleSvc: Title,
    private route: ActivatedRoute,
    private dataCatalogSvc: GetDatacatalogService,
    private datasetSvc: getDatasetsService
  ) {
    // set page title
    this.titleSvc.setTitle(this.route.snapshot.data.title);

    this.cvisbCatalog = this.dataCatalogSvc.cvisbCatalog;

    this.datasetSvc.loadingState$.subscribe(loading => {
      this.loading = loading;
    })
  }

  ngOnInit() {
    this.datasetSvc.getDatasetSources().subscribe(sources => {
      this.experiments = sources;
    });

    // 2019-11-14 seems to be working, but no sources in index so actually fails in POST request...
    // this.datasetSvc.getPatientSources().subscribe(sources => {
    //   console.log(sources)
    // });
  }

}
