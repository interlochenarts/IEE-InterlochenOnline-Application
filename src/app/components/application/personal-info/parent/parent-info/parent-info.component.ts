import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Parent} from '../../../../../_classes/parent';
import {Student} from '../../../../../_classes/student';
import {CountryCode} from '../../../../../_classes/country-code';
import {StateCode} from '../../../../../_classes/state-code';
import {AppDataService} from '../../../../../services/app-data.service';

declare const Visualforce: any;

@Component({
  selector: 'iee-parent-info',
  templateUrl: './parent-info.component.html',
  styleUrls: ['./parent-info.component.css']
})
export class ParentInfoComponent implements OnInit, OnChanges {
  @Input() parent: Parent;
  @Input() student: Student;
  @Input() isSaving: boolean;
  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];
  filteredStates: Array<StateCode> = new Array<StateCode>();

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.countryData.asObservable().subscribe(countryCodes => {
      this.countryCodes = countryCodes;
      this.filterStates(this.parent?.mailingAddress?.country);
    });

    this.appDataService.stateData.asObservable().subscribe(stateCodes => {
      this.stateCodes = stateCodes;
      this.filterStates(this.parent?.mailingAddress?.country);
    });
  }

  ngOnChanges(event): void {
    if (this.parent && this.stateCodes) {
      this.filterStates(this.parent.mailingAddress?.country);
    }
  }

  filterStates(event: string): void {
    const countryCode = this.countryCodes.find(c => c.name === event);
    this.filteredStates = this.stateCodes.filter(s => s.countryId === countryCode?.id);
  }

  zipRequired(): boolean {
    const countryCode = this.countryCodes?.find(c => c.name === this.parent?.mailingAddress?.country);
    return countryCode?.zipRequired;
  }

  clearState(event: string): void {
    if (event !== this.parent.mailingAddress.country) {
      this.parent.mailingAddress.stateProvince = null;
    }
  }

  copyAddressFromStudent(): void {
    this.parent.mailingAddress.street = this.student.mailingAddress.street;
    this.parent.mailingAddress.city = this.student.mailingAddress.city;
    this.parent.mailingAddress.country = this.student.mailingAddress.country;
    this.filterStates(this.parent.mailingAddress.country);
    this.parent.mailingAddress.stateProvince = this.student.mailingAddress.stateProvince;
    this.parent.mailingAddress.zipPostalCode = this.student.mailingAddress.zipPostalCode;

  }

  save(): void {
    this.parent.isEditing = false;
    this.parent.isSaving = true;

    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.saveParent',
      JSON.stringify(this.parent), this.student.contactId,
      result => {
        this.parent.isSaving = false;
        if (result.startsWith('ERR')) {
          console.error('ERROR: Could not save parent');
        } else {
          this.parent.contactId = result;
        }
      },
      {buffer: false, escape: false}
    );
  }
}
