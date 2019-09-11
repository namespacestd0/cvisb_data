import { Component, OnChanges, OnInit, Input } from '@angular/core';

import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-filter-location',
  templateUrl: './filter-location.component.html',
  styleUrls: ['./filter-location.component.scss']
})

export class FilterLocationComponent implements OnChanges {
  @Input() countries;
  @Input() all_countries;
  @Input() endpoint: string;

  params;

  constructor(private requestSvc: RequestParametersService) {
  }

  ngOnInit() {
    switch (this.endpoint) {
      case "patient":
        this.requestSvc.patientParamsState$.subscribe(params => {
          this.params = params;
        })
        break;

      case "sample":
        this.requestSvc.sampleParamsState$.subscribe(params => {
          this.params = params;
        })
        break;
    }
  }

  ngOnChanges() {
    console.log(this.countries);
    if (this.countries && this.countries.length > 0) {
      this.addMissing();
      this.updateCountrySelections(this.params)
    }

  }

  updateCountrySelections(params, fieldName = "country.identifier") {
    let filtered = params.filter(d => d.field === fieldName);

    let selectedCountries = filtered.flatMap((d: any) => d.value);
    console.log(selectedCountries)

    this.countries.forEach((d: any) => {
      d['disabled'] = !selectedCountries.includes(d.term);
    })


    console.log(this.countries);

  }

  selectCountry(ctry: string) {
    let idx = this.countries.findIndex(d => d.term === ctry);
    this.countries[idx].disabled = !this.countries[idx].disabled;

    let countries = this.countries.filter(d => !d.disabled).map(d => d.term);
    console.log(countries);

    this.requestSvc.updateParams(this.endpoint, { field: 'country.identifier', value: countries })
  }

  addMissing() {
    let keys = this.countries.map(d => d.term);
    console.log(this.countries)
    console.log(this.all_countries)
    console.log(keys)
    if (this.all_countries) {
      let missing_data = this.all_countries.filter(d => !keys.includes(d.term));

      missing_data.forEach(d => {
        this.countries.push({ term: d.term, count: 0, disabled: true });
      })
    }
  }

}
