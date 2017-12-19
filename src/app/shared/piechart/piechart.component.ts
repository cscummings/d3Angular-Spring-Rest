import { Component, OnInit, OnChanges, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import * as d3 from 'd3';
import { IData } from '../data.interface';
import { DataService } from '../data.service';

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit, OnChanges {
  @ViewChild('containerPieChart') private pieChartContainer: ElementRef;
  // @Input() private data: Array<any>;


  private chart: any;
  private host: any;
  private svg: any;
  private pieData: IData[];

  private margin: any = {top: 20, right: 20, bottom: 30, left: 20};
  private width: any = 400 - this.margin.left - this.margin.right;
  private height: any = 400 - this.margin.left - this.margin.right;
  private radius: number = Math.min(this.width, this.height) / 2;
  private aColor: any = d3.scaleOrdinal(['Blue', 'SkyBlue', 'Green', 'Orange', 'Purple', 'Red', 'Sienna']);

  constructor(private dataService: DataService ) { }

  ngOnInit() {
    this.createChart();
    if (this.pieData) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    if (this.chart) {
      this.updateChart();
    }

  }

  createChart() {
    const element = this.pieChartContainer.nativeElement;
    this.host = d3.select(element);
    this.dataService.$data.subscribe(data => {
      this.pieData = data;
    });

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
