import { Component, OnInit } from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {RouterLink} from '../../../_classes/router-link';
import {CountryCode} from '../../../_classes/country-code';
import {StateCode} from '../../../_classes/state-code';

@Component({
  selector: 'iee-review-and-submit',
  templateUrl: './review-registration.component.html',
  styleUrls: ['./review-registration.component.css']
})
export class ReviewRegistrationComponent implements OnInit {

  appData: ApplicationData = new ApplicationData();
  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];
  routerLinks = new Array<RouterLink>();

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
      }
    });

    this.appDataService.routerLinks.asObservable().subscribe(rl => {
      if (rl) {
        this.routerLinks = rl;
      }
    });

    this.appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
    });
    this.appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
    });
  }
}
