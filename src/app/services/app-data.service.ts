import { Injectable } from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApplicationData} from '../_classes/application-data';

declare const Visualforce: any;

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public applicationData = new BehaviorSubject<ApplicationData>(null);
  public applicationId = new BehaviorSubject<string>(null);
  public transactionId = new BehaviorSubject<string>(null);

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
