import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';

import { ContactComponent } from './components/application/contact/contact.component';
import { ProgramInfoComponent } from './components/application/program-info/program-info.component';
import { ReviewAndSubmitComponent } from './components/application/review-and-submit/review-and-submit.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewAndSubmitComponent,
    ProgramInfoComponent,
    HeaderComponent,
    ContactComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
