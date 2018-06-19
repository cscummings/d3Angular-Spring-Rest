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
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarchartComponent implements OnInit, OnChanges {
  @ViewChild('containerBarChart') private barChartContainer: ElementRef;
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  private barComponent: this;

  public barData: BData[] ;

  constructor(private pathosBatchService: PathosBatchService ) { }

  ngOnInit() {
    this.pathosBatchService.loadAllbatches().subscribe((barData) => {
      this.barData = barData;
      this.createChart();
    });

  }

  ngOnChanges() {
      this.updateChart();
  }

  createChart() {
    const margin: any = {top: 20, right: 20, bottom: 70, left: 40};
    const width: any = 400 - margin.left - margin.right;
    const height: any = 400 - margin.left - margin.right;

    const element = this.barChartContainer.nativeElement;
    const host = d3.select(element);

    const parseDate = d3.timeParse('%m/%d/%Y');

    this.pathosBatchService.loadAllbatches().map( (data) => {
           console.log('bar data' + data);
           this.barData = data;
           console.log('this.bardata ' + this.barData)
    })
    .catch((error) => {
      console.log('error ' + error)
      throw error;
    });

    const bardata = this.barData;
    bardata.forEach(function(d) {
      d.date = parseDate(d.date);
      d.RecordInBatch = +d.RecordInBatch;
      });

    const x: any = d3.scaleBand().rangeRound([0, width]).padding(0.1);

    const y: any = d3.scaleLinear()
                    .range([ height, 0]);

    const xAxis: any = d3.axisBottom(x)
                          .scale(x)
                          .tickFormat(d3.timeFormat('%m/%d/%Y')) ;

    const yAxis = d3.axisLeft(y)
     .scale(y).ticks(10);

    host.html('');
    const svg = host.append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.right)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain(this.barData.map((d) => d.date)) ;
    y.domain([0, d3.max(this.barData, (d) => d.RecordInBatch )]);

    let chart = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .append('text')
    .style('text-anchor', 'end')
    .attr('dx', '-.8em')
    .attr('dy', '-.55em')
    .attr('transform', 'rotate(-90)' );

    chart = svg.append('g')
    .attr('class', 'y axis')
    .call( yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(' # Records');


    svg.selectAll('bar')
    .data( this.barData)
    .enter().append('rect')
    .attr('class', 'bar')
    .style('fill', 'steelblue')
    .attr('x', (d) =>  x(d.date))
    .attr('width',  x.bandwidth())
    .attr('y', (d) =>  y(d.RecordInBatch))
    .attr('height', function(d) {return height -  y(d.RecordInBatch); }  );

  }

  updateChart() {

  }
}
