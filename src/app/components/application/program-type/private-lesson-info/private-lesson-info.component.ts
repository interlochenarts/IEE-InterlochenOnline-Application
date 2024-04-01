import {Component, OnInit} from '@angular/core';
import {ApplicationData} from "../../../../_classes/application-data";
import {AppDataService} from '../../../../services/app-data.service';
import {NgbActiveModal, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from "../../../../_classes/program";
import {ListTypes} from "../../../../_enums/enums";
import {SalesforceOption} from "../../../../_classes/salesforce-option";

@Component({
  selector: 'iee-private-lesson-info',
  templateUrl: './private-lesson-info.component.html',
  styleUrls: ['../program-type.component.less', 'private-lesson-info.component.less']
})
export class PrivateLessonInfoComponent implements OnInit {
  appData: ApplicationData;
  isLoading: boolean = true;
  modalList: ListTypes;
  daysSelectedBySession: Map<string, Set<string>>;

  modalInstrumentChoice: string;
  modalLessonCount: number;
  modalLessonCountAdd: number;
  modalExistingCount: number;
  isMusic: boolean;
  isRegistered: boolean;
  selectedProgramInstruments: Array<SalesforceOption> = [];
  otherInstrument: string;

  get filteredLessons(): Array<Program> {
    return this.appData.programData.privateLessons.filter(p =>
      (this.appData.programData.selectedDivision === p.division) &&
      (this.appData.isAdultApplicant ? p.division === 'Adult' : p.division !== 'Adult') &&
      (!p.isSelected || p.artsAreaList.includes('Music')));
  }

  get selectedPrograms(): Array<Program> {
    return this.appData.acProgramData.privateLessons.filter(p => (p.isSelected && !p.isRegistered));
  }

  get programsDisabled(): boolean {
    return false;
  }

  get isOtherInstrument() :boolean {
    return this.modalInstrumentChoice === 'Other';
  }

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;

        // pre-check boxes for app choices in the main list
        this.appData.acProgramData.privateLessons.forEach(acp => {
          if (!acp.artsAreaList.includes('Music')) {
            this.appData.programData.privateLessons.find(p => p.id === acp.id).isSelected = true;
          }
        });

        this.isLoading = false;
      } else {
        this.appData = new ApplicationData();
      }
    });

    this.appDataService.daysSelectedBySession.asObservable().subscribe(days => {
      if (days) {
        this.daysSelectedBySession = days;
      }
    });
  }

  clickProgram(program: Program, modal: any, list: ListTypes): void {
    this.modalList = list;
    this.isMusic = program.artsAreaList.includes('Music');

    if (!program.isDisabled(this.daysSelectedBySession,
      (this.appData.payment.tuitionPaid && this.appData.payment.amountOwed >= 0)
      && !this.appData.isRegistered && !this.appData.isCancelOrWithdrawn, list) && !program.isSaving) {

      program.isSaving = true;
      if (!program.isSelected) {


        // if music, ask for instrument
        if (this.isMusic) {
          this.selectedProgramInstruments = program.programOptionsArray;
          // disable instruments from list if they exist in currently selected courses selected instrument, but only for private lessons.
          this.selectedProgramInstruments.forEach((o: SalesforceOption) => {
            this.appData.acProgramData.privateLessons.forEach(p => {
              if (p.isPrivateLesson && p.selectedInstrument === o.value) {
                o.disabled = true;
              }
            });
          });
        }

        this.modalLessonCount = !this.modalLessonCount ? null : this.modalLessonCount;
        this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', animation: true}).result
          .then((newModalResult: string) => {
            const result = JSON.parse(newModalResult);

            if (this.isMusic) {
              program.selectedInstrument = result.instrumentChoice;
                program.selectedInstrumentOther = this.otherInstrument;
            }
            program.lessonCount = result.lessonCount;

            program.isSelected = true;

            let pgmCopy: Program = Program.duplicateMe(program);
            this.appData.acProgramData.privateLessons.push(pgmCopy);
            this.appDataService.saveProgram(pgmCopy);
            program.isSelected = !this.isMusic; // if private lesson, set music selected to false.

            program.isSaving = false;
            this.clearModalVars();
          }, (reason: string) => {
            // console.info(`Not Saving: Instrument closed (${reason})`);
            program.isSaving = false;
            this.clearModalVars();
          });


      } else {
        // remove program from 'selected' list in memory
        this.appData.acProgramData.privateLessons.forEach(((p: Program, x: number) => {
          if (p.id === program.id && (p.artsArea !== 'Music' || p.selectedInstrument === program.selectedInstrument)) { // have to id by instrument because multiples
            this.appDataService.removeProgram(p);
            this.appData.acProgramData.privateLessons.splice(x, 1);
          }
        }));
        // sync up the filtered list.
        this.appData.programData.privateLessons.forEach((p => {
          if (p.id === program.id) { // only one music program in filtered list
            p.isSelected = false;
            p.isSaving = false;
          }
        }));
      }
    }
  }

  addLessons(program: Program, modal: any, modalList: ListTypes): void {
    this.modalList = modalList;
    this.modalExistingCount = program.lessonCount;
    this.modalLessonCountAdd = program.isRegistered ? program.lessonCountAdd : program.lessonCount;
    this.modalLessonCountAdd = this.modalLessonCountAdd === 0 ? null : this.modalLessonCountAdd;
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title', animation: true}).result
      .then(lessonResult => {
        if (program.isRegistered) {
          program.lessonCountAdd = this.modalLessonCountAdd || 0;
        } else {
          program.lessonCount = this.modalLessonCountAdd || 0;
        }
        this.appDataService.updateProgram(program);
        program.isSaving = false;
        delete this.modalLessonCountAdd;
        delete this.modalList;
      }, (reason: string) => {
        // console.info(`Not Saving: Instrument closed (${reason})`);
        program.isSaving = false;
        delete this.modalLessonCountAdd;
        delete this.modalList;
      });
  }

  closeAddLessonModal(modal: NgbActiveModal) {
    const values = {
      lessonCount: this.modalLessonCount
    }
    modal.close(JSON.stringify(values));
  }

  closeNewLessonModal(modal: NgbActiveModal) {
    const values = {
      instrumentChoice: this.modalInstrumentChoice,
      lessonCount: this.modalLessonCount
    }
    modal.close(JSON.stringify(values));
  }

  private clearModalVars() {
    // clear stuff
    this.modalInstrumentChoice = null;
    this.modalLessonCount = null;
    this.isMusic = null;
    this.isRegistered = null;
    this.otherInstrument = null;
  }

  protected readonly ListTypes = ListTypes;
}
