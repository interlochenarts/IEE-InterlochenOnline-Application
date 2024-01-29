import {Component, Input, OnChanges, OnInit, ViewChild} from '@angular/core';
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
  keyword = 'name'
  showError:boolean = false;
  parentState:string = '';

  @ViewChild('countryAutocompleteComponent') countryAutocomplete: any;
  @ViewChild('stateAutocompleteComponent') stateAutocomplete: any;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.countryData.asObservable().subscribe(countryCodes => {
      this.countryCodes = countryCodes;
      this.filterStates(this.parent?.mailingAddress?.country);
    });

    this.appDataService.stateData.asObservable().subscribe(stateCodes => {
      this.stateCodes = stateCodes;
      this.filterStates(this.parent?.mailingAddress?.country);
      this.parentState = this.getState(this.parent?.mailingAddress?.stateProvince)
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
    if (countryCode && countryCode.id) {
      this.showError = false;
    }
  }

  zipRequired(): boolean {
    const countryCode = this.countryCodes?.find(c => c.name === this.parent?.mailingAddress?.country);
    return countryCode?.zipRequired;
  }

  clearState(event: string): void {
    if (event !== this.parent.mailingAddress.country) {
      this.clearStateVal();
    }
  }

  clearStateVal(): void {
    this.parent.mailingAddress.stateProvince = null;
    this.parentState = '';
  }

  copyAddressFromStudent(): void {
    this.parent.mailingAddress.street = this.student.mailingAddress.street;
    this.parent.mailingAddress.city = this.student.mailingAddress.city;
    this.parent.mailingAddress.country = this.student.mailingAddress.country;
    this.filterStates(this.parent.mailingAddress.country);
    this.parent.mailingAddress.stateProvince = this.student.mailingAddress.stateProvince;
    this.parent.mailingAddress.zipPostalCode = this.student.mailingAddress.zipPostalCode;
    this.parentState = this.getState(this.parent.mailingAddress.stateProvince)
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

  focusout(): void {
    const countryCode = this.countryCodes.find(c => c.name === this.countryAutocomplete.query);
    if (!countryCode) {
      this.showError = true;
      this.clearState(this.countryAutocomplete.query);
      this.filteredStates = new Array<StateCode>();
      this.parent.mailingAddress.country = null;
      this.stateAutocomplete.query = null;
    } else {
      this.showError = false;
      this.parent.mailingAddress.country = countryCode.name;
    }
  }

  stateSelected(event: StateCode): void {
    this.parent.mailingAddress.stateProvince = event.isoCode;
    this.parentState = this.getState(this.parent.mailingAddress.stateProvince);
  }

  getState(isoCode:string): string {
    if (isoCode) {
      let thisState = this.filteredStates.find(x => x.isoCode === isoCode);
      return thisState.name;
    } else {
      return '';
    }
  }
}
