import {Address} from './address';
import {ParentVerification} from './parent-verification';
import {LegacyData} from './legacy-data';
import {CountryCode} from './country-code';
import {StateCode} from './state-code';

export class Parent {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  preferredPhone: string;
  homePhone: string;
  mobilePhone: string;
  mailingAddress: Address;
  isEditing = false; // used to display/hide this parent's info form
  isSaving = false; // used to block future saves of this parent
  isDeleting = false; // used to prevent saves from re-adding deleting parents
  verification: string;
  verificationSent: boolean;
  optIn: boolean;

  public static createFromNestedJson(json: any): Parent {
    const parent = new Parent();
    Object.assign(parent, json);
    parent.mailingAddress = Address.createFromJson(json.mailingAddress);

    return parent;
  }

  public static createFromVerificationData(parentVerification: ParentVerification): Parent {
    const parent = new Parent();
    parent.firstName = parentVerification.firstName;
    parent.lastName = parentVerification.lastName;
    parent.email = parentVerification.email;
    parent.mailingAddress = new Address();

    return parent;
  }

  public static createFromLegacyData(legacyParent: Map<string, LegacyData>): Parent {
    const parent = new Parent();

    parent.firstName = legacyParent.get('firstNameParent')?.value;
    parent.lastName = legacyParent.get('lastNameParent')?.value;
    parent.email = legacyParent.get('emailParent')?.value;
    parent.mailingAddress = new Address();
    parent.mailingAddress.street = legacyParent.get('mailingStreetParent')?.value;
    parent.mailingAddress.city = legacyParent.get('mailingCityParent')?.value;
    parent.mailingAddress.country = legacyParent.get('mailingCountryParent')?.value;
    parent.mailingAddress.stateProvince = legacyParent.get('mailingStateParent')?.value;
    parent.mailingAddress.zipPostalCode = legacyParent.get('mailingZipParent')?.value;

    return parent;
  }

  public isComplete(countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    const countryCode = this.getCountryCode(countryCodes);
    const states = this.getStates(countryCode, stateCodes);

    let phoneComplete = true;
    if (!this.preferredPhone) {
      phoneComplete = false;
    } else {
      phoneComplete = (this.preferredPhone === 'Home' && !!this.homePhone) || (this.preferredPhone === 'Mobile' && !!this.mobilePhone);
    }
    phoneComplete = phoneComplete && (!this.optIn || this.optIn && !!this.mobilePhone);

    return !!this.email && phoneComplete && this.mailingAddress && this.mailingAddress.isComplete(countryCode, states);
  }

  public get isVerified(): boolean {
    return this.verification === 'Verified';
  }

  private getCountryCode(countryCodes: Array<CountryCode>): CountryCode {
    return countryCodes.find(c => c.name === this.mailingAddress?.country);
  }

  private getStates(countryCode: CountryCode, stateCodes: Array<StateCode>): Array<StateCode> {
    return stateCodes.filter(s => s.countryId === countryCode?.id);
  }
}
