import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PatientTimepointsComponent } from './patient-timepoints.component';
import { SampleMetadataComponent } from '../_dialogs/sample-metadata/sample-metadata.component';

import { MatTooltipModule, MatExpansionModule } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    MatTooltipModule,
    MatExpansionModule
  ],
  declarations: [PatientTimepointsComponent,
    SampleMetadataComponent],
  exports: [PatientTimepointsComponent],
  entryComponents: [
    SampleMetadataComponent
  ]
})
export class PatientTimepointsModule { }
