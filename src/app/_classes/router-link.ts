import {ApplicationData} from './application-data';
import {CountryCode} from "./country-code";
import {StateCode} from "./state-code";

export class RouterLink {
  link: string;
  text: string;
  disabled: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean;
  show: (appData: ApplicationData) => boolean;
  completed: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean;

  constructor(link: string, text: string, disabled: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean,
              show: (appData: ApplicationData) => boolean, completed: (appData: ApplicationData, countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>) => boolean) {
    this.disabled = disabled;
    this.link = link;
    this.text = text;
    this.show = show;
    this.completed = completed;
  }
}
