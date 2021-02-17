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

  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];
  filteredStateCodes: Array<StateCode> = [];

  constructor(private appDataService: AppDataService) {
    appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
    });
    appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
    });
  }

  ngOnInit(): void {
    this.filterStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.filterStates();
  }


  showZipError(): boolean {
    const countryCode = this.getCountryCode(this.student);
    return (countryCode.zipRequired ? !this.student.mailingAddress.zipPostalCode : false);
  }

  showStateError(): boolean {
    this.filterStates();
    return (this.filteredStateCodes.length > 0 ? !this.student.mailingAddress.stateProvince : false);
  }

  private filterStates(): void {
    this.filteredStateCodes = this.getStates(this.getCountryCode(this.student));
  }

  private getCountryCode(student: Student): CountryCode {
    return this.countryCodes.find(c => c.name === student.mailingAddress?.country) || new CountryCode();
  }

  private getStates(countryCode: CountryCode): Array<StateCode> {
    return this.stateCodes.filter(s => s.countryId === countryCode?.id);
  }
}
