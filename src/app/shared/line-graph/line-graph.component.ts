import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css']
})
export class LineGraphComponent implements OnInit, OnChanges {
  @ViewChild('simpleLineChart') private lineChartContainer: ElementRef;
  @Input() private data: Array<any>;

  private chart: any;
  private margin: any = {top: 20, right: 20, bottom: 30, left: 20};
  private width: any = 400 - this.margin.left - this.margin.right;
  private height: any = 400 - this.margin.left - this.margin.right;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private xDomain: any;
  private yDomain: any;

  constructor() { }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }

  }

  createChart() {
    const element = this.lineChartContainer.nativeElement;
    const parseDate = d3.timeParse('%Y-%m-%d');

    const svg = d3.select(element[0])
    .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.right)
    .append('g')
    .attr('transform', 'translate(${this.margin.left}, ${this.margin.top} )');


    this.data.forEach(function(d) {
      d.date = parseDate(d.DATE);
      d.RecordInBatch = +d.RECORDINBATCH;
      });

    this.xScale = d3.scaleTime()
                  .range([0, this.width])
                  .domain(d3.extent(this.data, function(d) { return d.date; }));
    this.yScale = d3.scaleLinear()
                  .range([this.height, 0])
                  .domain(d3.extent(this.data, function(d) { return d.RecordInBatch; }));

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

// resolve later with dataService module and data.object injectables;
    const line = d3.line();
    // .x(d => this.xScale(d.date))
    // .y(d => this.yScale(d.RecordInBatch));

    this.chart = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,${this.height})')
    .call(this.xAxis);

  this.chart = svg.append('g')
    .attr('class', 'y axis')
    .call(this.yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(' # Records');

  this.chart = svg.append('path')
    .datum(this.data)
    .attr('class', 'line')
    .attr('d', line);
  }

  updateChart() {

  }



}
