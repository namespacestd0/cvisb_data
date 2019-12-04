import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { GetExperimentsService, RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-experiment',
  templateUrl: './filter-experiment.component.html',
  styleUrls: ['./filter-experiment.component.scss']
})
export class FilterExperimentComponent implements OnInit, OnDestroy {
  @Input() endpoint: string;
  expts: any[];
  exptsSubscription: Subscription;
  patientSubscription: Subscription;
  sampleSubscription: Subscription;

  constructor(
    private exptSvc: GetExperimentsService,
    private requestSvc: RequestParametersService
  ) { }

  ngOnInit() {
    this.exptsSubscription = this.exptSvc.getExptCounts().subscribe(expts => {
      this.expts = expts;
      if (this.expts && this.expts.length > 0) {
        this.expts.forEach(d => {
          d['disabled'] = true;
        })
      }
    })

    switch (this.endpoint) {
      case "patient":
        this.patientSubscription = this.requestSvc.patientParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;

      case "sample":
        this.sampleSubscription = this.requestSvc.sampleParamsState$.subscribe(params => {
          this.checkParams(params);
        })
        break;
    }
  }

  ngOnDestroy() {
    this.exptsSubscription.unsubscribe();
    this.patientSubscription.unsubscribe();
    this.sampleSubscription.unsubscribe();
  }

  filterExpt(idx: number) {
    this.expts[idx].disabled = !this.expts[idx].disabled;

    let exptNames = this.expts.filter(d => !d.disabled).map(d => d.term);

    this.requestSvc.updateParams(this.endpoint, { field: "includedInDataset", value: exptNames });
  }

  // Used to reset, when the filters are cleared.
  checkParams(params: Object[]) {
    if (params.length === 0 && this.expts && this.expts.length > 0) {
      this.expts.forEach(d => d.disabled = true);
    }
  }

}
