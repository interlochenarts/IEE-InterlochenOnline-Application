import {Component, OnInit} from '@angular/core';
import {ApplicationData} from './_classes/application-data';
import {Parent} from './_classes/parent';
import {Student} from './_classes/student';
import {Address} from './_classes/address';

@Component({
  selector: 'iee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IEE-InterlochenOnline-Application';

  appData: ApplicationData;

  ngOnInit(): void {
    this.appData = new ApplicationData();
    this.appData.student = new Student();
    this.appData.student.mailingAddress = new Address();
    this.appData.parents = new Array<Parent>();
  }

  onOutletLoaded(component): void {
    component.appData = this.appData;
  }
}
