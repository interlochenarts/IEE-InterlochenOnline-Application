import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {AchPaymentData} from '../../../../../_classes/ach-payment-data';
import {ApplicationData} from '../../../../../_classes/application-data';
import {AppDataService} from '../../../../../services/app-data.service';

declare const Visualforce: any;

@Component({
  selector: 'iee-ach',
  templateUrl: './ach.component.html',
  styleUrls: ['./ach.component.css']
})
export class AchComponent implements OnInit, OnChanges {
  @Input() achPaymentData: AchPaymentData;
  @Input() useCredit: boolean;
  appData: ApplicationData = new ApplicationData();
  linkFACTS: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.achPaymentData = this.achPaymentData || new AchPaymentData();

    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.appData = appData;
        this.getFACTSLink();
      }
    });
  }
  ngOnChanges(): void {
    this.linkFACTS = null;
    this.getFACTSLink();
  }
  getFACTSLink(): void {
    if (this.appData.payment != null && this.appData.payment.useCredit != null) {
      // Get FACTS link
      // console.log('getting FACTS link for app ' + this.appData.appId);

      // noinspection JSUnresolvedReference
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.getLinkFACTS',
        this.appData.appId, this.appData.payment.useCredit, this.appData.isRegistered,
        result => {
          if (result && result !== 'null') {
            this.linkFACTS = result;
            // console.log('got facts link! ' + this.linkFACTS);
          } else {
            console.error('error getting FACTS link for app id: ' + this.appData.appId);
            // console.dir(result);
            this.linkFACTS = null;
          }
        },
        {buffer: false, escape: false}
      );
    }
  }
}
