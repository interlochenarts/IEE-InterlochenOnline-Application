import {Component, Input, OnInit} from '@angular/core';
import {CreditCardPaymentData} from '../../../../../_classes/credit-card-payment-data';

@Component({
  selector: 'iee-credit-card',
  templateUrl: './credit-card.component.html',
  styleUrls: ['./credit-card.component.css']
})
export class CreditCardComponent implements OnInit {
  @Input() cc: CreditCardPaymentData;
  transactionMessage: string;

  constructor() {
  }

  ngOnInit(): void {
    this.cc = this.cc || new CreditCardPaymentData();
  }

}
