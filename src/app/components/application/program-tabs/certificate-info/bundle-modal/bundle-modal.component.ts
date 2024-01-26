import {Component, Input, OnInit} from '@angular/core';
import {CertificateGroup} from "../../../../../_classes/certificate-group";

@Component({
  selector: 'iee-bundle-modal',
  templateUrl: './bundle-modal.component.html',
  styleUrls: ['./bundle-modal.component.less']
})
export class BundleModalComponent implements OnInit {
  @Input() modal: any;
  @Input() group: CertificateGroup;
  @Input() selectedDivision: string;

  bundleChoices: Array<string> = [];

  isValid: boolean;

  get bundleChoiceString(): string  {
    return this.bundleChoices.join(';');
  }

  ngOnInit() {
    // console.dir(this.group);
  }

  dismiss() {
    this.modal.dismiss();
  }

  ok() {
    // console.dir(this.bundleChoices);
    this.isValid = this.bundleChoices.length === this.group.bundleSize
      && this.bundleChoices.reduce((prev, cur) => prev || !!cur, false);

    if (this.isValid) {
      this.modal.close(this.bundleChoiceString);
    } else {
      console.error('NOT ENOUGH OPTIONS CHOSEN')
    }
  }
}
