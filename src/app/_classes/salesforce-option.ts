export class SalesforceOption {
  active: boolean;
  defaultValue: boolean;
  label: string;
  validFor: string;
  value: string;


  public static createFromJson(json: any): SalesforceOption {
    const salesforceOption = new SalesforceOption();
    Object.assign(salesforceOption, json);

    return salesforceOption;
  }
}
