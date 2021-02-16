export class Payment {
  tuitionPaid: boolean;
  paidOnLoad: boolean;
  amountOwed: number;
  credits: number;
  ccFee: number;
  ccPercent: number;

  public static createFromNestedJson(json: any): Payment {
    const payment = new Payment();
    Object.assign(payment, json);

    return payment;
  }
}
