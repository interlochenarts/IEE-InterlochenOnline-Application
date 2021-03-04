import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {CountryCode} from '../../../_classes/country-code';
import {StateCode} from '../../../_classes/state-code';

@Component({
  selector: 'iee-personal-info',
  templateUrl: './personal-info.component.html',
  styleUrls: ['./personal-info.component.css']
})
export class PersonalInfoComponent implements OnInit, OnDestroy {
  appData: ApplicationData = new ApplicationData();
  applicationId: string;
  autoSaveIntervalId: number;
  saveTime: Date;
  isParent: boolean;

  countryCodes: Array<CountryCode> = [];
  stateCodes: Array<StateCode> = [];

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;
      }
    });
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;
      }
    });
    this.appDataService.stateData.asObservable().subscribe(states => {
      this.stateCodes = states;
    });
    this.appDataService.countryData.asObservable().subscribe(countries => {
      this.countryCodes = countries;
    });
    this.appDataService.getUserType();
    this.appDataService.userType.asObservable().subscribe(type => {
      this.isParent = type === 'parent';
    });

    this.autoSaveIntervalId = setInterval(() => {
      this.appDataService.saveApplication();
      this.saveTime = new Date();
    }, 30000);
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSaveIntervalId);
  }
}
