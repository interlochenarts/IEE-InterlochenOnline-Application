import {Component, OnInit} from '@angular/core';
import {AppDataService} from '../../../../services/app-data.service';
import {ApplicationData} from '../../../../_classes/application-data';
import {Payment} from '../../../../_classes/payment';
import {Parent} from '../../../../_classes/parent';

declare const Visualforce: any;

@Component({
  selector: 'iee-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  paymentReceived = false;
  transactionId: string;
  appData: ApplicationData = new ApplicationData();
  isLoading: boolean;

  userType = 'student';
  credentialStatus: string;

  get feeCoveredByCredit(): boolean {
    return this.appData.payment.useCredit && this.appData.payment.credits >= this.appData.payment.amountOwed;
  }

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(appData => {
      if (appData) {
        this.appData = appData;
        this.paymentReceived = appData.payment.paidOnLoad ? appData.payment.paidOnLoad : this.paymentReceived;
        this.isLoading = true;
        // Load payment info in case they picked programs since the data was last loaded
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.getPaymentJSON',
          this.appData.appId,
          result => {
            if (result && result !== 'null') {
              this.appData.payment = Payment.createFromNestedJson(JSON.parse(result));
            }
            this.isLoading = false;
          },
          {buffer: false, escape: false}
        );
      }
    });
    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId && this.transactionId !== trxId && this.appData) {
        this.transactionId = trxId;
        // console.log('Checking transactionId ' + trxId + ' for app ' + this.appData.appId);
        // search salesforce for the transaction to see if it's real
        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.checkTransaction',
          this.appData.appId,
          this.transactionId,
          result => {
            if (result && result !== 'null') {
              this.paymentReceived = true;
            } else {
              console.error('no transaction found with id: ' + this.transactionId);
              this.paymentReceived = false;
            }
          },
          {buffer: false, escape: false}
        );
      }
    });

    this.appDataService.getUserType();
    this.appDataService.userType.asObservable().subscribe(type => {
      this.userType = type;
    });
    this.appDataService.credentialStatus.asObservable().subscribe(status => {
      this.credentialStatus = status;
    });
  }

  canPay(): boolean {
    return !this.paymentReceived && this.appData.payment.amountOwed !== 0.00 && !this.feeCoveredByCredit;
  }

  confirmCredit(): void {
    // Do VF here to call confirmCredit function, set .credit to response.. add to applied? figure out new owed?
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.confirmCredit',
      this.appData.appId, this.appData.payment.useCredit,
      result => {
        if (result && result !== 'null') {
          this.appData.payment.amountOwed -= result;
          this.appData.payment.credits -= result;
          this.appData.payment.appliedCredits += result;
          // Only set tuition paid if this actually covered the fee completely
          if (this.appData.payment.amountOwed <= 0) {
            this.appData.payment.tuitionPaid = true;
            this.paymentReceived = true;
          }
        } else {
          console.error('error applying Credits for app id: ' + this.appData.appId);
          console.dir(result);
        }
      },
      {buffer: false, escape: false}
    );
  }

  sendParentCredentials(parent: Parent): void {
    this.appDataService.sendParentCredentials(parent, this.appData.student);
  }
}
