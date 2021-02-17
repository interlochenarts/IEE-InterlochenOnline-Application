import {ApplicationData} from './application-data';

export class RouterLink {
  routerLink: string;
  text: string;
  disabled: (appData: ApplicationData, countryCodes, stateCodes) => boolean;

  constructor(routerLink: string, text: string, disabled: (appData: ApplicationData, countryCodes, stateCodes) => boolean) {
    this.disabled = disabled;
    this.routerLink = routerLink;
    this.text = text;
  }
}
