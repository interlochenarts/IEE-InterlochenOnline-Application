import {Address} from './address';
import {ParentVerification} from './parent-verification';

export class Parent {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;
  editing = false; // used to display/hide this parent's info form
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
