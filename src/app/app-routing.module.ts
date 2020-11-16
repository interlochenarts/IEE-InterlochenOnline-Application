import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ContactComponent} from './components/application/contact/contact.component';
import {ProgramInfoComponent} from './components/application/program-info/program-info.component';
import {ReviewAndSubmitComponent} from './components/application/review-and-submit/review-and-submit.component';

const routes: Routes = [
  {path: 'contact', component: ContactComponent},
  {path: 'program', component: ProgramInfoComponent},
  {path: 'review-and-submit', component: ReviewAndSubmitComponent}
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
