import {Address} from './address';
import {CountryCode} from './country-code';
import {StateCode} from './state-code';

export class Student {
  contactId: string;
  firstName: string;
  lastName: string;
  preferredName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;
  optIn: boolean;

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
  isAdult: boolean;

  public static createFromNestedJson(json: any): Student {
    const student = new Student();
    Object.assign(student, json);
    if (student.birthdate) {
      const dateSplit = student.birthdate.split('-');
      student.birthdateDay = dateSplit[2];
      student.birthdateMonth = dateSplit[1];
      student.birthdateYear = dateSplit[0];
    }
    student.mailingAddress = Address.createFromJson(json?.mailingAddress);

    return student;
  }

  public updateBirthdate(): void {
    if (this.birthdateYear && this.birthdateMonth && this.birthdateDay) {
      this.birthdate = `${this.birthdateYear}-${this.birthdateMonth}-${this.birthdateDay}`;
    } else {
      this.birthdate = null;
    }
  }

  public isComplete(countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    const countryCode = this.getCountryCode(countryCodes);
    const states = this.getStates(countryCode, stateCodes);

    return !!this.preferredName &&
      !!this.email &&
      !!this.mobilePhone &&
      (!!this.mailingAddress && this.mailingAddress.isComplete(countryCode, states)) &&
      !!this.genderIdentity &&
      (!!this.birthdate || this.isAdult);
  }

  private getCountryCode(countryCodes: Array<CountryCode>): CountryCode {
    return countryCodes.find(c => c.name === this.mailingAddress?.country);
  }

  private getStates(countryCode: CountryCode, stateCodes: Array<StateCode>): Array<StateCode> {
    return stateCodes.filter(s => s.countryId === countryCode?.id);
  }
}
