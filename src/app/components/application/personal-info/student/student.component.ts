import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Student} from '../../../../_classes/student';
import {Parent} from '../../../../_classes/parent';
import {Address} from '../../../../_classes/address';
import {AppDataService} from '../../../../services/app-data.service';
import {CountryCode} from '../../../../_classes/country-code';
import {StateCode} from '../../../../_classes/state-code';

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
    });
  }

  ngOnChanges(): void {
    if (this.student && this.stateCodes) {
      this.filterStates();
    }
  }


  filterStates(): void {
    console.log('filtering states on: ' + this.student.mailingAddress.country);
    const countryCode = this.countryCodes.find(c => c.name === this.student.mailingAddress.country);
    this.filteredStates = this.stateCodes.filter(s => s.countryId === countryCode.id);
  }

  genderDetailRequired(): boolean {
    return this.student.genderIdentity === 'Non-Binary';
  }

  copyAddressFrom(parentAddress: Address): void {
    this.student.mailingAddress.street = parentAddress.street;
    this.student.mailingAddress.city = parentAddress.city;
    this.student.mailingAddress.country = parentAddress.country;
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
