import { TestBed, getTestBed, async, inject } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing' ;
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { PathosBatchService } from './pathos-batch.service';
import { AppSettings } from '../appSettings';

describe('PathosBatchService', () => {
  let injector: TestBed;
  let pathosBatchService: PathosBatchService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PathosBatchService] ,
      imports: [HttpClientTestingModule]
    });
  });

  injector = getTestBed();
  pathosBatchService = injector.get(PathosBatchService);
  httpMock = injector.get(HttpTestingController);

  it('should be created', inject([PathosBatchService], (service: PathosBatchService) => {
    expect(service).toBeTruthy();
  }));

  it('should get Date Counts', inject([PathosBatchService], (service: PathosBatchService) => {
    const theCounts = service.getDateCounts();
    expect(service.getDateCounts()).toBeGreaterThan(0);
    expect(theCounts).toBeGreaterThan(0);
  }));

  it(`should issue a request`,
    // 1. declare as async test since the HttpClient works with Observables
    async(
      // 2. inject HttpClient and HttpTestingController into the test
      inject([HttpClient, HttpTestingController], (http: HttpClient, backend: HttpTestingController) => {
        // 3. send a simple request
        http.get('/foo/bar').subscribe();

        // 4. HttpTestingController supersedes `MockBackend` from the "old" Http package
        // here two, it's significantly less boilerplate code needed to verify an expected request
        backend.expectOne({
          url: '/foo/bar',
          method: 'GET'
        });
      })
    )
  );

  afterEach(inject([HttpTestingController], (backend: HttpTestingController) => {
    backend.verify();
  }));
});
