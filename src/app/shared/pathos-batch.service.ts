import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http' ;
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';

import { BData } from './data.interface';
import { AppSettings } from '../appSettings';

@Injectable()
export class PathosBatchService {

  public batches: BData[];
  public dateCounts: any;
  public currentCount: any;
  public totalQueueCount: any;

  constructor(private http: HttpClient, private inurls: string[]) {
  }


  // public getSurveyQuestion(): Observable<ISurvey[]>{
  //   return this.http
  //     .get<ISurvey[]>('./src/survey.json')
  //     .do(data => console.log('All : ' + JSON.stringify(data)))
  //     .catch(this.handleError);
  // }

  public loadAllbatches() {
    console.log('Fetching all batch ids');
//        Make the HTTP request:
        this.http.get(AppSettings.BATCH_SERVICE_API).subscribe(data => {
           // Read the result field from the JSON response.
          console.log('Fetched successfully all batch entries');
          this.batches = data['results'];
        } ,
        (err: HttpErrorResponse) => {
          this.handleError(err);
        }) ;
        return this.batches;
  }

  public getAllBatches() {
    return this.batches;
  }

  public getDateCounts() {
    console.log('Fetching Date Counts');
    return this.http
      .get(AppSettings.BATCH_SERVICE_API_CURRENT_COUNT)
      .map(response => this.dateCounts = response.toString())
      .catch(e => {
        return Observable.throw(new Error('${ e.status } ${ e.statusText }'));
      });
  }

  public getAllDateCounts() {
    return this.dateCounts;
  }

  public getCurrentBatchCount() {
    console.log('Fetching Current Count');
      return this.http
      .get(AppSettings.BATCH_SERVICE_API_CURRENT_COUNT)
      .map(response => this.currentCount = response.toString())
      .catch(e => {
        return Observable.throw(new Error('${ e.status } ${ e.statusText }'));
      });
  }

  public fetchCurrentCount() {
    return this.currentCount;
  }

  public getTotalQueueCount() {
    console.log('Fetching Total Queue Count');
     return this.http
     .get(AppSettings.BATCH_SERVICE_TOTALQUEUE_COUNT)
     .map(response => this.totalQueueCount = response.toString())
     .catch(e => {
       return Observable.throw(new Error('${ e.status } ${ e.statusText }'));
     });
 }

  public fetchTotalQueueCount() {
    return this.totalQueueCount;
  }

  private extractData(res: any) {
    return res || {};
}
  private handleError(error: HttpErrorResponse) {
    console.error(error);
    let errorMessage = '';
    if (error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${
        error.status
      }, error message is: ${error.message}`;
    }
    console.error(errorMessage);
    return Observable.throw(errorMessage);
  }
}
