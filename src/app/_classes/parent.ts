import {Address} from './address';
import {ParentVerification} from './parent-verification';
import {LegacyData} from './legacy-data';

export class Parent {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;
  isEditing = false; // used to display/hide this parent's info form
  isSaving = false; // used to block future saves of this parent
  verification: string;

  public static createFromNestedJson(json: any): Parent {
    const parent = new Parent();
    parent.mailingAddress = new Address();
    Object.assign(parent, json);

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

  public isComplete(): boolean {
    return !!this.email &&
      (!!this.mailingAddress &&
        !!this.mailingAddress.street &&
        !!this.mailingAddress.city &&
        !!this.mailingAddress.country &&
        !!this.mailingAddress.stateProvince &&
        !!this.mailingAddress.zipPostalCode
      );
  }

  public get isVerified(): boolean {
    return this.verification === 'Verified';
  }
}
