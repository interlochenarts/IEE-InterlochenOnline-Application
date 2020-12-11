import {Address} from './address';

export class Parent {
  contactId: string;
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;
  editing = false; // used to display/hide this parent's info form

  public static createFromNestedJson(json: any): Parent {
    const parent = new Parent();
    Object.assign(parent, json);

    return parent;
  }
}
