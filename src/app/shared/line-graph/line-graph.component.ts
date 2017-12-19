import * as d3 from 'd3';
import { Component, OnInit, OnChanges, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { BData } from '../data.interface';
import { DataService } from '../data.service';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineGraphComponent implements OnInit, OnChanges {
  @ViewChild('containerLineChart') private lineChartContainer: ElementRef;
  // @Input() private data: Array<any>;

  private chart: any;
  private host: any;
  private svg: any;
  private lineData: BData[];
  private margin: any = {top: 20, right: 20, bottom: 30, left: 20};
  private width: any = 400 - this.margin.left - this.margin.right;
  private height: any = 400 - this.margin.left - this.margin.right;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private xDomain: any;
  private yDomain: any;

  constructor(private dataService: DataService ) { }

  ngOnInit() {
    this.createChart();
    if (this.lineData) {
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
    this.host = d3.select(element);
    this.dataService.$dataB.subscribe(dataB => {
      this.lineData = dataB;
    });

    const parseDate = d3.timeParse('%Y-%m-%d');

    this.host.html('');
    this.svg = this.host.append('svg')
    .data([this.lineData])
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.right)
    .append('g')
    .attr('transform', 'translate(' + this.width / 2  + ',' + this.height / 2 + ')');


    // this.lineData.forEach(function(d) {
    //   d.date = parseDate(d.date);
    //   d.RecordInBatch = +d.RecordInBatch;
    //   });

    this.xScale = d3.scaleTime()
                  .range([0, this.width])
                  .domain(d3.extent(this.lineData, function(d) { return d.date; }));
    this.yScale = d3.scaleLinear()
                  .range([this.height, 0])
                  .domain(d3.extent(this.lineData, function(d) { return d.RecordInBatch; }));

    this.xAxis = d3.axisBottom(this.xScale);
    this.yAxis = d3.axisLeft(this.yScale);

    const xValues: Date[] = this.lineData.map(data => data.date);
    const yValues: number[] = this.lineData.map(data => data.RecordInBatch);

    const line = d3.line<BData>()
    //  .x( d => this.xScale(xValues))
    //  .y( d => this.yScale(yValues));
    .x(function(d, i) {return this.xScale(i); })
    .y(function(d) { return this.yScale(d.RecordInBatch); });

    this.chart = this.svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,${this.height})')
    .call(this.xAxis);

  this.chart = this.svg.append('g')
    .attr('class', 'y axis')
    .call(this.yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(' # Records');

  this.chart = this.svg.append('path')
    .datum(this.lineData)
    .attr('class', 'line')
    .attr('dx', line);
  }

  updateChart() {

  }



}
