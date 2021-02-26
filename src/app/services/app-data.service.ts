import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApplicationData} from '../_classes/application-data';
import {CountryCode} from '../_classes/country-code';
import {StateCode} from '../_classes/state-code';
import {RouterLink} from '../_classes/router-link';
import {error} from '@angular/compiler/src/util';
import {Parent} from '../_classes/parent';
import {Student} from '../_classes/student';

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
  public credentialStatus = new BehaviorSubject<string>(null);

  constructor() { }

  public getApplicationData(applicationId: string): void {
    if (applicationId && !this.applicationData.getValue()) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.getApplicationData',
        applicationId,
        json => {
          if (json !== null) {
            // build app data
            this.applicationData.next(ApplicationData.createFromNestedJson(JSON.parse(json)));
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
          if (result !== null) {
            console.dir(JSON.parse(result));
            // fix missing parent contact IDs if we just created one with this save
            const resultApp = ApplicationData.createFromNestedJson((JSON.parse(result)));
            resultApp.parents.forEach((p: Parent, i) => {
              appData.parents[i].contactId = p.contactId;
            });
          }
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

  public sendParentCredentials(parent: Parent, student: Student): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_UserUtilityController.sendUserLoginByContactId',
      parent.contactId, student.contactId, 'Adult',
      (result: string) => {
        if (result.includes('@')) {
          this.credentialStatus.next('Credentials sent to ' + result);
        } else {
          console.error(result);
          this.credentialStatus.next('Sorry. Something went wrong.');
        }
      },
      {buffer: false, escape: false}
    );
  }
}
