export class CountryCode {
  name: string;
  id: string;
  zipRequired: boolean;

  // because the parameter is an `any` type, we can get away with not having complete knowledge of the object, but
  // I would love to do better.
  public static createFromJson(json: any): CountryCode {
    const country = new CountryCode();
    country.id = json.Id;
    country.name = json.VanaHCM__Country_Description__c;
    country.zipRequired = json.Zip_Postal_Code_required__c;

    return country;
  }
}
