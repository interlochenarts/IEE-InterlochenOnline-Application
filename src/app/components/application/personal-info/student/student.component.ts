import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Student} from '../../../../_classes/student';
import {Parent} from '../../../../_classes/parent';
import {Address} from '../../../../_classes/address';
import {AppDataService} from '../../../../services/app-data.service';
import {CountryCode} from '../../../../_classes/country-code';
import {StateCode} from '../../../../_classes/state-code';
import {ApplicationData} from '../../../../_classes/application-data';
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
  countryCodes: Array<CountryCode>;
  stateCodes: Array<StateCode>;
  filteredStates: Array<StateCode> = new Array<StateCode>();
  ethnicityOptions: Array<SalesforceOption> = new Array<SalesforceOption>();

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
  }

  ngOnInit(): void {
    this.appDataService.countryData.asObservable().subscribe(countryCodes => {
      this.countryCodes = countryCodes;
    });

    this.appDataService.stateData.asObservable().subscribe(stateCodes => {
      this.stateCodes = stateCodes;
      this.filterStates();
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

  ngOnChanges(): void {
    if (this.student && this.stateCodes) {
      this.filterStates();
    }
  }

  filterStates(): void {
    const countryCode = this.countryCodes.find(c => c.name === this.student?.mailingAddress?.country);
    this.filteredStates = this.stateCodes.filter(s => s.countryId === countryCode?.id);
  }

  zipRequired(): boolean {
    const countryCode = this.countryCodes?.find(c => c.name === this.student?.mailingAddress?.country);
    return countryCode?.zipRequired;
  }

  genderDetailRequired(): boolean {
    return this.student.genderIdentity === 'Non-Binary';
  }

  copyAddressFrom(parentAddress: Address): void {
    this.student.mailingAddress.street = parentAddress.street;
    this.student.mailingAddress.city = parentAddress.city;
    this.student.mailingAddress.country = parentAddress.country;
    this.filterStates();
    this.student.mailingAddress.stateProvince = parentAddress.stateProvince;
    this.student.mailingAddress.zipPostalCode = parentAddress.zipPostalCode;
  }

  showCopyAddressButton(parent: Parent): boolean {
    return !!(parent
      && parent.firstName
      && parent.lastName
      && parent.mailingAddress);
  }
}
