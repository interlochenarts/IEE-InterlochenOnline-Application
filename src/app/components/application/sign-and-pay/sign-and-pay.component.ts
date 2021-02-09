import { Component, OnInit } from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {Parent} from '../../../_classes/parent';

declare const Visualforce: any;

@Component({
  selector: 'iee-sign-and-pay',
  templateUrl: './sign-and-pay.component.html',
  styleUrls: ['./sign-and-pay.component.css']
})
export class SignAndPayComponent implements OnInit {
  appData: ApplicationData = new ApplicationData();
  userType = 'student';
  credentialStatus: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
      }
    });

    this.appDataService.getUserType();

    this.appDataService.userType.asObservable().subscribe(type => {
      this.userType = type;
    });
  }

  sendParentCredentials(parent: Parent): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_UserUtilityController.sendUserLoginByContactId',
      parent.contactId, this.appData.student.contactId, 'Adult',
      (result: string) => {
        if (result.includes('@')) {
          this.credentialStatus = 'Credentials sent to ' + result;
        } else {
          console.error(result);
        }
      },
      {buffer: false, escape: false}
    );
  }
}
