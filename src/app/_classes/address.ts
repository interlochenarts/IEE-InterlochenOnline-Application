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
}
