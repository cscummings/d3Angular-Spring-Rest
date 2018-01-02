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
    const margin: any = {top: 20, right: 20, bottom: 70, left: 40};
    const width: any = 400 - margin.left - margin.right;
    const height: any = 400 - margin.left - margin.right;

    const element = this.barChartContainer.nativeElement;
    const host = d3.select(element);

    let barData: BData[];

    this.dataService.$dataB.subscribe(dataB => {
      barData = dataB;
    });

    const parseDate = d3.timeParse('%m/%d/%Y');

    barData.forEach(function(d) {
      d.date = parseDate(d.date);
      d.RecordInBatch = +d.RecordInBatch;
      });

   const x: any = d3.scaleTime().range([0,  width]);
    // const x: any = d3.scaleTime()
    //                  .range([0,  width]);

    const y: any = d3.scaleLinear()
                    .range([ height, 0]);

    const xAxis: any = d3.axisBottom(x);

    const yAxis = d3.axisLeft(y);

    host.html('');
    const svg = host.append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.top + margin.right)
                    .append('g')
                    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

    x.domain = (d3.extent(barData, function(d) { return d.date ; }));
    y.domain = (d3.extent(barData, function(d) { return d.RecordInBatch; }));

    let chart = svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis);

    chart = svg.append('g')
    .attr('class', 'y axis')
    .attr('transform', 'translate(0,' +  height  + ')')
    .call( yAxis)
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '.71em')
    .style('text-anchor', 'end')
    .text(' # Records');


    svg.selectAll('.bar')
    .data( barData)
    .enter().append('rect')
    .attr('class', 'bar')
    .style('fill', 'steelblue')
    .attr('x', d =>  x(d.date))
    .attr('width',  x.bandwidth())
    .attr('y', d =>  y(d.RecordInBatch))
    .attr('height', function(d) {return height -  y(d.RecordInBatch); }  );

    // chart = svg.append('g')
    //                 //.attr('class', 'x axis')
    //                 .call(d3.axisBottom(x));
    //                 // .selectAll('text')
    //                 // .append('text')
    //                 // .attr('transform', 'rotate(-90)' )
    //                 // .attr('dx', '-.8em')
    //                 // .attr('dy', '-.55em')
    //                 // .style('text-anchor', 'end');



  }

  updateChart() {

  }
}
