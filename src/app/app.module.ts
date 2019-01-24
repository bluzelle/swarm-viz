import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobeComponent } from './globe/globe.component';
import { OverviewComponent } from './overview/overview.component';
import { FirstpageComponent } from './overview/firstpage/firstpage.component';
import { SecondpageComponent } from './overview/secondpage/secondpage.component';
import { SummarypageComponent } from './overview/summarypage/summarypage.component';
import { PerformanceComponent } from './performance/performance.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobeComponent,
    OverviewComponent,
    FirstpageComponent,
    SecondpageComponent,
    SummarypageComponent,
    PerformanceComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {

  }
}
