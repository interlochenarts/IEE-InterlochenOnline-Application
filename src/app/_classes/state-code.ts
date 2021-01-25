export class StateCode {
  name: string;
  id: string;
  isoCode: string;
  countryId: string;

  public static createFromJson(json: any): StateCode {
    const state = new StateCode();
    state.name = json.Name;
    state.id = json.Id;
    state.isoCode = json.VanaHCM__ISO_Code__c;
    state.countryId = json.VanaHCM__Country_Codes_State__c;

    return state;
  }
}
