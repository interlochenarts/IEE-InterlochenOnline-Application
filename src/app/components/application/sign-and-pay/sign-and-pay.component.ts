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
    this.appDataService.sendParentCredentials(parent, this.appData.student);
  }
}
