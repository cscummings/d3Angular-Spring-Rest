import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { BData } from '../data.interface';
import { DataService } from '../data.service';


@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarchartComponent implements OnInit, OnChanges {
  @ViewChild('containerBarChart') private barChartContainer: ElementRef;

  constructor(private dataService: DataService ) { }

  ngOnInit() {
    this.createChart();
  }

  ngOnChanges() {
      this.updateChart();
  }

  createChart() {

    let barData: BData[];

    const margin: any = {top: 20, right: 20, bottom: 70, left: 40};
    const width: any = 400 - margin.left - margin.right;
    const height: any = 400 - margin.left - margin.right;

    const element = this.barChartContainer.nativeElement;
    const host = d3.select(element);
    this.dataService.$dataB.subscribe(dataB => {
      barData = dataB;
    });

     host.html('');
     const svg = host.append('svg')
                    .data([barData])
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.right)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    const parseDate = d3.timeParse('%m/%d/%Y');

//    const xScale: any = d3.scaleBand().rangeRound([0,  width]);
    const xScale: any = d3.scaleTime().range([0,  width]);
    const yScale: any = d3.scaleLinear().range([ height, 0]);

    barData.forEach(function(d) {
      d.date = parseDate(d.date);
      d.RecordInBatch = +d.RecordInBatch;
      });

    xScale.domain = ( barData.map(function(d) { return d.date; }));
    yScale.domain = ([0, d3.max( barData, function(d) { return d.RecordInBatch; })]);

    const xAxis: any = d3.axisBottom( xScale)
                        .ticks(d3.timeDay, 1)
                         .tickFormat(d3.timeFormat('%m/%d/%Y'));
    const yAxis = d3.axisLeft( yScale)
                    .ticks(10);

     let chart =  svg.append('g')
                    .attr('class', 'x axis')
                    .attr('transform', 'translate(0,' +  height  + ')')
                    .call( xAxis)
                    .selectAll('text')
                    .append('text')
                    .attr('transform', 'rotate(-90)' )
                    .attr('dx', '-.8em')
                    .attr('dy', '-.55em')
                    .style('text-anchor', 'end');

     chart =  svg.append('g')
                .attr('class', 'y axis')
                .call( yAxis)
                .append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 6)
                .attr('dy', '.71em')
                .style('text-anchor', 'end')
                .text('Records');

     chart =  svg.selectAll('bar')
                .data( barData)
                .enter().append('rect')
                .style('fill', 'steelblue')
                .attr('x', d =>  xScale(d.date))
                .attr('width',  xScale.bandwidth())
                .attr('y', d =>  yScale(d.RecordInBatch))
                .attr('height', d =>  height -  yScale(d.RecordInBatch));


  }

  updateChart() {

  }
}
