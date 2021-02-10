import { Component, OnInit } from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {Parent} from '../../../_classes/parent';
import {Program} from '../../../_classes/program';

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
  selectedPrograms: Array<Program> = [];
  applicantName: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
        this.selectedPrograms = this.appData.programData.programs.filter(p => p.isSelected);
        this.applicantName = this.appData.student.firstName + ' ' + this.appData.student.lastName;
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
          this.credentialStatus = 'Sorry. Something went wrong.';
        }
      },
      {buffer: false, escape: false}
    );
  }
}
