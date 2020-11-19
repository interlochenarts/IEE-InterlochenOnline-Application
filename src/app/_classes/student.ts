import {Address} from './address';

export class Student {
  firstName: string;
  lastName: string;
  nickName: string;
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
}
