export class PaymentWaiver {
  name: string;
  code: string;
  amount: number;

  public static createFromNestedJson(json: any): PaymentWaiver {
    const paymentWaiver = new PaymentWaiver();
    Object.assign(paymentWaiver, json);
    return paymentWaiver;
  }
}