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

  constructor() { }

  public getData(applicationId: string): void {
    if (applicationId && !this.applicationData.getValue()) {
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.getApplicationData',
        applicationId,
        json => {
          if (json !== null) {
            const j = JSON.parse(json);
            // build academic tracks
            this.applicationData.next(ApplicationData.createFromNestedJson(j));
          }
        },
        {buffer: false, escape: false}
      );
    }
  }
}
