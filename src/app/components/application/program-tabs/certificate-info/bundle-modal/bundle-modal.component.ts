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

  ngOnInit() {
    console.dir(this.group);
  }

  dismiss() {
    this.modal.close(null);
  }

  ok() {
    this.modal.close(this.bundleChoices);
  }
}
