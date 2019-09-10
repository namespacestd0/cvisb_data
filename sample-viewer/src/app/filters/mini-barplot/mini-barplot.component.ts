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

      // transition
      var t = d3.transition()
        .duration(tDuration);

      // Handle into filtering by virus type
      let filterOutcome = function(endpoint: string, requestSvc: any) {
        return function(d) {
          console.log(d)
          requestSvc.updateParams(endpoint, { field: 'outcome', value: d.term })

        }
      }

      // --- Update domains ---
      this.x.domain([0, <any>d3.max(this.data, (d: any) => d.count)]);

      this.y
        .domain(this.options);

      this.yAxis = d3.axisRight(this.y);

      // --- Create axes ---
      // svg.append('g')
      //   .attr('class', 'axis axis--y')
      //   .attr('transform', `translate(${this.margin.left + this.width}, ${this.margin.top})`)
      //   .call(this.yAxis);


      // --- Create bars ---
      let bars_data = this.bars
        .selectAll("rect")
        .data(this.data);

      bars_data.exit()
        // .transition()
        // .duration(10)
        // .style("fill-opacity", 1e-6)
        .remove();

      bars_data.enter().append("rect")
        .attr("class", "minirect")
        .merge(bars_data)
        .attr("id", (d: any) => this.strip.transform(d[this.name_var]))
        // .attr("x", this.x(0))
        .attr("y", (d: any) => this.y(d[this.name_var]))
        .attr("height", this.y.bandwidth())
        // .attr("width", 0)
        .transition(t)
        .attr("x", (d: any) => this.x(d.count))
        .attr("width", (d: any) => this.x(0) - this.x(d.count));

      this.chart.selectAll("rect")
        .on("click", filterOutcome(this.endpoint, this.requestSvc));


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
      let labels = this.ylabels.selectAll("text")
        .data(this.data);

      labels.exit()
        // .transition(t)
        // .style("fill-opacity", 1e-6)
        .remove()

      labels.enter().append("text")
        .attr("class", "annotation")
        .attr("x", (d: any) => this.x(0))
        .attr("dx", 6)
        .style("font-size", Math.min(this.y.bandwidth(), 14))
        .merge(labels)
        .attr("y", (d: any) => this.y(d[this.name_var]) + this.y.bandwidth() / 2)
        .classed('disabled', (d: any) => d.count === 0)
        .transition(t)
        // .style("fill-opacity", 1)

        .text((d: any) => (d[this.name_var]));


      // Container for the annotation
      // this.ylabels
      //   .selectAll(".y-label")
      //   .data(this.data).enter().append("g")
      //   .attr("id", (d: any) => this.strip.transform(d[this.name_var]));
      //
      // // Dummy rectangle, if need to turn into a button
      // ylabels.append("rect");
      //
      // // Actual label for the annotation
      // ylabels.append("text")
      //   .attr("class", "annotation")
      //   .attr("x", (d: any) => this.x(0))
      //   .attr("y", (d: any) => this.y(d[this.name_var]) + this.y.bandwidth() / 2)
      //   .attr("dx", 6)
      //   .style("font-size", Math.min(this.y.bandwidth(), 14))
      //   .text((d: any) => (d[this.name_var]));
      //
      // let getTextBox = function(selection) {
      //   selection.each(function(d) { d.bbox = this.getBBox(); })
      // };
      //
      // if (this.name_var === 'type') {
      //   ylabels.selectAll('text')
      //     .attr("dx", 10)
      //     .style("font-size", Math.min(this.y.bandwidth(), 14) * 0.8)
      //     .call(getTextBox);
      //
      //   ylabels.insert("rect", "text")
      //     .attr("class", "rect faux-button")
      //     .attr("x", function(d) { return d.bbox.x - 4 })
      //     .attr("y", function(d) { return d.bbox.y - 2 })
      //     .attr("width", function(d) { return d.bbox.width + 8 })
      //     .attr("height", function(d) { return d.bbox.height + 4 })
      // }
    }
  }

}
