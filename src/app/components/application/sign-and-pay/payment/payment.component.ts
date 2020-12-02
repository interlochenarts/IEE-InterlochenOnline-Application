import {Component, OnInit} from '@angular/core';
import {PaymentType} from '../../../../_enums/payment-type.enum';

@Component({
  selector: 'iee-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  PaymentType = PaymentType;
  paymentType: PaymentType = PaymentType.CC;

  constructor() { }

  ngOnInit(): void {
  }
}
