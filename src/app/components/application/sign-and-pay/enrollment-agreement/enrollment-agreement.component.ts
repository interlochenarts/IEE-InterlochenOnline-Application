import {Component, Input, OnInit} from '@angular/core';
import {ApplicationData} from '../../../../_classes/application-data';
import {EnrollmentAgreement} from '../../../../_classes/enrollment-agreement';

@Component({
  selector: 'iee-enrollment-agreement',
  templateUrl: './enrollment-agreement.component.html',
  styleUrls: ['./enrollment-agreement.component.css']
})
export class EnrollmentAgreementComponent implements OnInit {
  @Input() appData: ApplicationData;

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

  get yearOptions(): Array<object> {
    const options = new Array<object>();
    const startYear = new Date().getFullYear() - 4;

    for (let i = 100; i >= 0; i--) {
      options.push({
        label: (startYear - i).toString(),
        value: (startYear - i).toString()
      });
    }
    return options;
  }

  get dayOptions(): Array<object> {
    const options = new Array<object>();
    const daysInMonth = new Date(+this.appData.enrollmentAgreement.birthdateYear,
      +this.appData.enrollmentAgreement.birthdateMonth, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      options.push({
        label: ('0' + i).slice(-2),
        value: ('0' + i).slice(-2)
      });
    }
    return options;
  }

  constructor() { }

  ngOnInit(): void {
    this.appData.enrollmentAgreement = this.appData.enrollmentAgreement || new EnrollmentAgreement();
  }
}
