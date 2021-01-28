import {Address} from './address';

export class Student {
  contactId: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;
  billingParentId: string;

  genderIdentity: string;
  genderIdentityDetails: string;

  birthdate: Date;

  // Demographics
  race: string;
  raceOther: string;
  hispanic: string;

  public static createFromNestedJson(json: any): Student {
    const student = new Student();
    Object.assign(student, json);

    return student;
  }

  public isComplete(): boolean {
    return !!this.preferredName &&
      !!this.email &&
      !!this.mobilePhone &&
      (!!this.mailingAddress &&
        !!this.mailingAddress.street &&
        !!this.mailingAddress.city &&
        !!this.mailingAddress.country &&
        !!this.mailingAddress.stateProvince &&
        !!this.mailingAddress.zipPostalCode
      ) &&
      !!this.genderIdentity &&
      (this.genderIdentity !== 'Other' ||
        (this.genderIdentity === 'Other' && !!this.genderIdentityDetails)) &&
      !!this.birthdate;
  }
}
