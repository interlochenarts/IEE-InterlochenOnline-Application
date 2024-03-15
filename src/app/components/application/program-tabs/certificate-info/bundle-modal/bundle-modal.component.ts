import {Component, Input, OnInit} from '@angular/core';
import {CertificateGroup} from "../../../../../_classes/certificate-group";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'iee-bundle-modal',
  templateUrl: './bundle-modal.component.html',
  styleUrls: ['./bundle-modal.component.less']
})
export class BundleModalComponent implements OnInit {
  @Input() modal: NgbActiveModal;
  @Input() group: CertificateGroup;
  @Input() selectedDivision: string;
  isValid: boolean;

  get bundleChoiceString(): string  {
    return this.group.bundleChoices.join(';');
  }

  ngOnInit() {
    // console.dir(this.group);
  }

  dismiss() {
    this.modal.dismiss();
  }

  ok() {
    // console.dir(this.bundleChoices);
    const allSelected = this.group.bundleChoices.reduce((prev, cur) => prev && !!cur, true);
    this.isValid = this.group.bundleChoices.length === this.group.bundleSize && allSelected;

    if (this.isValid) {
      this.modal.close(this.bundleChoiceString);
    } else {
      console.error('NOT ENOUGH OPTIONS CHOSEN')
    }
  }
}
