import {Component, Input} from '@angular/core';
import {CertificateGroup} from "../../../../../_classes/certificate-group";

@Component({
  selector: 'iee-bundle-modal',
  templateUrl: './bundle-modal.component.html',
  styleUrls: ['./bundle-modal.component.less']
})
export class BundleModalComponent {
  @Input() modal: any;
  @Input() group: CertificateGroup;

  bundleChoices: Array<string> = [];

  dismiss() {
    this.modal.close(null);
  }

  ok() {
    this.modal.close(this.bundleChoices);
  }
}
