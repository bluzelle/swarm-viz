import { BrowserModule } from '@angular/platform-browser';
import { NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GlobeComponent } from './globe/globe.component';
import { OverviewComponent } from './overview/overview.component';
import { FirstpageComponent } from './firstpage/firstpage.component';
import { SecondpageComponent } from './secondpage/secondpage.component';
import { SummarypageComponent } from './summarypage/summarypage.component';

@NgModule({
  declarations: [
    AppComponent,
    GlobeComponent,
    OverviewComponent,
    FirstpageComponent,
    SecondpageComponent,
    SummarypageComponent
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
