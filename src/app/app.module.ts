import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BarchartComponent } from './shared/barchart/barchart.component';
import { PiechartComponent } from './shared/piechart/piechart.component';
import { LineGraphComponent } from './shared/line-graph/line-graph.component';
import { DataService } from './shared/data.service';

@NgModule({
  declarations: [
    AppComponent,
    BarchartComponent,
    PiechartComponent,
    LineGraphComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
