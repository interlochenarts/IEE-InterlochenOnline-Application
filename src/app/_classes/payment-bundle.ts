import {PaymentWaiver} from './payment-waiver';
import {PaymentAppChoice} from './payment-appchoice';

export class PaymentBundle {
  name: string;
  discount: PaymentWaiver;
  appChoices: Array<PaymentAppChoice>;

  constructor() {
    this.appChoices = new Array<PaymentAppChoice>();
  }

  public static createFromNestedJson(json: any): PaymentBundle {
    const paymentBundle = new PaymentBundle();
    Object.assign(paymentBundle, json);

    paymentBundle.discount = PaymentWaiver.createFromNestedJson(paymentBundle.discount);
    paymentBundle.appChoices = json.appChoices?.map((ac) => PaymentAppChoice.createFromNestedJson(ac));

    return paymentBundle;
  }
}