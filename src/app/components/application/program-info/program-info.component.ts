import {Component, OnInit} from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {Program} from '../../../_classes/program';
import {SalesforceOption} from '../../../_classes/salesforce-option';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {Payment} from '../../../_classes/payment';

declare const Visualforce: any;

@Component({
  selector: 'iee-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['./program-info.component.css']
})
export class ProgramInfoComponent implements OnInit {
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>> = new Map<string, Set<string>>();
  selectedArtsArea = '';
  selectedSession = '';
  sortedArtsAreas: Array<SalesforceOption> = [];
  sortedSessions: Array<SalesforceOption> = [];
  modalInstrumentChoice: string;
  modalList: string; // the list (registered, selected, filtered) the modal was invoked from; for setting titles
  modalLessonCount : number;
  modalLessonCountAdd : number;
  modalExistingCount : number;
  isPrivateLesson : boolean;
  isMusic : boolean;
  isRegistered : boolean;
  selectedProgramInstruments: Array<SalesforceOption> = [];

  // hardcode because salesforce is dumb and we can't pull picklist values based on record type
  gradeInSchoolOptions: Array<SalesforceOption> = [
    new SalesforceOption('2nd', '2nd', false),
    new SalesforceOption('3rd', '3rd', false),
    new SalesforceOption('4th', '4th', false),
    new SalesforceOption('5th', '5th', false),
    new SalesforceOption('6th', '6th', false),
    new SalesforceOption('7th', '7th', false),
    new SalesforceOption('8th', '8th', false),
    new SalesforceOption('9th', '9th', false),
    new SalesforceOption('10th', '10th', false),
    new SalesforceOption('11th', '11th', false),
    new SalesforceOption('12th', '12th', false),
  ];

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;

