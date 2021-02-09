import {Component, Input, OnInit} from '@angular/core';
import {CreditCardPaymentData} from '../../../../../_classes/credit-card-payment-data';
import {AppDataService} from '../../../../../services/app-data.service';

declare const Visualforce: any;

@Component({
  selector: 'iee-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit {
  @Input() cc: CreditCardPaymentData;
  transactionMessage: string;
  applicationId: string;

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.cc = this.cc || new CreditCardPaymentData();

    this.appDataService.applicationId.asObservable().subscribe(appId => {
      if (appId) {
        this.applicationId = appId;
      }
    });
  }

  submitCC(): void {
    if (this.cc.isMissingInputs()) {
      this.transactionMessage = 'Required fields missing.';
    } else {
      if (this.applicationId) {
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.submitCC',
          this.applicationId, JSON.stringify(this.cc),
          result => {
            if (result !== null) {
              console.log(result);
              this.transactionMessage = result;
            } else {
              this.transactionMessage = 'An Error has occurred.  Your payment may have been processed, do not try again.  Please contact support@interlochen.org before proceeding';
            }
          },
          {buffer: false, escape: false}
        );
      } else {
        this.transactionMessage = 'An Error has occurred.  Your payment may have been processed, do not try again.  Please contact support@interlochen.org before proceeding';
      }
    }
  }

}
