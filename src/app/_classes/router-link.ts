import {ApplicationData} from './application-data';

export class RouterLink {
  routerLink: string;
  text: string;
  disabled: (appData: ApplicationData, countryCodes, stateCodes) => boolean;
  show: boolean;

  constructor(routerLink: string, text: string, disabled: (appData: ApplicationData, countryCodes, stateCodes) => boolean, show: boolean) {
    this.disabled = disabled;
    this.routerLink = routerLink;
    this.text = text;
    this.show = show;
  }
}
