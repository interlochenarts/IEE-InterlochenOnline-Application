import {Component, Input, OnInit} from '@angular/core';
import {AchPaymentData} from '../../../../../_classes/ach-payment-data';
import {ApplicationData} from '../../../../../_classes/application-data';
import {AppDataService} from '../../../../../services/app-data.service';

declare const Visualforce: any;

@Component({
  selector: 'iee-ach',
  templateUrl: './ach.component.html',
  styleUrls: ['./ach.component.css']
})
export class AchComponent implements OnInit {
  @Input() achPaymentData: AchPaymentData;
  appData: ApplicationData;
  linkFACTS: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.achPaymentData = this.achPaymentData || new AchPaymentData();

    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.appData = appData;
        // Get FACTS link
        console.log('getting FACTS link for app ' + this.appData.appId);
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.getLinkFACTS',
          this.appData.appId,
          result => {
            if (result && result !== 'null') {
              this.linkFACTS = result;
              console.log('got facts link! ' + this.linkFACTS);
            } else {
              console.log('error getting FACTS link for app id: ' + this.appData.appId);
              console.dir(result);
              this.linkFACTS = '#';
            }
          },
          {buffer: false, escape: false}
        );
      }
    });
  }
}
