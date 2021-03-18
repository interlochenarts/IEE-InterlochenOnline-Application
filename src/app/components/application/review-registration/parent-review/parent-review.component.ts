import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Parent} from '../../../../_classes/parent';
import {RouterLink} from '../../../../_classes/router-link';
import {CountryCode} from '../../../../_classes/country-code';
import {StateCode} from '../../../../_classes/state-code';
import {AppDataService} from '../../../../services/app-data.service';
import {Student} from '../../../../_classes/student';

declare const Visualforce: any;

@Component({
  selector: 'iee-parent-review',
  templateUrl: './parent-review.component.html',
  styleUrls: ['./parent-review.component.less']
})
export class ParentReviewComponent implements OnInit, OnChanges {
  @Input() parents: Array<Parent>;
  @Input() student: Student;
  @Input() link: RouterLink;
  @Input() locked: boolean;

  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];
  filteredStateCodesByParent: Map<string, Array<StateCode>> = new Map<string, Array<StateCode>>();

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

  showZipError(parent: Parent): boolean {
    const countryCode = this.getCountryCode(parent);
    return (countryCode.zipRequired ? !parent.mailingAddress.zipPostalCode : false);
  }

  showStateError(parent: Parent): boolean {
    const states = this.filteredStateCodesByParent.get(parent.contactId);
    return (states.length > 0 ? !parent.mailingAddress.stateProvince : false);
  }

  getBillingParentString(): string {
    if (!this.student.billingParentId) {
      return null;
    } else {
      const billingParent: Parent = this.parents.find(p => p.contactId === this.student.billingParentId);
      return billingParent.isVerified ? `${billingParent.firstName} ${billingParent.lastName}` : null;
    }
  }

  reSendVerification(parent: Parent): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampApplication_ParentController.sendVerificationEmail',
      this.student.contactId, parent.contactId,
      result => {
        if (!result.includes('@')) {
          console.error('ERROR: Failed to send verification email');
        } else {
          parent.verificationSent = true;
          parent.email = parent.email == null ? result : parent.email;
        }
      },
      {buffer: false, escape: false}
    );
  }

  private filterStates(): void {
    for (const p of this.parents) {
      this.filteredStateCodesByParent.set(p.contactId, this.getStates(this.getCountryCode(p)));
    }
  }

  private getCountryCode(parent: Parent): CountryCode {
    return this.countryCodes.find(c => c.name === parent.mailingAddress?.country) || new CountryCode();
  }

  private getStates(countryCode: CountryCode): Array<StateCode> {
    return this.stateCodes.filter(s => s.countryId === countryCode?.id);
  }
}
