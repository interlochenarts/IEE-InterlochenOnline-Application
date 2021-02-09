import {Component, OnInit} from '@angular/core';
import {PaymentType} from '../../../../_enums/payment-type.enum';
import {AppDataService} from '../../../../services/app-data.service';

declare const Visualforce: any;

@Component({
  selector: 'iee-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  PaymentType = PaymentType;
  paymentType: PaymentType = PaymentType.CC;
  paymentReceived = false;
  transactionId: string;
  applicationId: string;

  constructor(private appDataService: AppDataService) { }

  ngOnInit(): void {
    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;
      }
    });
    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId && this.transactionId !== trxId) {
        this.transactionId = trxId;
        console.log('Checking transactionId ' + trxId + ' for app ' + this.applicationId);
        // search salesforce for the transaction to see if it's real
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.checkTransaction',
          this.applicationId,
          this.transactionId,
          result => {
            if (result && result !== 'null') {
              this.paymentReceived = true;
            } else {
              console.log('no transaction found with id: ' + this.transactionId);
              this.paymentReceived = false;
            }
          },
          {buffer: false, escape: false}
        );
      }
    });
  }
}
