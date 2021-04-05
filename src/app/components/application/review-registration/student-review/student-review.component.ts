import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Student} from '../../../../_classes/student';
import {RouterLink} from '../../../../_classes/router-link';
import {ApplicationData} from '../../../../_classes/application-data';
import {StateCode} from '../../../../_classes/state-code';
import {CountryCode} from '../../../../_classes/country-code';
import {AppDataService} from '../../../../services/app-data.service';
import {Parent} from '../../../../_classes/parent';

@Component({
  selector: 'iee-student-review',
  templateUrl: './student-review.component.html',
  styleUrls: ['./student-review.component.less']
})
export class StudentReviewComponent implements OnInit, OnChanges {
  @Input() student: Student;
  @Input() link: RouterLink;
  @Input() locked: boolean;

  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];
  filteredStateCodes: Array<StateCode> = [];
  countryCode: CountryCode = new CountryCode();

  get formattedBirthdate(): string {
    if (this.student.birthdate) {
      const [year, month, day] = this.student.birthdate.split('-');
      return `${+day}/${+month}/${year}`;
    }

    return null;
  }

  constructor(private appDataService: AppDataService) {
    appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
      this.countryCode = this.getCountryCode(this.student);
    });
    appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
      this.countryCode = this.getCountryCode(this.student);
    });
  }

  ngOnInit(): void {
    this.filterStates();
    this.countryCode = this.getCountryCode(this.student);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterStates();
    this.countryCode = this.getCountryCode(this.student);
  }

  showZipError(): boolean {
    this.countryCode = this.getCountryCode(this.student);
    return (this.countryCode.zipRequired ? !this.student.mailingAddress.zipPostalCode : false);
  }

  showZip(): boolean {
    return this.countryCode.zipRequired;
  }

  showStateError(): boolean {
    this.filterStates();
    return (this.filteredStateCodes.length > 0 ? !this.student.mailingAddress.stateProvince : false);
  }

  showState(): boolean {
    return this.filteredStateCodes.length > 0;
  }

  private filterStates(): void {
    this.filteredStateCodes = this.getStates(this.getCountryCode(this.student));
  }

  private getCountryCode(student: Student): CountryCode {
    return this.countryCodes.find(c => c.name === student?.mailingAddress?.country) || new CountryCode();
  }

  private getStates(countryCode: CountryCode): Array<StateCode> {
    return this.stateCodes.filter(s => s.countryId === countryCode?.id);
  }
}
