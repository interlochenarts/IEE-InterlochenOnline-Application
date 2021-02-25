import {Component, Input, OnInit} from '@angular/core';
import {CreditCardPaymentData} from '../../../../../_classes/credit-card-payment-data';
import {AppDataService} from '../../../../../services/app-data.service';
import {ApplicationData} from '../../../../../_classes/application-data';

declare const Visualforce: any;

@Component({
  selector: 'iee-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit {
  @Input() cc: CreditCardPaymentData;
  transactionMessage: string;
  appData: ApplicationData = new ApplicationData();
  isSubmitting: boolean;

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.cc = this.cc || new CreditCardPaymentData();
    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.appData = appData;
      }
    });
  }

  submitCC(): void {
    if (this.cc.isMissingInputs()) {
      this.transactionMessage = 'Required fields missing.';
    } else {
      if (this.appData.appId) {
        this.isSubmitting = true;
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.submitCC',
          this.appData.appId, JSON.stringify(this.cc), this.appData.payment.useCredit,
          result => {
            if (result !== null) {
              console.log(result);
              this.transactionMessage = result;
              if (this.transactionMessage === 'This transaction has been approved.') {
                this.appData.payment.tuitionPaid = true;
              }
            } else {
              this.transactionMessage = 'An Error has occurred.  Your payment may have been processed, do not try again.  Please contact support@interlochen.org before proceeding';
            }
            this.isSubmitting = false;
          },
          {buffer: false, escape: false}
        );
      } else {
        this.transactionMessage = 'An Error has occurred.  Your payment may have been processed, do not try again.  Please contact support@interlochen.org before proceeding';
      }
    }
  }

  disableSubmit(): boolean {
    return this.isSubmitting || this.appData.payment.tuitionPaid || this.appData.payment.paidOnLoad;
  }
  get ccAmount(): number {
    // Assigned for convenience and because linting was yelling at me
    const amountOwed = this.appData.payment.amountOwed;
    const spendableCredit = this.appData.payment.spendableCredit;
    const newAmount = this.appData.payment.useCredit ? amountOwed - spendableCredit : amountOwed;
    return newAmount + (newAmount * (this.appData.payment.ccPercent / 100));
  }

}
