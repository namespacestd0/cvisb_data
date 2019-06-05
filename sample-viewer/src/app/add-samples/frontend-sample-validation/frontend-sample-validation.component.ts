import { Component, OnInit, Input } from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SampleUploadService } from '../../_services';

@Component({
  selector: 'app-frontend-sample-validation',
  templateUrl: './frontend-sample-validation.component.html',
  styleUrls: ['./frontend-sample-validation.component.scss']
})

export class FrontendSampleValidationComponent implements OnInit {
  data: Object[];
  validation_steps: Object[];
  upload_steps: Object[];
  ready2validate: boolean;
  numErrors: number;
  numVerification: number;
  dataLength: number;
  badIDs: Object[];
  missingReq: Object[];
  dateCheck: Object[];
  dupeCheck: Object[];
  dupeCombo: Object[];

  // States of approval
  approve_deletions: boolean;
  approve_ids: boolean;
  approve_dates: boolean;
  approve_dupes: boolean;

  constructor(private uploadSvc: SampleUploadService) {
    // Front-end validation states
    uploadSvc.FEvalidationState$.subscribe(state => {
      // console.log(state);
      // Count number of errors
      this.numErrors = Number(state.map((d: any) => (d.numErrors > 0) && !d.verified && d.fatal).reduce((a: any, b: any) => <any>(a + b)));
      this.numVerification = Number(state.map((d: any) => (d.numErrors > 0) && !d.verified && !d.fatal).reduce((a: any, b: any) => <any>(a + b)));

      this.data = this.getData(state, "delete_extra");
      this.dataLength = this.data ? this.data['length'] : 0;
      this.badIDs = this.getData(state, "check_ids");
      this.dateCheck = this.getData(state, "parse_dates");
      this.dupeCheck = this.getData(state, "check_dupes");
      this.dupeCombo = this.getData(state, "combine_dupes");
      this.missingReq = this.getData(state, "check_req");

      this.validation_steps = state;
    })

    uploadSvc.progressState$.subscribe(state => {
      this.upload_steps = state;
      // Make sure data is uploaded.
      this.ready2validate = state.filter((d: any) => d.id == "upload")[0]['complete'];
    })
  }

  ngOnInit() {
  }

  verifyStep(value: boolean, checkpointID: string) {
    if (checkpointID === "check_ids") {
      // For check_ids, if either option is selected, update its value to be true.
      // Save the IDs if 'yes' is selected.
      value === true ? this.uploadSvc.convertIDs(true) : this.uploadSvc.convertIDs(false);
      this.uploadSvc.updateValidation(checkpointID, null, null, null, true);
    } else {
      this.uploadSvc.updateValidation(checkpointID, null, null, null, value);
    }
  }

  getData(state: Object[], id: string) {
    let idx = state.findIndex((d: any) => d.id === id);

    if (idx > -1) {
      return (state[idx]['data']);
    }
  }

}