import {Component, Input, OnInit} from '@angular/core';
import {AchPaymentData} from '../../../../../_classes/ach-payment-data';

@Component({
  selector: 'iee-ach',
  templateUrl: './ach.component.html',
  styleUrls: ['./ach.component.css']
})
export class AchComponent implements OnInit {
  @Input() achPaymentData: AchPaymentData;

  constructor() { }

  ngOnInit(): void {
    this.achPaymentData = this.achPaymentData || new AchPaymentData();
  }

}
