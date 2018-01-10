import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BarchartComponent } from './shared/barchart/barchart.component';
import { PiechartComponent } from './shared/piechart/piechart.component';
import { LineGraphComponent } from './shared/line-graph/line-graph.component';
import { DataService } from './shared/data.service';
import { PathosBatchService } from './shared/pathos-batch.service';

// used to create fake backend
import { fakeBackendProvider } from './shared/fakeBackendProvider';
import { JwtInterceptor } from './shared/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    PiechartComponent,
    LineGraphComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgbModule.forRoot()
  ],
  providers: [
    DataService,
    PathosBatchService ,         {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true
  },

  // provider used to create fake backend
  fakeBackendProvider
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
