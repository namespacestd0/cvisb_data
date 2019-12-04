import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- modules ---
import { MaterialModule } from '../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { NgSelectModule } from '@ng-select/ng-select';
import { SvgIconModule } from '../svg-icon/svg-icon.module';
import { RouterModule } from '@angular/router';

// --- components ---
import { FilterSearchComponent } from './filter-search/filter-search.component';
import { FilterElisasComponent } from './filter-elisas/filter-elisas.component';
import { FilterExperimentComponent } from './filter-experiment/filter-experiment.component';
import { FilterFileTypeComponent } from './filter-file-type/filter-file-type.component';
import { FilterLocationComponent } from './filter-location/filter-location.component';
import { FilterPatientIdComponent } from './filter-patient-id/filter-patient-id.component';
import { FilterPatientTypeComponent } from './filter-patient-type/filter-patient-type.component';
import { FilterSampleYearComponent } from './filter-sample-year/filter-sample-year.component';
import { FilterLabComponent } from './filter-lab/filter-lab.component';
import { FilterSpeciesComponent } from './filter-species/filter-species.component';
import { FilterSampleTypeComponent } from './filter-sample-type/filter-sample-type.component';
import { FilterOrganizationComponent } from './filter-organization/filter-organization.component';
import { FilterSampleTimepointsComponent } from './filter-sample-timepoints/filter-sample-timepoints.component';
import { FilterSampleGroupComponent } from './filter-sample-group/filter-sample-group.component';
import { MiniDonutComponent } from './mini-donut/mini-donut.component';
import { MiniBarplotComponent } from './mini-barplot/mini-barplot.component';
import { FilterableHistogramComponent } from './filterable-histogram/filterable-histogram.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    MaterialModule,
    SvgIconModule,
  ],
  declarations: [
    FilterElisasComponent, FilterExperimentComponent, FilterFileTypeComponent,
    FilterLocationComponent, FilterPatientIdComponent, FilterPatientTypeComponent,
    FilterSampleYearComponent, MiniBarplotComponent, MiniDonutComponent, FilterSearchComponent,
    FilterLabComponent, FilterSpeciesComponent, FilterSampleTypeComponent, FilterOrganizationComponent,
    FilterSampleTimepointsComponent, FilterableHistogramComponent, FilterSampleGroupComponent
  ],
  exports: [
    FilterElisasComponent, FilterExperimentComponent, FilterFileTypeComponent,
    FilterLocationComponent, FilterPatientIdComponent, FilterPatientTypeComponent,
    FilterSampleYearComponent, MiniBarplotComponent, MiniDonutComponent, FilterSearchComponent,
    FilterLabComponent, FilterSpeciesComponent, FilterSampleTypeComponent, FilterOrganizationComponent,
    FilterSampleTimepointsComponent, FilterableHistogramComponent, FilterSampleGroupComponent
  ]
})
export class FiltersModule { }