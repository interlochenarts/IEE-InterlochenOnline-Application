export class StateCode {
  name: string;
  id: string;
  isoCode: string;
  countryId: string;

  public static createFromJson(json: any): StateCode {
    const state = new StateCode();
    state.name = json.Name;
    state.id = json.Id;
    state.isoCode = json.ISO_Code__c;
    state.countryId = json.Country_Code__c;

    return state;
  }
}
