import {Component, OnInit} from '@angular/core';
import {ApplicationData} from './_classes/application-data';
import {AppDataService} from './services/app-data.service';
import {RouterLink} from './_classes/router-link';
import {CountryCode} from './_classes/country-code';
import {StateCode} from './_classes/state-code';

@Component({
  selector: 'iee-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'IEE-InterlochenOnline-Application';

  appData: ApplicationData = new ApplicationData();
  applicationId: string;
  transactionId: string;
  links: Array<RouterLink> = [];

  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.appData = appData;
      }
    });
    this.appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
    });
    this.appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
    });

    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;

        this.appDataService.routerLinks.next([
          new RouterLink('/' + this.applicationId + '/student-info', 'Student Information',
            () => false, !this.appData.registered),
          new RouterLink('/' + this.applicationId + '/program', 'Select a Program',
            () => false, true),
          new RouterLink('/' + this.applicationId + '/review-registration', 'Review Registration',
            () => false, true),
          new RouterLink('/' + this.applicationId + '/pay-registration', 'Pay Registration',
            this.linkDisabled, true),
          new RouterLink('/' + this.applicationId + '/sign', 'Complete Registration',
            this.linkDisabled, true)
        ]);

        this.links = this.appDataService.routerLinks.getValue();
      }
    });
    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId) {
        this.transactionId = trxId;

        this.appDataService.routerLinks.next([
          new RouterLink('/' + this.applicationId + '/' + this.transactionId + '/student-info', 'Student Information',
            () => false, !this.appData.registered),
          new RouterLink('/' + this.applicationId + '/' + this.transactionId + '/program', 'Select a Program',
            () => false, true),
          new RouterLink('/' + this.applicationId + '/' + this.transactionId + '/review-registration', 'Review Registration',
            () => false, true),
          new RouterLink('/' + this.applicationId + '/' + this.transactionId + '/pay-registration', 'Pay Registration',
            this.linkDisabled, true),
          new RouterLink('/' + this.applicationId + '/' + this.transactionId + '/sign', 'Complete Registration',
            this.linkDisabled, true)
        ]);

        this.links = this.appDataService.routerLinks.getValue();
      }
    });
  }

  saveApplication(disabled: boolean): void {
    if (!disabled) {
      this.appDataService.saveApplication();
    }
  }

  linkDisabled(appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    return !appData.isComplete(countryCodes, stateCodes);
  }
}
