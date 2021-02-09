import {Parent} from './parent';

export class CreditCardPaymentData {
  cardholderName: string;
  cardNumber: string;
  expirationMonth: number;
  expirationYear: number;
  cvv: string;
  billingZip: string;
  paymentDate: string;

  public isMissingInputs(): boolean {
    let missing = '';
    missing += !this.cardholderName ? ' Cardholder Name' : '';
    missing += !this.cardNumber ? ' Card Number' : '';
    missing += !this.expirationMonth ? ' Expiration Month' : '';
    missing += !this.expirationYear ? ' Expiration Year' : '';
    missing += !this.cvv ? ' CVV' : '';
    missing += !this.billingZip ? ' Billing Zip' : '';
    if (missing.length > 0) { console.log('CC Missing : ' + missing); }
    return missing.length > 0;
  }
}
