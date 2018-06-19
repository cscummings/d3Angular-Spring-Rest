import * as d3 from 'd3';
import { Component, OnInit, OnChanges, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';
import { BData } from '../data.interface';
import { PathosBatchService, BDataResponse } from '../pathos-batch.service';

@Component({
  selector: 'app-line-graph',
  templateUrl: './line-graph.component.html',
  styleUrls: ['./line-graph.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class LineGraphComponent implements OnInit, OnChanges {
  @ViewChild('containerLineChart') private lineChartContainer: ElementRef;
  // @Input() private data: Array<any>;
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  private lineComponent: this;

  public lineData: BData[] ;

  constructor(private pathosBatchService: PathosBatchService ) { }

  ngOnInit() {
    this.pathosBatchService.loadAllbatches().subscribe((lineData) => {
      this.lineData = lineData;
      this.createChart();
    });

  }

  ngOnChanges() {
      this.updateChart();
  }

  createChart() {
    const margin: any = {top: 20, right: 20, bottom: 30, left: 20};
    const width: any = 400 - margin.left - margin.right;
    const height: any = 400 - margin.left - margin.right;

    const element = this.lineChartContainer.nativeElement;
    const host = d3.select(element);

   const linedata = this.lineData;

    this.pathosBatchService.loadAllbatches().map( (data) => {
      console.log('bar data' + data);
      this.lineData = data;
      console.log('this.bardata ' + this.lineData)
})
.catch((error) => {
 console.log('error ' + error)
 throw error;
});

    // move this code to HttpClient service since incoming date will be string
    const parseDate = d3.timeParse('%m/%d/%Y');

    linedata.forEach(function(d) {
      d.date = parseDate(d.date);
      d.RecordInBatch = +d.RecordInBatch;
      });

    const x: any = d3.scaleTime()
               .range([0, width]);

    const y: any = d3.scaleLinear()
               .range([height, 0]);

    const xAxis = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    const line = d3.line<BData>()
    .x(function(d, i, data) { return x(d.date) ; })
    .y(function(d , i , data) { return y(d.RecordInBatch) ; });

    host.html('');
    const svg = host.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.right)
    .append('g')
    .attr('transform', 'translate(' + margin.left  + ',' + margin.top + ')');

    x.domain(d3.extent(linedata, function(d) { return d.date ; }));
    y.domain(d3.extent(linedata, function(d) { return d.RecordInBatch; }));

    let chart = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

     chart = svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(' # Records');

    chart = svg.append('path')
    .datum(linedata)
    .attr('class', 'line')
    .attr('d', line);
  }

  updateChart() {

  }



}
