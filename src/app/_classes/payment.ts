import {PaymentBundle} from './payment-bundle';
import {PaymentAppChoice} from './payment-appchoice';

export class Payment {
  tuitionPaid: boolean;
  paidOnLoad: boolean;
  amountOwed: number;
  amountPaid: number;
  pendingCredit: number;
  cancelAmount: number;
  payments: Array<string>;
  pendingDiscounts: Array<string>;
  pendingBundles: Array<PaymentBundle>;
  pendingAppChoices: Array<PaymentAppChoice>;
  pendingPLs: Array<PaymentAppChoice>;
  credits: number;
  ccFee: number;
  ccPercent: number;
  appliedCredits: number;
  spendableCredit: number;
  useCredit: boolean;
  waiverCode: string;
  earlyBirdDiscountInfo: string;
  waiverDescription: string;
  appliedWaivers: number;
  hasWaiverTransactions: boolean;
  fees: number;
  courseFee: number;

  constructor() {
    this.pendingBundles = new Array<PaymentBundle>();
    this.pendingAppChoices = new Array<PaymentAppChoice>();
    this.pendingPLs = new Array<PaymentAppChoice>();
  }

  public static createFromNestedJson(json: any): Payment {
    const payment = new Payment();
    Object.assign(payment, json);

    payment.pendingBundles = json.pendingBundles?.map((b) => PaymentBundle.createFromNestedJson(b));
    payment.pendingAppChoices = json.pendingAppChoices?.map((ac) => PaymentAppChoice.createFromNestedJson(ac));
    payment.pendingPLs = json.pendingPLs?.map((ac) => PaymentAppChoice.createFromNestedJson(ac));

    // Don't let them use more credit than they owe
    payment.spendableCredit = payment.credits > 0 && payment.credits > payment.amountOwed ? payment.amountOwed : payment.credits;
    // Always default to false, even if they have already applied credit
    payment.useCredit = false;
    return payment;
  }
}
