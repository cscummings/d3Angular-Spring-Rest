import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { D3Service } from 'd3-ng2-service';
import { HttpClientModule , HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BarchartComponent } from './shared/barchart/barchart.component';
import { PiechartComponent } from './shared/piechart/piechart.component';
import { LineGraphComponent } from './shared/line-graph/line-graph.component';
import { PathosBatchService } from './shared/pathos-batch.service';

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
  //  DataService,
    D3Service,
    PathosBatchService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
