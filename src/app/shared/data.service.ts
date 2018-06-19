import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IData } from './data.interface';
import { BData } from './data.interface';


@Injectable()
export class DataService {
    private mockBData: BData[] = [
      {
        date: '1/1/2018',
        RecordInBatch: 271
      },
      {
        date: '1/2/2018' ,
        RecordInBatch: 120

      },
      {
        date: '1/3/2018' ,
        RecordInBatch: 71

      },
      {
        date: '1/4/2018' ,
        RecordInBatch: 64

      },
      {
        date: '1/5/2018' ,
        RecordInBatch: 34

      },
      {
        date: '1/6/2018' ,
        RecordInBatch: 12

      }
    ];

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
