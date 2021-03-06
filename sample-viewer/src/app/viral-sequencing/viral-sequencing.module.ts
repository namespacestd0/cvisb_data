import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViralSequencingRoutingModule } from './viral-sequencing-routing.module';

// --- components ---
import { ViralSequencingComponent } from './viral-sequencing.component';
// import { AlignedSequencesComponent } from './aligned-sequences/aligned-sequences.component';
// import { AlignedSequencesFiltersComponent } from './aligned-sequences-filters/aligned-sequences-filters.component';

// -- Modules --
import { DatasetPageModule } from '../dataset-page/dataset-page.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { DownloadAlignedSequencesComponent } from './download-aligned-sequences/download-aligned-sequences.component';
// import { CompareCohortsComponent } from './compare-cohorts/compare-cohorts.component'
import { SvgIconModule } from '../svg-icon/svg-icon.module';


// --- services ---
import { DatasetResolver } from '../_services/get-datasets.resolver';

@NgModule({
  imports: [
    CommonModule,
    ViralSequencingRoutingModule,
    DatasetPageModule,
    SvgIconModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    ViralSequencingComponent,
    // AlignedSequencesComponent,
    // AlignedSequencesFiltersComponent,
    // DownloadAlignedSequencesComponent,
    // CompareCohortsComponent
  ],
  exports: [
    // ViralSequencingComponent,
    // AlignedSequencesComponent,
    // AlignedSequencesFiltersComponent,
    // DownloadAlignedSequencesComponent,
    // CompareCohortsComponent
  ],
  providers: [
    DatasetResolver
  ]
})

export class ViralSequencingModule { }
