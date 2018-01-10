import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/data.service';
import { IData, BData } from './shared/data.interface';
import { PathosBatchService } from './shared/pathos-batch.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'D3 Chart Examples';
  data: IData[];
  dataB: BData[];

  newQueuenm: string;
  newCase: number;

  constructor(private dataService: DataService, private pathosBatchService: PathosBatchService) {}

  ngOnInit() {
    this.dataService.$data.subscribe(data => {
      this.data = data;
    });

    this.dataService.$dataB.subscribe(dataB => {
      this.dataB = dataB;
    });

  }

}
