import {ApplicationData} from './application-data';
import {CountryCode} from "./country-code";
import {StateCode} from "./state-code";

export class RouterLink {
  routerLink: string;
  text: string;
  disabled: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean;
  show: (appData: ApplicationData) => boolean;
  completed: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean;

  constructor(routerLink: string, text: string, disabled: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean,
              show: (appData: ApplicationData) => boolean, completed: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean) {
    this.disabled = disabled;
    this.routerLink = routerLink;
    this.text = text;
    this.show = show;
    this.completed = completed;
  }
}
