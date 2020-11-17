import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ProgramInfoComponent} from './components/application/program-info/program-info.component';
import {ReviewAndSubmitComponent} from './components/application/review-and-submit/review-and-submit.component';
import {PersonalInfoComponent} from './components/application/personal-info/personal-info.component';
import {SignAndPayComponent} from './components/application/sign-and-pay/sign-and-pay.component';

const routes: Routes = [
  {path: 'personal-info', component: PersonalInfoComponent},
  {path: 'program', component: ProgramInfoComponent},
  {path: 'review-and-submit', component: ReviewAndSubmitComponent},
  {path: 'enrollment-agreement', component: SignAndPayComponent}
];

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
