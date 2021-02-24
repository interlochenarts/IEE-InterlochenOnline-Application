import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApplicationData} from '../_classes/application-data';
import {CountryCode} from '../_classes/country-code';
import {StateCode} from '../_classes/state-code';
import {RouterLink} from '../_classes/router-link';
import {error} from '@angular/compiler/src/util';

declare const Visualforce: any;

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public applicationData = new BehaviorSubject<ApplicationData>(null);
  public applicationId = new BehaviorSubject<string>(null);
  public transactionId = new BehaviorSubject<string>(null);
  public userType = new BehaviorSubject<string>(null);
  public countryData = new BehaviorSubject<Array<CountryCode>>(new Array<CountryCode>());
  public stateData = new BehaviorSubject<Array<StateCode>>(new Array<StateCode>());
  public isSaving = new BehaviorSubject<boolean>(false);
  public isSigning = new BehaviorSubject<boolean>(false);
  public routerLinks = new BehaviorSubject<Array<RouterLink>>([]);

  constructor() { }

  public getApplicationData(applicationId: string): void {
    if (applicationId && !this.applicationData.getValue()) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.getApplicationData',
        applicationId,
        json => {
          if (json !== null) {
            const j = JSON.parse(json);
            // build app data
            const appData = ApplicationData.createFromNestedJson(j);
            this.applicationData.next(appData);
          }
        },
        {buffer: false, escape: false}
      );
    }
  }

  public getUserType(): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getUserType',
      (userType: string) => {
        this.userType.next(userType);
      },
      {buffer: false, escape: false}
    );
  }

  public getCountryData(): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_DataController.getCountryData',
      json => {
        if (json !== null) {
          const countryJson = JSON.parse(json);
          const countryCodes = countryJson.map(country => CountryCode.createFromJson(country));
          this.countryData.next(countryCodes);
        }
      },
      {buffer: false, escape: false}
    );
  }

  public getStateData(): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_DataController.getStateData',
      json => {
        if (json !== null) {
          const stateJson = JSON.parse(json);
          const stateCodes = stateJson.map(state => StateCode.createFromJson(state));
          this.stateData.next(stateCodes);
        }
      },
      {buffer: false, escape: false}
    );
  }

  public saveApplication(): void {
    const appData = this.applicationData.getValue();
    const appId = this.applicationId.getValue();

    // only save if we have an app and appId. Also wait until previous save is done.
    if (appData && appId && (this.isSaving.getValue() === false)) {
      this.isSaving.next(true);
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.saveApplication',
        JSON.stringify(appData),
        appId,
        result => {
          console.log(result);
          this.isSaving.next(false);
        },
        {buffer: false, escape: false}
      );
    }
  }

  public signEnrollmentAgreement(): void {
    console.log('signing agreement');
    const appData = this.applicationData.getValue();
    const appId = this.applicationId.getValue();

    // only save if we have an app and appId. Also wait until previous save is done.
    if (appData && appId && (this.isSigning.getValue() === false)) {
      this.isSigning.next(true);
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.submitSignature',
        appId,
        JSON.stringify(appData),
        result => {
          console.log(result);
          this.isSigning.next(false);
          // leave app after save
          window.location.assign('/interlochen/IEE_OnlineSubmitted?id=' + appData.appId);
        },
        {buffer: false, escape: false}
      );
    } else {
      console.error('Missing appData or appId, or signing already in progress');
    }
  }
}
