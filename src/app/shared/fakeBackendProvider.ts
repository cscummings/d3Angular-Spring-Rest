
import {throwError as observableThrowError,  Observable, of } from 'rxjs';

import {dematerialize, delay, materialize, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { HttpRequest, HttpResponse, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from '@angular/common/http';
import { of as observableOf } from 'rxjs/observable/of'
// add app settings to get URLS
import { AppSettings } from '../appSettings';
import { IData } from './data.interface';
import { BData } from './data.interface';


@Injectable()
export class FakeBackendInterceptor implements HttpInterceptor {
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

    constructor() { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // array in local storage for registered users
        // follow suit for other url interactions.
        const users: any[] = JSON.parse(localStorage.getItem('users')) || [];

        // wrap in delayed observable to simulate server api call
        return observableOf(null).pipe(mergeMap(() => {

             // break up requests into individual functions

             // return simple count
             if (request.url.endsWith('/PathometerApplication/api/pathos_batch/') && request.method === 'GET') {
              console.log('fakeBackendProvider.intercept() :' + ' /api/pathos_batch ' + request) ;
//              const data = JSON.stringify(this.mockBData);
              const body = { any: this.mockBData } ;
              console.log('fakeBackendProvider.intercept()' + this.mockBData) ;
              return observableOf(new HttpResponse({ status: 200, body: body }));

             }

            // authenticate
            if (request.url.endsWith('/api/authenticate') && request.method === 'POST') {
                // find if any user matches login credentials
                const filteredUsers = users.filter(user => {
                    return user.username === request.body.username && user.password === request.body.password;
                });

                if (filteredUsers.length) {
                    // if login details are valid return 200 OK with user details and fake jwt token
                    const user = filteredUsers[0];
                    const body = {
                        id: user.id,
                        username: user.username,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        token: 'fake-jwt-token'
                    };

                    return observableOf(new HttpResponse({ status: 200, body: body }));
                } else {
                    // else return 400 bad request
                    return observableThrowError('Username or password is incorrect');
                }
            }

            // get users
            if (request.url.endsWith('/api/users') && request.method === 'GET') {
                // check for fake auth token in header and return users if valid,
                // this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    return observableOf(new HttpResponse({ status: 200, body: users }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return observableThrowError('Unauthorised');
                }
            }

            // get user by id
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'GET') {
                // check for fake auth token in header and return user if valid,
                // this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1] , 10);
                    // tslint:disable-next-line:no-shadowed-variable
                    const matchedUsers = users.filter(user =>  user.id === id);
                    const user = matchedUsers.length ? matchedUsers[0] : null;

                    return observableOf(new HttpResponse({ status: 200, body: user }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return observableThrowError('Unauthorised');
                }
            }

            // create user
            if (request.url.endsWith('/api/users') && request.method === 'POST') {
                // get new user object from post body
                const newUser = request.body;

                // validation
                const duplicateUser = users.filter(user => user.username === newUser.username).length;
                if (duplicateUser) {
                    return observableThrowError('Username "' + newUser.username + '" is already taken');
                }

                // save new user
                newUser.id = users.length + 1;
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));

                // respond 200 OK
                return observableOf(new HttpResponse({ status: 200 }));
            }

            // delete user
            if (request.url.match(/\/api\/users\/\d+$/) && request.method === 'DELETE') {
                // check for fake auth token in header and return user if valid,
                // this security is implemented server side in a real application
                if (request.headers.get('Authorization') === 'Bearer fake-jwt-token') {
                    // find user by id in users array
                    const urlParts = request.url.split('/');
                    const id = parseInt(urlParts[urlParts.length - 1], 10);
                    for (let i = 0; i < users.length; i++) {
                        const user = users[i];
                        if (user.id === id) {
                            // delete user
                            users.splice(i, 1);
                            localStorage.setItem('users', JSON.stringify(users));
                            break;
                        }
                    }

                    // respond 200 OK
                    return observableOf(new HttpResponse({ status: 200 }));
                } else {
                    // return 401 not authorised if token is null or invalid
                    return observableThrowError('Unauthorised');
                }
            }

            // pass through any requests not handled above
            return next.handle(request);

        }),

        // call materialize and dematerialize to ensure delay
        // even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648)
        materialize(),
        delay(500),
        dematerialize(), );
    }
}

export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: HTTP_INTERCEPTORS,
    useClass: FakeBackendInterceptor,
    multi: true
};
