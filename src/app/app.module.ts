import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';

import {ProgramInfoComponent} from './components/application/program-tabs/program-info/program-info.component';
import {ReviewRegistrationComponent} from './components/application/review-registration/review-registration.component';
import {PersonalInfoComponent} from './components/application/personal-info/personal-info.component';
import {StudentComponent} from './components/application/personal-info/student/student.component';
import {ParentComponent} from './components/application/personal-info/parent/parent.component';
import {PaymentComponent} from './components/application/sign-and-pay/payment/payment.component';
import {FormsModule} from '@angular/forms';
import {ParentInfoComponent} from './components/application/personal-info/parent/parent-info/parent-info.component';
import {AchComponent} from './components/application/sign-and-pay/payment/ach/ach.component';
import {ApplicationComponent} from './components/application/application.component';
import {ProgramReviewComponent} from './components/application/review-registration/program-review/program-review.component';
import {ParentReviewComponent} from './components/application/review-registration/parent-review/parent-review.component';
import {StudentReviewComponent} from './components/application/review-registration/student-review/student-review.component';
import {BundleModalComponent} from './components/application/program-tabs/bundle-info/bundle-modal/bundle-modal.component';
import {ProgramTabsComponent} from './components/application/program-tabs/program-tabs.component';
import {BundleInfoComponent} from './components/application/program-tabs/bundle-info/bundle-info.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewRegistrationComponent,
    ProgramInfoComponent,
    HeaderComponent,
    PersonalInfoComponent,
    StudentComponent,
    ParentComponent,
    PaymentComponent,
    ParentInfoComponent,
    AchComponent,
    ApplicationComponent,
    ProgramReviewComponent,
    ParentReviewComponent,
    StudentReviewComponent,
    BundleModalComponent,
    ProgramTabsComponent,
    BundleInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