        this.appData.acProgramData.programs.forEach(p => {
          if (p.isSelected) {
            this.addDaysSelected(p);
          }
        });
        this.updateArtsAreas();
        this.updateSelectedDivision();
      } else {
        this.appData = new ApplicationData();
      }
    });

  }

  get selectedDivisionDescription(): string {
    return this.appData.programData.divisions.get(this.appData.programData.selectedDivision);
  }

  get filteredPrograms(): Array<Program> {
    return this.appData.programData.programs.filter(p => !p.isSelected &&
      ((p.division === this.appData.programData.selectedDivision) &&
      (this.selectedSession ? p.sessionName === this.selectedSession : true) &&
      (this.selectedArtsArea ? p.artsAreaList.indexOf(this.selectedArtsArea) > -1 : true)));
  }

  get selectedPrograms(): Array<Program> {
    return this.appData.acProgramData.programs.filter(p => (p.isSelected && !p.isRegistered));
  }

  get registeredPrograms(): Array<Program> {
    return this.appData.acProgramData.programs.filter(p => (p.isSelected && p.isRegistered));
  }


  updateArtsAreas(): void {
    this.selectedArtsArea = '';
    const artsAreaSet: Set<string> = new Set<string>();
    this.filteredPrograms.forEach(p => {
      p.artsAreaList.forEach(aa => {
        artsAreaSet.add(aa);
      });
    });

    if (artsAreaSet.size > 1) {
      this.sortedArtsAreas = Array.from(artsAreaSet).sort().map(aa => new SalesforceOption(aa, aa, false));
      this.sortedArtsAreas.unshift(new SalesforceOption('All', '', true));
    } else if (artsAreaSet.size === 1) {
      this.sortedArtsAreas = Array.from(artsAreaSet).sort().map(aa => new SalesforceOption(aa, aa, true));
      this.selectedArtsArea = this.sortedArtsAreas[0].value;
    }

    this.updateSessions();
  }

  updateSessions(): void {
    this.selectedSession = '';
    const sessionSet: Set<string> = new Set<string>();
    this.filteredPrograms.forEach(p => {
      sessionSet.add(p.sessionName);
    });
    if (sessionSet.size > 1) {
      // sort is now coming from SOQL ORDER BY in IEE_OnlineApplicationController.getProgramData
      this.sortedSessions = Array.from(sessionSet)
        .map(ss => new SalesforceOption(ss + ': ' + this.appData.programData.sessionDates.get(ss), ss, false));
      this.sortedSessions.unshift(new SalesforceOption('All', '', true));
    } else if (sessionSet.size === 1) {
      this.sortedSessions = Array.from(sessionSet)
        .map(s => new SalesforceOption(s + ': ' + this.appData.programData.sessionDates.get(s), s, true));
      this.selectedSession = this.sortedSessions[0].value;
    }
  }

  updateSelectedDivision(): void {
    const originalDivision: string = this.appData?.programData?.selectedDivision;
    const grade = this.appData.programData.gradeInSchool;
    if (grade) {
      const gradeNumber = grade.match(/\d+/);
      this.appData.programData.selectedDivision = this.appData.programData.divisionGradeMap.get(+gradeNumber);
      if (originalDivision && (originalDivision !== this.appData.programData.selectedDivision)) {
        this.clearSelectedPrograms();
      }
      this.updateArtsAreas();
    }
  }

  clearSelectedPrograms(): void {
    this.appData.programData.programs.filter(p => p.isSelected && !p.isRegistered).forEach(p => {
      p.isSaving = true;
      this.removeProgram(p);
    });
  }

  clickProgram(program: Program, modal, list): void {
    this.modalList = list;
    if (!program.isDisabled(this.daysSelectedBySession,
      (this.appData.payment.tuitionPaid && this.appData.payment.amountOwed >= 0)
      && !this.appData.isRegistered && !this.appData.isCancelOrWithdrawn, list) && !program.isSaving) {

      program.isSaving = true;
      if (!program.isSelected) {
        if ((program.artsAreaList[0] === 'Music' && program.programOptionsArray !== undefined && program.programOptionsArray.length > 0) || program.isPrivateLesson) { // open modal for music OR private lessons
          this.isPrivateLesson = program.isPrivateLesson;
          this.isMusic = program.artsAreaList[0] === 'Music';
          // if music, ask for instrument
          if (program.artsAreaList[0] === 'Music') {
            this.selectedProgramInstruments = program.programOptionsArray;
            // disable instruments from list if they exist in currently selected programs selected instrument.
            this.selectedProgramInstruments.forEach(o => {
              this.appData.acProgramData.programs.forEach(p => {
                if (p.isPrivateLesson && p.selectedInstrument === o.value) {
                  o.disabled = true;
                }
              });
            });
          }

          if (program.isPrivateLesson || program.artsAreaList[0] === 'Music') {
            this.modalLessonCount = this.modalLessonCount === 0 ? null : this.modalLessonCount;
            this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result
              .then(instrumentResult => {
                program.selectedInstrument = instrumentResult;
                program.lessonCount = this.modalLessonCount || 0;
                let pgmCopy: Program = Program.duplicateMe(program);
                pgmCopy.isSelected = true;
                this.appData.acProgramData.programs.push(pgmCopy);
                this.saveProgram(pgmCopy);
                program.isSelected = !this.isMusic && this.isPrivateLesson; // if private lesson, set music selected to false.
                program.isSaving = false;
                delete this.modalInstrumentChoice;
                delete this.modalLessonCount;
                delete this.isMusic;
                delete this.isPrivateLesson;
                delete this.isRegistered;
                delete this.modalList;
              }, reason => {
                // console.log(`Not Saving: Instrument closed (${reason})`);
                program.isSaving = false;
                delete this.modalInstrumentChoice;
                delete this.modalLessonCount;
                delete this.isMusic;
                delete this.isPrivateLesson;
                delete this.modalList;
              });
          }
        } else {
          // if not music, just save
          let pgmCopy : Program = Program.duplicateMe(program);
          pgmCopy.isSelected = true;
          this.appData.acProgramData.programs.push(pgmCopy);
          this.saveProgram(pgmCopy);
          program.isSelected = true;
          program.isSaving = false;
          delete this.isMusic;
          delete this.isPrivateLesson;
        }
      } else {
        // remove program from 'selected' list in memory
        this.appData.acProgramData.programs.forEach(((p, x) => {
          if (p.id === program.id && (p.artsArea !== 'Music' || (p.artsArea === 'Music' && p.selectedInstrument === program.selectedInstrument))) { // have to id by instrument because multiples
            this.removeProgram(p);
            this.appData.acProgramData.programs.splice(x, 1);
          }
        }));
        // sync up the filtered list.
          this.appData.programData.programs.forEach((p => {
            if (p.id === program.id) { // only one music program in filtered list
              p.isSelected = false;
              p.isSaving = false;
            }
          }));
      }
    }
  }

  addLessons(program: Program, modal, modalList): void {
    this.modalList = modalList;
    this.modalExistingCount = program.lessonCount;
    this.modalLessonCountAdd = program.isRegistered ? program.lessonCountAdd : program.lessonCount;
    this.modalLessonCountAdd = this.modalLessonCountAdd === 0 ? null : this.modalLessonCountAdd;
    this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result
      .then(lessonResult => {
        if (program.isRegistered) {
          program.lessonCountAdd = this.modalLessonCountAdd || 0;
        } else {
          program.lessonCount = this.modalLessonCountAdd || 0;
        }
         this.updateProgram(program);
        program.isSaving = false;
        delete this.modalLessonCountAdd;
        delete this.modalList;
      }, reason => {
        // console.log(`Not Saving: Instrument closed (${reason})`);
        program.isSaving = false;
        delete this.modalLessonCountAdd;
        delete this.modalList;
      });
  }


  get programsDisabled(): boolean {
    // Temporarily removed, might come back
    // Temporarily removed, might come back
    // Temporarily removed, might come back
    // const unRegisteredPrograms = this.appData.programData.programs.filter(
    //   program => (program.isSelected && !program.isRegistered)).length > 0;
    // const programSaving = this.appData.programData.programs.filter(program => program.isSaving).length > 0;
    // return (this.appData.payment.tuitionPaid && !this.appData.isRegistered) ||
    //   (this.appData.isRegistered && unRegisteredPrograms && !programSaving && this.appData.payment.amountOwed === 0);
    // Temporarily removed, might come back
    // Temporarily removed, might come back
    // Temporarily removed, might come back
    return false;
  }
  private addDaysSelected(p: Program): void {
    p.daysArray?.forEach(d => {
      const daysSelected: Set<string> = this.daysSelectedBySession.get(p.sessionName) || new Set<string>();
      daysSelected.add(d);
      this.daysSelectedBySession.set(p.sessionName, daysSelected);
    });
  }

  private saveProgram(program: Program): void  {
    program.isSelected = true;
    this.addDaysSelected(program);
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addAppChoice',
      this.appData.appId, program.id, program.sessionId,
      (program.selectedInstrument ? program.selectedInstrument : ''), (program.lessonCount ? program.lessonCount : ' '),
      result => {
        if (result.toString().startsWith('ERR')) {
          console.error(result);
        } else {
          // console.log('Saved new program: ' + result);
          program.appChoiceId = result;
          // Update payment info
          Visualforce.remoting.Manager.invokeAction(
            'IEE_OnlineApplicationController.getPaymentJSON',
            this.appData.appId,
            payment => {
              if (payment && payment !== 'null') {
                this.appData.payment = Payment.createFromNestedJson(JSON.parse(payment));
              }
            },
            {buffer: false, escape: false}
          );
        }
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }
  private updateProgram(program: Program): void  {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.updateAppChoiceLessons',
      this.appData.appId, program.appChoiceId, program.lessonCount, program.lessonCountAdd,
      result => {
        if (result.toString().startsWith('ERR')) {
          console.error(result);
        } else {
          console.log('updated program: ' + result);
          if (!program.isRegistered) {
            program.lessonCount += program.lessonCountAdd;
            program.lessonCountAdd = 0;
          }
          // Update payment info
          Visualforce.remoting.Manager.invokeAction(
            'IEE_OnlineApplicationController.getPaymentJSON',
            this.appData.appId,
            payment => {
              if (payment && payment !== 'null') {
                this.appData.payment = Payment.createFromNestedJson(JSON.parse(payment));
              }
            },
            {buffer: false, escape: false}
          );
        }
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  private removeProgram(program: Program): void {
    program.isSelected = false;
    const daysSelected = this.daysSelectedBySession.get(program.sessionName);
    program.daysArray?.forEach(d => {
      daysSelected.delete(d);
    });
    this.daysSelectedBySession.set(program.sessionName, daysSelected);
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.removeAppChoice',
      this.appData.appId, program.appChoiceId,
      result => {
        // console.log(result);
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }
}
