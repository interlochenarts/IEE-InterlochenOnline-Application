export class SalesforceOption {
  active: boolean;
  defaultValue: boolean;
  label: string;
  validFor: string;
  value: string;
  disabled: boolean;

  constructor(label: string, value: string, defaultValue: boolean) {
    this.label = label;
    this.value = value;
    this.defaultValue = defaultValue;
    this.disabled = false;
  }

  public static createFromJson(json: any): SalesforceOption {
    const salesforceOption = new SalesforceOption('', '', false);
    Object.assign(salesforceOption, json);

    return salesforceOption;
  }


}
