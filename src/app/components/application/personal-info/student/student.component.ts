import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Student} from '../../../../_classes/student';
import {Parent} from '../../../../_classes/parent';
import {Address} from '../../../../_classes/address';
import {AppDataService} from '../../../../services/app-data.service';
import {CountryCode} from '../../../../_classes/country-code';
import {StateCode} from '../../../../_classes/state-code';
import {SalesforceOption} from '../../../../_classes/salesforce-option';

declare const Visualforce: any;

@Component({
  selector: 'iee-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit, OnChanges {
  @Input() student: Student;
  @Input() parents: Array<Parent>;
  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];
  filteredStates: Array<StateCode> = new Array<StateCode>();
  ethnicityOptions: Array<SalesforceOption> = new Array<SalesforceOption>();
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

  yesNoOptions = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'}
  ];

  genderIdentityOptions = [
    {label: 'Female', value: 'Female'},
    {label: 'Male', value: 'Male'},
    {label: 'Non-Binary', value: 'Non-Binary'}
  ];

  constructor(private appDataService: AppDataService) {
    this.yearOptions = this.getYearOptions();
  }

  ngOnInit(): void {
    this.appDataService.countryData.asObservable().subscribe(countryCodes => {
      this.countryCodes = countryCodes;
      this.filterStates(this.student?.mailingAddress?.country);
    });

    this.appDataService.stateData.asObservable().subscribe(stateCodes => {
      this.stateCodes = stateCodes;
      this.filterStates(this.student?.mailingAddress?.country);
    });

    this.loadEthnicityOptions();
  }

  loadEthnicityOptions(): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_DataController.getEthnicityOptions',
      json => {
        if (json !== null) {
          const j = JSON.parse(json);
          this.ethnicityOptions = j.map(o => SalesforceOption.createFromJson(o));
        }
      },
      {buffer: false, escape: false}
    );
  }

  updateDayOptions(): void {
    const options = new Array<SalesforceOption>();
    const daysInMonth = new Date(+this.student.birthdateYear, +this.student.birthdateMonth, 0).getDate();

    for (let i = 1; i <= daysInMonth; i++) {
      options.push(new SalesforceOption(
        ('0' + i).slice(-2),
        ('0' + i).slice(-2),
        false
      ));
    }

    this.dayOptions = options;
  }

  ngOnChanges(): void {
    if (this.student && this.stateCodes) {
      this.filterStates(this.student.mailingAddress?.country);
    }
  }

  getYearOptions(): Array<SalesforceOption> {
    const options = new Array<SalesforceOption>();
    const startYear = new Date().getFullYear() - 4; // might start doing kindergarten, so start with 4 yr olds

    for (let i = 16; i >= 0; i--) {
      options.push(new SalesforceOption(
        (startYear - i).toString(),
        (startYear - i).toString(),
        false
      ));
    }
    return options;
  }

  filterStates(event: string): void {
    const countryCode = this.countryCodes.find(c => c.name === event);
    this.filteredStates = this.stateCodes.filter(s => s.countryId === countryCode?.id);
  }

  zipRequired(): boolean {
    const countryCode = this.countryCodes?.find(c => c.name === this.student?.mailingAddress?.country);
    return countryCode?.zipRequired;
  }

  clearState(event: string): void {
    if (event !== this.student.mailingAddress.country) {
      this.student.mailingAddress.stateProvince = null;
    }
  }

  copyAddressFrom(parentAddress: Address): void {
    this.student.mailingAddress.street = parentAddress.street;
    this.student.mailingAddress.city = parentAddress.city;
    this.student.mailingAddress.country = parentAddress.country;
    this.filterStates(this.student.mailingAddress.country);
    this.student.mailingAddress.stateProvince = parentAddress.stateProvince;
    this.student.mailingAddress.zipPostalCode = parentAddress.zipPostalCode;
  }

  showCopyAddressButton(parent: Parent): boolean {
    return !!(parent
      && parent.firstName
      && parent.lastName
      && parent.mailingAddress
      && parent.mailingAddress.hasAddress());
  }
}
