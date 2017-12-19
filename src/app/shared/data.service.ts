import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IData } from './data.interface';
import { BData } from './data.interface';


@Injectable()
export class DataService {
    private mockBData: BData[] = [
      {
        date: new Date('01/01/2018'),
        RecordInBatch: 271
      }];
    //   {
    //     date: '01/02/2018',
    //     RecordInBatch: 2271

    //   },
    //   {
    //     date: '01/03/2018',
    //     RecordInBatch: 71

    //   }
    // ];

    private mockData: IData[] = [
      {
        CASES: 2,
        QUEUE_NM: 'Blue(RD)Non-Lobby'
      },
      {
        CASES: 2,
        QUEUE_NM: 'Blue(Renewals)Non-Lobby'
      },
      {
        CASES: 4,
        QUEUE_NM: 'Green(Intake)Non-Lobby'
      },
      {
        CASES: 62,
        QUEUE_NM: 'Orange(Changes)Non-Lobby'
      },
      {
        CASES: 1,
        QUEUE_NM: 'Purple(Processing)Non-Lobby'
      },
      {
        CASES: 20,
        QUEUE_NM: 'Red(Tanf-Intake)Non-Lobby'
      }
    ];

    private dataSubject = new BehaviorSubject<IData[]>(this.mockData);

    private dataBSubject = new BehaviorSubject<BData[]>(this.mockBData);

    $data = this.dataSubject.asObservable();
    $dataB = this.dataBSubject.asObservable();

    addData(newData: IData) {
        this.mockData.push(newData);
        this.dataSubject.next(this.mockData);
    }
    addBData(newData: BData) {
      this.mockBData.push(newData);
      this.dataBSubject.next(this.mockBData);
  }

}
