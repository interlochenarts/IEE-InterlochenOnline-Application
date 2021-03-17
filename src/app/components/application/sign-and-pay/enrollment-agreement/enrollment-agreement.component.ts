import {Component, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {AppDataService} from '../../../../services/app-data.service';
import {SalesforceOption} from '../../../../_classes/salesforce-option';
import {Parent} from '../../../../_classes/parent';
import {ApplicationData} from '../../../../_classes/application-data';
import {Program} from '../../../../_classes/program';

declare const Visualforce: any;

@Component({
  selector: 'iee-enrollment-agreement',
  templateUrl: './enrollment-agreement.component.html',
  styleUrls: ['./enrollment-agreement.component.css']
})
export class EnrollmentAgreementComponent implements OnInit, OnChanges {
  studentName: string;
  appData: ApplicationData = new ApplicationData();
  applicationId: string;
  isSigning = false;
  loggedInUserName: string;
  userType: string;
  credentialStatus: string;
  selectedPrograms: Array<Program> = [];

  yearOptions: Array<SalesforceOption> = new Array<SalesforceOption>();
  dayOptions: Array<SalesforceOption> = new Array<SalesforceOption>();
  monthOptions = [
    {label: 'January', value: '01'},
    {label: 'February', value: '02'},
    {label: 'March', value: '03'},
    {label: 'April', value: '04'},
    {label: 'May', value: '05'},
    {label: 'June', value: '06'},
    {label: 'July', value: '07'},
    {label: 'August', value: '08'},
    {label: 'September', value: '09'},
    {label: 'October', value: '10'},
    {label: 'November', value: '11'},
    {label: 'December', value: '12'}
  ];

  getYearOptions(): Array<SalesforceOption> {
    const options = new Array<SalesforceOption>();
    const startYear = new Date().getFullYear() - 14;

    for (let i = 0; i <= 100; i++) {
      options.push(new SalesforceOption(
        (startYear - i).toString(),
        (startYear - i).toString(),
        false
      ));
    }
    return options;
  }

  updateDayOptions(): void {
    if (this.appData) {
      const options = new Array<SalesforceOption>();
      const daysInMonth = new Date(+this.appData.enrollmentAgreement.birthdateYear,
        +this.appData.enrollmentAgreement.birthdateMonth, 0).getDate();

      for (let i = 1; i <= daysInMonth; i++) {
        options.push(new SalesforceOption(
          ('0' + i).slice(-2),
          ('0' + i).slice(-2),
          false
        ));
      }
      this.dayOptions = options;
    }
  }

  constructor(private appDataService: AppDataService) {
    this.yearOptions = this.getYearOptions();
  }

  ngOnInit(): void {
    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;
      }
    });

    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
        this.studentName = this.appData.student.firstName + ' ' + this.appData.student.lastName;
        this.selectedPrograms = this.appData.programData.programs.filter(p => p.isSelected);
        this.updateDayOptions();
      }
    });

    this.appDataService.isSigning.asObservable().subscribe(val => {
      this.isSigning = val;
    });

    this.appDataService.getUserType();
    this.appDataService.userType.asObservable().subscribe(type => {
      this.userType = type;
    });

    this.appDataService.credentialStatus.asObservable().subscribe(status => {
      this.credentialStatus = status;
    });

    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getUserName',
      (userName: string) => {
        this.loggedInUserName = userName;
      },
      {buffer: false, escape: false}
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  signEnrollmentAgreement(): void {
    if (this.appData.enrollmentAgreement.isComplete()) {
      this.appDataService.signEnrollmentAgreement();
    }
  }

  canClickCheckbox(): boolean {
    return this.appData.enrollmentAgreement.canCheckAcceptance();
  }

  onClickCheckbox(): void {
    if (this.canClickCheckbox()) {
      this.appData.enrollmentAgreement.acceptanceChecked = this.appData.enrollmentAgreement.acceptanceChecked !== true;
    }
  }

  sendParentCredentials(parent: Parent): void {
    this.appDataService.sendParentCredentials(parent, this.appData.student);
  }
}
