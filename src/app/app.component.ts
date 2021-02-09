import {Component, OnInit} from '@angular/core';
import {ApplicationData} from './_classes/application-data';
import {AppDataService} from './services/app-data.service';
import {RouterLink} from './_classes/router-link';

@Component({
  selector: 'iee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IEE-InterlochenOnline-Application';

  appData: ApplicationData;
  applicationId: string;
  transactionId: string;
  links = [];

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;

        this.appDataService.routerLinks.next([
          new RouterLink('/' + this.applicationId + '/personal-info', 'Personal Information'),
          new RouterLink('/' + this.applicationId + '/program', 'Select a Program'),
          new RouterLink('/' + this.applicationId + '/review-registration', 'Review Registration'),
          new RouterLink('/' + this.applicationId + '/enrollment', 'Pay and Enroll')
        ]);

        this.links = this.appDataService.routerLinks.getValue();
      }
    });
    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId) {
        this.transactionId = trxId;

        this.appDataService.routerLinks.next([
          {routerLink: this.applicationId + '/' + this.transactionId + '/personal-info', text: 'Personal Information'},
          {routerLink: this.applicationId + '/' + this.transactionId + '/program', text: 'Select a Program'},
          {routerLink: this.applicationId + '/' + this.transactionId + '/review-registration', text: 'Review Registration'},
          {routerLink: this.applicationId + '/' + this.transactionId + '/enrollment', text: 'Pay and Enroll'}
        ]);

        this.links = this.appDataService.routerLinks.getValue();
      }
    });
  }

  saveApplication(): void {
    this.appDataService.saveApplication();
  }
}
