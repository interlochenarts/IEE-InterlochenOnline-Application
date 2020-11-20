import {Address} from './address';

export class Parent {
  firstName: string;
  lastName: string;
  email: string;
  mobilePhone: string;
  mailingAddress: Address;
  editing = false; // used to display/hide this parent's info form
}
