import {PaymentWaiver} from './payment-waiver';

export class PaymentAppChoice {
  name: string;
  amount: number;
  waiver: PaymentWaiver;

  public static createFromNestedJson(json: any): PaymentAppChoice {
    const paymentAppChoice = new PaymentAppChoice();
    Object.assign(paymentAppChoice, json);

    paymentAppChoice.waiver = json.waiver?.map((w) => PaymentWaiver.createFromNestedJson(w));

    return paymentAppChoice;
  }
}