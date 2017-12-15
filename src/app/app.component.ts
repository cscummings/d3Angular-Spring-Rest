import { Component, OnInit } from '@angular/core';
import { DataService } from './shared/data.service';
import { IData } from './shared/data.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'D3 Chart Examples';
  data: IData[];
  newQueuenm: string;
  newCase: number;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.$data.subscribe(data => {
      this.data = data;
    });
  }

}
