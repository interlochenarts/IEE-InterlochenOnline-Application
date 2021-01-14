import {Component, OnInit} from '@angular/core';
import {ApplicationData} from './_classes/application-data';
import {AppDataService} from './services/app-data.service';

@Component({
  selector: 'iee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IEE-InterlochenOnline-Application';

  appData: ApplicationData;
  applicationId: string;

  routerLinks = [];

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;

        this.routerLinks = [
          {routerLink: this.applicationId + '/personal-info', text: 'Personal Information'},
          {routerLink: this.applicationId + '/program', text: 'Select a Program'},
          {routerLink: this.applicationId + '/review-registration', text: 'Review Registration'},
          {routerLink: this.applicationId + '/enrollment', text: 'Pay and Enroll'}
        ];
      }
    });
  }
}
