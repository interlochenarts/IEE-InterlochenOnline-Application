import {Component, Input, OnInit} from '@angular/core';
import {CertificateGroup} from "../../../../../_classes/certificate-group";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from '../../../../../_classes/program';
import {Course} from '../../../../../_classes/course';
import {AppDataService} from '../../../../../services/app-data.service';

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
  atLeastOneScheduled: boolean;
  atLeastOneInvalid: boolean;

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

  constructor(private appDataService: AppDataService) {}

  ngOnInit() {
    // console.dir(this.group);
  }

  checkInvalid() {
    this.group.courses.forEach(course => {
      course.programsByDivision.get(this.selectedDivision).forEach(program => {
        if (this.selectedIOCourses.includes(program)) {
          course.isInvalid = program.sessionId && (!program.isActive || !program.isSessionActive);
        }
      });
    });
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

        if (i > 0) { // for courses that are ordered, don't let them select 'will schedule later' for the second option if they pick a date for the 3rd
          const previousProgram = this.selectedIOCourses[i-1];
          if (!!program.sessionStartDate && !previousProgram.sessionStartDate) {
            allOrderedInSuccession = false;
          }
        }
      }
    }

    this.atLeastOneScheduled = this.selectedIOCourses.reduce((hasSessions: boolean, p: Program) => hasSessions || !!p.sessionId, false);

    this.allSelected = this.group.bundleChoices.length === this.group.bundleSize && allSelected;
    this.allInSequence = allOrderedInSuccession;
    this.atLeastOneInvalid = this.selectedIOCourses.reduce((hasInvalid: boolean, p: Program) => hasInvalid || (p.sessionId && (!p.isSessionActive || !p.isActive)), false);

    this.isValid = this.allSelected && this.allInSequence && this.atLeastOneScheduled && !this.atLeastOneInvalid;

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

  getUnselectedProgramsByCourse(course: Course): Array<Program> {
    const selectedPrograms = this.appDataService.applicationData.getValue().acProgramData.programs;
    return course.getProgramsByDivision(this.selectedDivision).filter(courseProgram => {
      // match on program id, ignore any that are part of this bundle
      return selectedPrograms.findIndex(sp => sp.id === courseProgram.id && sp.certificateGroupId !== this.group.id) < 0;
    });
  }
}
