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
  birthdate: string;

  // Demographics
  race: string;
  raceOther: string;
  hispanic: string;

  public static createFromNestedJson(json: any): Student {
    const student = new Student();
    Object.assign(student, json);
    if (student.birthdate) {
      const dateSplit = student.birthdate.split('-');
      student.birthdateDay = dateSplit[2];
      student.birthdateMonth = dateSplit[1];
      student.birthdateYear = dateSplit[0];
    }

    return student;
  }

  public updateBirthdate(): void {
    if (this.birthdateYear && this.birthdateMonth && this.birthdateDay) {
      this.birthdate = `${this.birthdateYear}-${this.birthdateMonth}-${this.birthdateDay}`;
    } else {
      this.birthdate = null;
    }
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
