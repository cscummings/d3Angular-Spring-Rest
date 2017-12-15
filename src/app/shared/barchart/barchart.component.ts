import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarchartComponent implements OnInit, OnChanges {
  @ViewChild('barChart') private barChartContainer: ElementRef;
  @Input() private data: Array<any>;

  private chart: any;
  private margin: any = {top: 20, right: 20, bottom: 70, left: 40};
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
  // set width and height here instead
  const element = this.barChartContainer.nativeElement;
  const svg = d3.select(element[0])
    .append('svg')
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.right)
    .append('g')
    .attr('transform', 'translate(${this.margin.left}, ${this.margin.top} )');

  const parseDate = d3.timeParse('%Y-%m-%d');

  this.xScale = d3.scaleBand().rangeRound([0, this.width]);
  this.yScale = d3.scaleLinear().range([this.height, 0]);

  this.xAxis = d3.axisBottom(this.xScale).tickFormat(d3.timeFormat('%Y-%m-%d'));
  this.yAxis = d3.axisLeft(this.yScale).ticks(10);

  this.xDomain = (this.data.map(function(d) { return d.date; }));
  this.yDomain = ([0, d3.max(this.data, function(d) { return d.RecordInBatch; })]);

  this.data.forEach(function(d) {
    d.date = parseDate(d.DATE);
    d.RecordInBatch = +d.RECORDINBATCH;
    });

  this.chart = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,${this.height})')
    .call(this.xAxis)
    .selectAll('text')

    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '-.55em')
    .attr('transform', 'rotate(-90)' );

  this.chart = svg.append('g')
    .attr('class', 'y axis')
    .call(this.yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text('Records');

  this.chart = svg.selectAll('bar')
    .data(this.data)
    .enter().append('rect')
    .style('fill', 'steelblue')
    .attr('x', d => this.xScale(d.date))
    .attr('width', this.xScale.rangeBand())
    .attr('y', d => this.yScale(d.RecordInBatch))
    .attr('height', d => this.height - this.yScale(d.RecordInBatch));


  }

  updateChart() {

  }
}
