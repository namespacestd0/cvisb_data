import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UploadPatientsRoutingModule } from './upload-patients-routing.module';

// --- modules ---
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';

// --- components ---
import { AddPatientsComponent } from '../add-patients/add-patients.component';
import { PatientUploadComponent } from '../patient-upload/patient-upload.component';

@NgModule({
  imports: [
    CommonModule,
    UploadPatientsRoutingModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  declarations: [
    AddPatientsComponent,
    PatientUploadComponent
  ]
})
export class UploadPatientsModule { }
