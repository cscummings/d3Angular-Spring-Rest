import { Component, OnInit } from '@angular/core';
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
  count: number;

  constructor(private pathosBatchService: PathosBatchService) {}

  ngOnInit() {
    this.pathosBatchService.getCurrentBatchCount()
    .subscribe((data) => {
      this.count = data;
      this.MapCount();
    });
  }

  MapCount() {
    console.log('init appComponent');
    this.pathosBatchService.getCurrentBatchCount()
      .map( (data) => {
        console.log('batch count' + data);
        this.count = data;
        console.log('this.count ' + this.count)
      })
      .catch((error) => {
         console.log('error ' + error)
         throw error;
      });
  }
}
