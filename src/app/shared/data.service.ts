import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { IData } from './data.interface';

@Injectable()
export class DataService {
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

    $data = this.dataSubject.asObservable();

    addData(newData: IData) {
        this.mockData.push(newData);
        this.dataSubject.next(this.mockData);
    }
}
