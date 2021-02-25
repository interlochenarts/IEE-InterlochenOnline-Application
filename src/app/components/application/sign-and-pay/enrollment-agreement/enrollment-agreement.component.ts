import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {EnrollmentAgreement} from '../../../../_classes/enrollment-agreement';
import {AppDataService} from '../../../../services/app-data.service';
import {Program} from '../../../../_classes/program';
import {Payment} from '../../../../_classes/payment';
import {SalesforceOption} from '../../../../_classes/salesforce-option';

declare const Visualforce: any;

@Component({
  selector: 'iee-enrollment-agreement',
  templateUrl: './enrollment-agreement.component.html',
  styleUrls: ['./enrollment-agreement.component.css']
})
export class EnrollmentAgreementComponent implements OnInit, OnChanges {
  @Input() enrollmentAgreement: EnrollmentAgreement;
  @Input() payment: Payment;
  @Input() programs: Array<Program> = [];
  @Input() termName: string;
  @Input() applicantName: string;
  applicationId: string;
  isSigning = false;
  loggedInUserName: string;

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

    for (let i = 100; i >= 0; i--) {
      options.push(new SalesforceOption(
        (startYear - i).toString(),
        (startYear - i).toString(),
        false
      ));
    }
    return options;
  }

  updateDayOptions(): void {
    const options = new Array<SalesforceOption>();
    const daysInMonth = new Date(+this.enrollmentAgreement.birthdateYear, +this.enrollmentAgreement.birthdateMonth, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      options.push(new SalesforceOption(
        ('0' + i).slice(-2),
        ('0' + i).slice(-2),
        false
      ));
    }

    this.dayOptions = options;
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

    this.appDataService.isSigning.asObservable().subscribe(val => {
      this.isSigning = val;
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
    if (this.enrollmentAgreement.isComplete()) {
      this.appDataService.signEnrollmentAgreement();
    }
  }

  public canClickCheckbox(): boolean {
    return this.enrollmentAgreement.canCheckAcceptance();
  }

  onClickCheckbox(): void {
    if (this.canClickCheckbox()) {
      this.enrollmentAgreement.acceptanceChecked = this.enrollmentAgreement.acceptanceChecked !== true;
    }
  }
}
