import {Component, Input, OnInit} from '@angular/core';
import {AchPaymentData} from '../../../../../_classes/ach-payment-data';
import {ApplicationData} from '../../../../../_classes/application-data';
import {AppDataService} from '../../../../../services/app-data.service';

@Component({
  selector: 'iee-ach',
  templateUrl: './ach.component.html',
  styleUrls: ['./ach.component.css']
})
export class AchComponent implements OnInit {
  @Input() achPaymentData: AchPaymentData;
  appData: ApplicationData = new ApplicationData();
  applicationId: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.achPaymentData = this.achPaymentData || new AchPaymentData();

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
  }

}
