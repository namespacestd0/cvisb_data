import { Component, OnInit, Input, ViewEncapsulation, ViewChild, ElementRef, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import * as d3 from 'd3';

import { StripWhitespacePipe } from '../../_pipes';

// Event listeners to update the search query
import { RequestParametersService } from '../../_services';

@Component({
  selector: 'app-mini-barplot',
  templateUrl: './mini-barplot.component.html',
  styleUrls: ['./mini-barplot.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class MiniBarplotComponent implements OnInit {
  @ViewChild('barplot') private chartContainer: ElementRef;
  @Input() private data: any;
  @Input() private options: string[];
  @Input() private endpoint: any;
  @Input() private height: number;
  @Input() private spacing: number;
  @Input() private name_var: string;

  private selectedOutcomes: string[];

  // plot sizes
  private element: any;
  private margin: any = { top: 2, bottom: 2, left: 40, right: 100 };
  private width: number = 70;
  // private height: number = 70;

  // --- Selectors ---
  private chart: any; // dotplot
  private bars: any;
  private bars_annotations: any;
  private ylabels: any;

  // --- Scales/Axes ---
  private x: any;
  private y: any;
  private yAxis: any;

  getSVGDims() {
    // Find container; define width/height of svg obj.
    this.element = this.chartContainer.nativeElement;

    if (!this.spacing) {
      // space between barplots
      this.spacing = 0.2;
    }
  }


  // constructor() { }
  constructor(private strip: StripWhitespacePipe,
    private requestSvc: RequestParametersService,
    // Whether to be rendered server-side or client-side
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.getSVGDims();
      this.createPlot();

      switch (this.endpoint) {
        case "patient":
          this.requestSvc.patientParamsState$.subscribe(params => {
            console.log(params)
            this.selectedOutcomes = this.getSelected(params);
          })
          break;

        case "sample":
          this.requestSvc.sampleParamsState$.subscribe(params => {
            this.selectedOutcomes = this.getSelected(params);
          })
          break;
      }
    }
  }

  getSelected(params, fieldName = "outcome") {
    let filtered = params.filter(d => d.field === fieldName);

    if (filtered.length === 1) {
      return (filtered[0].value);
    } else {
      return (this.options);
    }
  }


  ngOnChanges() {
    this.updatePlot(1000);
  }

  createPlot() {
    this.data = this.data.sort((a: any, b: any) => b.count - a.count);

    // Append SVG
    const svg = d3.select(this.element)
      .append('svg')
      .attr("class", "barplot")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom);

    // selectors
    this.chart = svg.append("g")
      .attr("id", "barplot")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    // --- x & y axes --
    this.x = d3.scaleLinear()
      .rangeRound([this.width, 0]);

    this.y = d3.scaleBand()
      .rangeRound([0, this.height])
      .paddingInner(this.spacing)
      .paddingOuter(0);

    // --- create g selectors ---
    this.bars = this.chart.append("g")
      .attr("class", 'bars');

    this.bars_annotations = this.chart.append("g")
      .attr("class", 'bar--annot');

    this.ylabels = this.chart
      .append("g")
      .attr("class", 'y-label');

    // --- call function to add data, with transition time = 0 ---
    this.updatePlot(0);
  }

  updatePlot(tDuration: number) {
    if (this.x && this.y) {

      // --- Merge in null values ---
      // update the data to add in missing values.
      // Essential for object constancy.
      let keys = this.data.map(d => d.term);

      // If there are no bulk values, set to the keys.
      if (this.options.length === 0) {
        this.options = keys;
      } else {
        let missing_data = this.options.filter(d => !keys.includes(d));
        missing_data.forEach(d => {
          this.data.push({ term: d, count: 0 });
        })
      }

      // if selectedCohorts doesn't exist, set to the cohorts.
      if (!this.selectedOutcomes) {
        this.selectedOutcomes = this.options;
      }
      this.data.forEach(d => {
        d['selected'] = this.selectedOutcomes.includes(d.term) ? true : false;
      })


      // transition
      var t = d3.transition()
        .duration(tDuration);

      // Handle into filtering by virus type
      let filterOutcome = function(endpoint: string, requestSvc: any, data: any[]) {
        return function(selected) {
          console.log(selected)
          // reverse the selection
          let idx = data.findIndex(d => d.term == selected.term);
          if (idx > -1) {
            data[idx]['selected'] = !selected.selected;
          }

          // flip the checkbox path on/off
          // d3.selectAll(".checkmark").style("display", (d: any) => d.selected ? "block" : "none");
          d3.selectAll(".checkmark")
            .text((d: any) => d.selected ? "\uf14a" : "\uf0c8")
            .classed("checked", (d: any) => d.selected);

          let outcomes = data.filter(d => d.selected).map(d => d.term);

          requestSvc.updateParams(endpoint, { field: 'outcome', value: outcomes })
        }
      }

      // --- Update domains ---
      this.x.domain([0, <any>d3.max(this.data, (d: any) => d.count)]);

      this.y
        .domain(this.options);

      this.yAxis = d3.axisRight(this.y);

      // --- Create bars ---
      let bars_data = this.bars
        .selectAll("rect")
        .data(this.data);

      bars_data.exit()
        .remove();

      bars_data.enter().append("rect")
        .attr("class", "minirect")
        .merge(bars_data)
        .attr("id", (d: any) => this.strip.transform(d[this.name_var]))
        .attr("y", (d: any) => this.y(d[this.name_var]))
        .attr("height", this.y.bandwidth())
        .transition(t)
        .attr("x", (d: any) => this.x(d.count))
        .attr("width", (d: any) => this.x(0) - this.x(d.count));

      // this.chart.selectAll("rect")
      //   .on("click", filterOutcome(this.endpoint, this.requestSvc));

      // --- Annotate bars ---
      let bars_labels = this.bars_annotations.selectAll("text")
        .data(this.data);

      bars_labels.exit()
        .transition(t)
        .style("fill-opacity", 1e-6)
        .remove();


      bars_labels.enter().append("text")
        .attr("class", "annotation")
        .attr("id", (d: any) => this.strip.transform(d[this.name_var]))
        .merge(bars_labels)
        .attr("x", this.x(0))
        .attr("dx", -4)
        .attr("y", (d: any) => this.y(d[this.name_var]) + this.y.bandwidth() / 2)
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .classed('disabled', (d: any) => d.count === 0)
        .text((d: any) => (d.count))
        .transition(t)
        .attr("x", (d: any) => this.x(d.count));


      // Y-label annotations ---
      console.log(this.data)
      let labelGroup = this.ylabels.selectAll(".y-label-group")
        .data(this.data);

      let ylabels = labelGroup.select(".annotation--label");
      let checkmarks = labelGroup.select(".checkmark");


      // --- exit ---
      labelGroup.exit().remove(); // exit, remove the text

      // --- enter ---
      let labelGroupEnter = labelGroup.enter() // enter the text
        .append("text")
        .attr("class", "y-label-group");

      let textEnter = labelGroupEnter
        .append("tspan") // enter the first tspan on the text element
        .attr("dx", 6)
        .attr('class', 'annotation annotation--label');

      let checkmarkEnter = labelGroupEnter
        .append("tspan")
        .attr("dx", 8)
        .attr("class", "checkmark");

      // --- update/merge ---
      labelGroup = labelGroupEnter
        .merge(labelGroup)
        .attr("y", (d: any) => this.y(d[this.name_var]) + this.y.bandwidth() / 2)
        .attr("id", (d: any) => `${d.term}`);

      labelGroup.select(".annotation--label").merge(textEnter)
        .attr("x", this.x(0))
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .merge(labelGroup)
        .classed('disabled', (d: any) => d.count === 0)
        .transition(t)
        .text((d: any) => (d[this.name_var]));

      checkmarks.merge(checkmarkEnter)
        .attr("class", (d: any) => `checkmark ${d.term}`)
        .text(d => d.selected ? "\uf14a" : "\uf0c8")
        .classed("checked", (d: any) => d.selected);

      // --- click listener ---
      this.chart.selectAll(".checkmark")
        .on("click", filterOutcome(this.endpoint, this.requestSvc, this.data));
    }

  }

}
