import {PaymentWaiver} from './payment-waiver';

export class PaymentAppChoice {
  name: string;
  amount: number;
  waiver: PaymentWaiver;
  session: string;

  public static createFromNestedJson(json: any): PaymentAppChoice {
    const paymentAppChoice = new PaymentAppChoice();
    Object.assign(paymentAppChoice, json);

    if (json.waiver) {
      paymentAppChoice.waiver = PaymentWaiver.createFromNestedJson(json.waiver);
    }

    return paymentAppChoice;
  }
}