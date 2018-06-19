
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse, HttpErrorResponse, HttpHeaders } from '@angular/common/http' ;
import {throwError as observableThrowError,  Observable, of } from 'rxjs';
import {catchError, tap} from 'rxjs/operators';

import { BData } from './data.interface';
import { IData } from './data.interface';

import { AppSettings } from '../appSettings';

export interface BDataResponse {
  data: BData[];
}

@Injectable()
export class PathosBatchService {

  public batches: Observable<any>;
  public dateCounts: Observable<string>;
  public currentCount: Observable<string>;
  public totalQueueCount: Observable<string>;

//  constructor(private http: HttpClient, private inurls: string[]) {
  constructor(private http: HttpClient ) {
  }


  // public getSurveyQuestion(): Observable<ISurvey[]>{
  //   return this.http
  //     .get<ISurvey[]>('./src/survey.json')
  //     .do(data => console.log('All : ' + JSON.stringify(data)))
  //     .catch(this.handleError);
  // }


  // Returns an observalbe automatically - which can be subscribed to by invokers
  public loadAllbatches(): Observable<BData[]> {
    console.log('Fetching all batch ids');

//        Make the HTTP request:
         return this.http.get<BData[]>(AppSettings.BATCH_SERVICE_API)
          .pipe(
            tap(data => console.log('got em' + JSON.stringify(data))),
            catchError(e => {
              return observableThrowError(new Error('${ e.status } ${ e.statusText }'));
            }), ) ;
    }


  public getAllBatches() {
    return this.batches;
  }

  public getDateCounts() {
    console.log('Fetching Date Counts');
    return this.http
      .get(AppSettings.BATCH_SERVICE_API_CURRENT_COUNT).pipe(
      tap(data => console.log('getDateCounts :' + JSON.stringify(data))),
      catchError(e => {
        return observableThrowError(new Error('${ e.status } ${ e.statusText }'));
      }), ) ;
  }

  public getAllDateCounts() {
    return this.dateCounts;
  }

  public getCurrentBatchCount() {
    console.log('Fetching Current Count');
      return this.http
      .get(AppSettings.BATCH_SERVICE_API_BACKLOG).pipe(
      tap(data => console.log('getCurrentBatchCounts :' + JSON.stringify(data))),
      catchError(e => {
        return observableThrowError(new Error('${ e.status } ${ e.statusText }'));
      }), ) ;
  }

  public fetchCurrentCount() {
    return this.currentCount;
  }

  public getTotalQueueCount(): Observable<IData[]> {
    console.log('Fetching Total Queue Count');
     return this.http
     .get<IData[]>(AppSettings.BATCH_SERVICE_TOTALQUEUE_COUNT)
     .pipe(
      tap(data => console.log('getTotalQueueCount :' + JSON.stringify(data))),
     catchError(e => {
       return observableThrowError(new Error('${ e.status } ${ e.statusText }'));
     }), ) ;

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
    return observableThrowError(errorMessage);
  }

//  /**
//    * Handle Http operation that failed.
//    * Let the app continue.
//    * @param operation - name of the operation that failed
//    * @param result - optional value to return as the observable result
//    */
//   private handleError<T> (operation = 'operation', result?: T) {
//     return (error: any): Observable<T> => {

//       // TODO: send the error to remote logging infrastructure
//       console.error(error); // log to console instead

//       // TODO: better job of transforming error for user consumption
//       this.log(`${operation} failed: ${error.message}`);

//       // Let the app keep running by returning an empty result.
//       return of(result as T);
//     };
//   }

//   /** Log a HeroService message with the MessageService */
//   private log(message: string) {
//     this.messageService.add('PathosBatchService: ' + message);
//   }
}
