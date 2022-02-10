export class Payment {
  tuitionPaid: boolean;
  paidOnLoad: boolean;
  amountOwed: number;
  amountPaid: number;
  cancelAmount: number;
  payments: Array<string>;
  creditPayments: Array<string>;
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

  public static createFromNestedJson(json: any): Payment {
    const payment = new Payment();
    Object.assign(payment, json);
    // Don't let them use more credit than they owe
    payment.spendableCredit = payment.credits > 0 && payment.credits > payment.amountOwed ? payment.amountOwed : payment.credits;
    // Always default to false, even if they have already applied credit
    payment.useCredit = false;
    return payment;
  }
}
