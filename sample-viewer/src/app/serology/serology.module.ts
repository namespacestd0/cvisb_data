import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SerologyRoutingModule } from './serology-routing.module';
import { SerologyComponent } from './serology.component';

import { DatasetPageModule } from '../dataset-page/dataset-page.module';

import { DatasetResolver } from '../_services/get-datasets.resolver';

@NgModule({
  imports: [
    CommonModule,
    SerologyRoutingModule,
    DatasetPageModule
  ],
  declarations: [SerologyComponent],
  providers: [ DatasetResolver ]
})
export class SerologyModule { }
