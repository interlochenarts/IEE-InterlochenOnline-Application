import {CountryCode} from "./country-code";
import {StateCode} from "./state-code";

export class Address {
  street: string;
  city: string;
  country: string;
  stateProvince: string;
  zipPostalCode: string;

  public static createFromJson(json: any): Address {
    const address = new Address();
    Object.assign(address, json);

    return address;
  }

  public hasAddress(): boolean {
    return !!this.street ||
      !!this.city ||
      !!this.country ||
      !!this.stateProvince ||
      !!this.zipPostalCode;
  }

  public isComplete(countryCode: CountryCode, states: StateCode[]): boolean {
    return !!this.street &&
    !!this.city &&
    !!this.country &&
    (states.length > 0 ? !!this.stateProvince : true) &&
    (countryCode ?
      (countryCode.zipRequired ? !!this.zipPostalCode : true) :
      false);
  }

  getIncomplete(countryCodes: CountryCode[], states: StateCode[]) {
    let failedValues = [];

    if (!this.street) {
      failedValues.push({label: 'Mailing Street', value: 'MailingStreet'});
    }

    if (!this.city) {
      failedValues.push({label: 'Mailing City', value: 'MailingCity'});
    }

    if (this.country) {
      if (states.length > 0 && !this.stateProvince) {
        failedValues.push({label: 'Mailing State', value: 'MailingState'});
      }

      let countryCode = countryCodes.find(c => c.name === this.country);
      if (countryCode && countryCode.zipRequired && !this.zipPostalCode) {
        failedValues.push({label: 'Mailing Postal Code', value: 'MailingPostalCode'});
      }
    } else {
      failedValues.push({label: 'Mailing Country', value: 'MailingCountry'});
    }

    return failedValues;
  }
}
