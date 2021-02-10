import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';

import {ProgramInfoComponent} from './components/application/program-info/program-info.component';
import {ReviewRegistrationComponent} from './components/application/review-registration/review-registration.component';
import {SignAndPayComponent} from './components/application/sign-and-pay/sign-and-pay.component';
import {PersonalInfoComponent} from './components/application/personal-info/personal-info.component';
import {StudentComponent} from './components/application/personal-info/student/student.component';
import {ParentComponent} from './components/application/personal-info/parent/parent.component';
import {EnrollmentAgreementComponent} from './components/application/sign-and-pay/enrollment-agreement/enrollment-agreement.component';
import {PaymentComponent} from './components/application/sign-and-pay/payment/payment.component';
import {FormsModule} from '@angular/forms';
import {ParentInfoComponent} from './components/application/personal-info/parent/parent-info/parent-info.component';
import {CreditCardComponent} from './components/application/sign-and-pay/payment/credit-card/credit-card.component';
import {AchComponent} from './components/application/sign-and-pay/payment/ach/ach.component';
import {ApplicationComponent} from './components/application/application.component';
import {ProgramReviewComponent} from './components/application/review-registration/program-review/program-review.component';
import {ParentReviewComponent} from './components/application/review-registration/parent-review/parent-review.component';
import {StudentReviewComponent} from './components/application/review-registration/student-review/student-review.component';
import {EaTextComponent} from './components/application/sign-and-pay/enrollment-agreement/ea-text/ea-text.component';
import { EaHeaderComponent } from './components/application/sign-and-pay/enrollment-agreement/ea-header/ea-header.component';

@NgModule({
  declarations: [
    AppComponent,
    ReviewRegistrationComponent,
    ProgramInfoComponent,
    HeaderComponent,
    PersonalInfoComponent,
    SignAndPayComponent,
    StudentComponent,
    ParentComponent,
    EnrollmentAgreementComponent,
    PaymentComponent,
    ParentInfoComponent,
    CreditCardComponent,
    AchComponent,
    ApplicationComponent,
    ProgramReviewComponent,
    ParentReviewComponent,
    StudentReviewComponent,
    EaTextComponent,
    EaHeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

