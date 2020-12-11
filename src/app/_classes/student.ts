import {Address} from './address';

export class Student {
  contactId: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;

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
}
