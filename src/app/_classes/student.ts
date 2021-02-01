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

  birthdateYear: string;
  birthdateMonth: string;
  birthdateDay: string;

  public get birthdate(): string {
    if (this.birthdateDay && this.birthdateMonth && this.birthdateYear) {
      return this.birthdateYear + '-' + this.birthdateMonth + '-' + this.birthdateDay;
    }

    return null;
  }

  public set birthdate(value: string) {
    if (value) {
      const d = new Date(value);
      this.birthdateDay = ('0' + d.getDate()).slice(-2);
      this.birthdateMonth = ('0' + d.getMonth()).slice(-2);
      this.birthdateYear = '' + d.getFullYear();
    }
  }

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
      !!this.birthdate &&
      !!this.billingParentId;
  }
}
