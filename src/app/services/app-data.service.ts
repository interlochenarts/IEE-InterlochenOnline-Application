import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApplicationData} from '../_classes/application-data';
import {CountryCode} from '../_classes/country-code';
import {StateCode} from '../_classes/state-code';

declare const Visualforce: any;

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public applicationData = new BehaviorSubject<ApplicationData>(null);
  public applicationId = new BehaviorSubject<string>(null);
  public countryData = new BehaviorSubject<Array<CountryCode>>(new Array<CountryCode>());
  public stateData = new BehaviorSubject<Array<StateCode>>(new Array<StateCode>());

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
    console.dir(appData);

    if (appData && appId) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.saveApplication',
        JSON.stringify(appData),
        appId,
        result => {
          console.log(result);
        },
        {buffer: false, escape: false}
      );
    }
  }
}
