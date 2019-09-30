import { Component, OnChanges, Input } from '@angular/core';

import * as d3 from 'd3';
import { GetHlaDataService } from '../../../_services';
import { CohortSelectOptions, HLA, HLAnested, HLAsummary } from '../../../_models';

@Component({
  selector: 'app-small-multiple-comparison',
  templateUrl: './small-multiple-comparison.component.html',
  styleUrls: ['./small-multiple-comparison.component.scss']
})
export class SmallMultipleComparisonComponent implements OnChanges {
  @Input() left_params: CohortSelectOptions;
  @Input() right_params: CohortSelectOptions;

  left: HLAnested[];
  right: HLAnested[];
  loci: string[];

  // HLA_DATA: HLA[];


  constructor(private hlaSvc: GetHlaDataService) {
  }

  ngOnChanges() {
    if (this.left_params) {
      this.hlaSvc.getFilteredHLA(this.left_params).subscribe((hlaData: HLAnested[)] => {
        // this.left = this.filterData(this.HLA_DATA, this.left_params);
        console.log(hlaData)
        this.left = hlaData;
        this.loci = this.left.map((d: HLAnested) => d.key)
      })

    }

    if (this.right_params && this.HLA_DATA) {
      this.right = this.filterData(this.HLA_DATA, this.right_params);
    }

    console.log(this.left_params)
    console.log(this.right_params)
    console.log(this.left)
    console.log(this.right)
    console.log(this.loci)
  }

  nestData(data: HLA[]): HLAnested[] {
    // nest data
    let nested_hla = d3.nest()
      .key((d: HLA) => d.locus)
      .key((d: HLA) => d.allele)
      .rollup((values: any) => values.length)
      .entries(data);

    nested_hla.forEach((element: HLAnested) => {
      // calculate total per locus.
      element.total = d3.sum(element.values.map((d: HLAsummary) => d.value))

      let locus_total = element.total;

      // calc allelic frequency
      element.values.forEach(locus_allele => {
        locus_allele.pct = locus_allele.value / locus_total;
      })
    })
    // console.log(nested_hla)

    return (nested_hla);
  }

  filterData(data: HLA[], params: CohortSelectOptions): HLAnested[] {
    if (data && data.length > 0) {
      let filtered = data
        .filter((d: HLA) => params['cohort'].includes(d.cohort))
        .filter((d: HLA) => params['outcome'].includes(d.outcome));

      // console.log(filtered)

      return (this.nestData(filtered));
    }
  }

}
