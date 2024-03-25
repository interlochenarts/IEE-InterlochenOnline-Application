import {Component, Input, OnInit} from '@angular/core';
import {CertificateGroup} from "../../../../../_classes/certificate-group";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from '../../../../../_classes/program';

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
  allSelected: boolean;
  allInSequence: boolean;

  get certIsSequenced(): boolean {
    if (this.group) {
      return !!this.group.courses[0].displayOrder;
    } else {
      return false;
    }
  }

  get bundleChoiceString(): string {
    return this.group.bundleChoices.join(';');
  }

  get selectedIOCourses() {
    const selectedPrograms: Program[] = [];
    selectedPrograms.length = this.group.bundleSize;
    this.group.bundleChoices.forEach((id: string, index: number) => {
      const program = this.group.courses[index].programsByDivision.get(this.selectedDivision).find(p => p.id === id);
      if (program) {
        selectedPrograms[index] = program;
      }
    });
    return selectedPrograms;
  }

  ngOnInit() {
    // console.dir(this.group);
  }

  dismiss() {
    this.modal.dismiss();
  }

  ok() {
    // console.dir(this.group.bundleChoices);
    let allSelected = true;
    let allOrderedInSuccession = true;
    let previousSessionStart = -1;
    for (let i = 0; i < this.group.bundleSize; i++) {
      // check to make sure there are no program slots empty
      if (!this.group.bundleChoices[i]) {
        allSelected = false;
      }

      // check to make sure an ordered course is not selected before its previous course
      const program = this.selectedIOCourses[i];
      if (program && program.sessionStartDate && this.group.courses[i].displayOrder) {
        // only care if the session has a start date and there is an order
        if (program.sessionStartDate <= previousSessionStart) {
          // if this program has a startDate before the previous one, fail
          allOrderedInSuccession = false;
        }
        previousSessionStart = program.sessionStartDate;
      }
    }

    this.allSelected = this.group.bundleChoices.length === this.group.bundleSize && allSelected;
    this.allInSequence = allOrderedInSuccession;

    this.isValid = this.allSelected && this.allInSequence;

    if (this.isValid) {
      this.modal.close(this.bundleChoiceString);
    } else {
      if (!(this.group.bundleChoices.length === this.group.bundleSize && allSelected)) {
        console.error('NOT ENOUGH OPTIONS CHOSEN');
      } else if (!allOrderedInSuccession) {
        console.error('OPTIONS CHOSEN OUT OF SEQUENCE');
      }
    }
  }
}
