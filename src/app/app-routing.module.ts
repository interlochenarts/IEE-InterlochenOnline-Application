import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ReviewRegistrationComponent} from './components/application/review-registration/review-registration.component';
import {PersonalInfoComponent} from './components/application/personal-info/personal-info.component';
import {ApplicationComponent} from './components/application/application.component';
import {PaymentComponent} from './components/application/sign-and-pay/payment/payment.component';
import {ProgramTabsComponent} from "./components/application/program-tabs/program-tabs.component";

const routes: Routes = [
  {
    path: ':appId',
    component: ApplicationComponent,
    children: [
      {path: '', redirectTo: 'student-info', pathMatch: 'prefix'},
      {path: 'student-info', component: PersonalInfoComponent},
      {path: 'program', component: ProgramTabsComponent},
      {path: 'review-registration', component: ReviewRegistrationComponent},
      {path: 'pay-registration', component: PaymentComponent}
    ]
  },
  {
    path: ':appId/:txnId',
    component: ApplicationComponent,
    children: [
      {path: '', redirectTo: 'student-info', pathMatch: 'prefix'},
      {path: 'student-info', component: PersonalInfoComponent},
      {path: 'program', component: ProgramTabsComponent},
      {path: 'review-registration', component: ReviewRegistrationComponent},
      {path: 'pay-registration', component: PaymentComponent}
    ]
  }
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes, {useHash: true, paramsInheritanceStrategy: 'always', anchorScrolling: 'enabled'})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
