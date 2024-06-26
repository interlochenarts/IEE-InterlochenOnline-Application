import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';

import {ProgramInfoComponent} from './components/application/program-type/program-info/program-info.component';
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
import {BundleModalComponent} from './components/application/program-type/certificate-info/bundle-modal/bundle-modal.component';
import {ProgramTypeComponent} from './components/application/program-type/program-type.component';
import {CertificateInfoComponent} from './components/application/program-type/certificate-info/certificate-info.component';
import { PrivateLessonInfoComponent } from './components/application/program-type/private-lesson-info/private-lesson-info.component';
import {AutocompleteLibModule} from "angular-ng-autocomplete";
import {NewLessonModalComponent} from './components/application/program-type/private-lesson-info/new-lesson-modal/new-lesson-modal.component';
import {AddLessonModalComponent} from './components/application/program-type/private-lesson-info/add-lesson-modal/add-lesson-modal.component';

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
    ProgramTypeComponent,
    CertificateInfoComponent,
    PrivateLessonInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    AutocompleteLibModule,
    NewLessonModalComponent,
    AddLessonModalComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

