import * as d3 from 'd3';
import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
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
import { IData } from '../data.interface';
import { PathosBatchService, BDataResponse } from '../pathos-batch.service';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit, OnChanges {
  @ViewChild('containerPieChart') private pieChartContainer: ElementRef;
  // @Input() private data: Array<any>;

  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  private lineComponent: this;

  public pieData: IData[] ;

  private chart: any;
  private host: any;
  private svg: any;

  private margin: any = {top: 20, right: 20, bottom: 30, left: 20};
  private width: any = 400 - this.margin.left - this.margin.right;
  private height: any = 400 - this.margin.left - this.margin.right;
  private radius: number = Math.min(this.width, this.height) / 2;
  private aColor: any = d3.scaleOrdinal(['Blue', 'SkyBlue', 'Green', 'Orange', 'Purple', 'Red', 'Sienna']);

  constructor(private pathosBatchService: PathosBatchService ) { }

  ngOnInit() {
    this.pathosBatchService.getTotalQueueCount().subscribe((data) => {
      this.pieData = data;
      this.createChart();
    });

  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }

  }

  createChart() {
    const element = this.pieChartContainer.nativeElement;
    this.host = d3.select(element);
    // this.dataService.$data.subscribe(data => {
    //   this.pieData = data;
    // });

    this.host.html('');
    this.svg = this.host.append('svg')
    .data([this.pieData])
    .attr('width', this.width + this.margin.left + this.margin.right)
    .attr('height', this.height + this.margin.top + this.margin.right)
    .append('g')
    .attr('transform', 'translate(' + this.width / 2  + ',' + this.height / 2 + ')');

    const values: number[] = this.pieData.map(data => data.CASES);

    const pie = d3.pie();
    const path = d3.arc().outerRadius( this.radius - 10).innerRadius(0);

    const label = d3.arc()
                  .outerRadius(this.radius - 40)
                  .innerRadius( this.radius - 40);


    const arc = this.svg.selectAll('.arc')
              .data(pie(values))
              .enter().append('g')
              .attr('class', 'arc');

    const pieColor = d3.scaleOrdinal(['Blue', 'SteelBlue', 'Green', 'Orange', 'Purple', 'Red', 'Sienna']);

    arc.append('path')
        .attr('d', path )
        .attr('fill', function(d, i) {
          return pieColor(i);
        });

    arc.append('text')
    .attr('transform', (datum: any) => {
      datum.innerRadius = 0;
      datum.outerRadius = this.radius;
      return 'translate(' + label.centroid(datum) + ')';
      })
    .attr('dy', '0.35em')
    .text((datum, index) => this.pieData[index].CASES)
    .style('text-anchor', 'middle');
//    .text(function(d) { return d.data ; } );

  }

  updateChart() {

  }

}
