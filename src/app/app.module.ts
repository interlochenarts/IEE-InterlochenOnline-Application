import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';

import {ProgramInfoComponent} from './components/application/program-info/program-info.component';
import {ReviewAndSubmitComponent} from './components/application/review-and-submit/review-and-submit.component';
import {SignAndPayComponent} from './components/application/sign-and-pay/sign-and-pay.component';
import {PersonalInfoComponent} from './components/application/personal-info/personal-info.component';
import { StudentComponent } from './components/application/personal-info/student/student.component';
import { ParentComponent } from './components/application/personal-info/parent/parent.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewAndSubmitComponent,
    ProgramInfoComponent,
    HeaderComponent,
    PersonalInfoComponent,
    SignAndPayComponent,
    StudentComponent,
    ParentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
