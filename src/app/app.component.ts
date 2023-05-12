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

        this.buildLinks();
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

        this.buildLinks();
      }
    });
    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId) {
        this.transactionId = trxId;

        this.buildLinks();
      }
    });
  }

  saveApplication(disabled: boolean): void {
    if (!disabled) {
      this.appDataService.saveApplication();
    }
  }

  linkDisabled(appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    return !appData.isComplete(countryCodes, stateCodes) ||
      (appData.isRegistered && appData.acProgramData.programs.filter(program => ((program.isSelected && !program.isRegistered) || (program.lessonCountAdd && program.lessonCountAdd  > 0) )).length === 0);
  }
  linkShow(appData: ApplicationData): boolean {
    return !appData.isRegistered;
  }

  buildLinks(): void {
    const appId = this.applicationId || this.appData.appId;
    const txnId = this.transactionId ? '/' + this.applicationId : '';

    this.appDataService.routerLinks.next([
      new RouterLink('/' + appId + txnId + '/student-info', this.appData.isAdultApplicant ? 'Your Information' : 'Student Information',
        () => false, this.linkShow),
      new RouterLink('/' + appId + txnId + '/program', 'Select a Program',
        () => false, () => true),
      new RouterLink('/' + appId + txnId + '/review-registration', 'Review Registration',
        () => false, () => true),
      new RouterLink('/' + appId + txnId + '/pay-registration', 'Pay Registration',
        this.linkDisabled, () => true),
    ]);

    this.links = this.appDataService.routerLinks.getValue();
  }
}
