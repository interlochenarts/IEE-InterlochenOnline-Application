import {Component, OnInit} from '@angular/core';
import {ApplicationData} from '../../../../_classes/application-data';
import {AppDataService} from '../../../../services/app-data.service';
import {Program} from '../../../../_classes/program';
import {SalesforceOption} from '../../../../_classes/salesforce-option';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ListTypes} from "../../../../_enums/enums";

@Component({
  selector: 'iee-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['../program-tabs.component.less', 'program-info.component.less']
})
export class ProgramInfoComponent implements OnInit {
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>>;
  selectedArtsArea = '';
  selectedSession = '';
  sortedArtsAreas: Array<SalesforceOption> = [];
  sortedSessions: Array<SalesforceOption> = [];
  modalInstrumentChoice: string;
  modalList: ListTypes; // the list (registered, selected, filtered) the modal was invoked from; for setting titles
  modalLessonCount: number;
  modalLessonCountAdd: number;
  modalExistingCount: number;
  isMusic: boolean;
  isRegistered: boolean;
  selectedProgramInstruments: Array<SalesforceOption> = [];
  isLoading: boolean = true;

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
            this.appDataService.addDaysSelected(p);
          }
        });
        this.updateArtsAreas();
        this.updateSelectedDivision();
        this.isLoading = false;
      } else {
        this.appData = new ApplicationData();
      }
    });

    this.appDataService.daysSelectedBySession.asObservable().subscribe(daysSelected => {
      if (daysSelected) {
        this.daysSelectedBySession = daysSelected;
      }
    })
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
        .map(ss => new SalesforceOption(this.appData.programData.sessionDates.get(ss), ss, false));
      this.sortedSessions.unshift(new SalesforceOption('All', '', true));
    } else if (sessionSet.size === 1) {
      this.sortedSessions = Array.from(sessionSet)
        .map(s => new SalesforceOption(this.appData.programData.sessionDates.get(s), s, true));
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
      this.appDataService.removeProgram(p);
    });
  }

  clickProgram(program: Program, modal: any, list: ListTypes): void {
    this.modalList = list;
    if (!program.isDisabled(this.daysSelectedBySession,
      (this.appData.payment.tuitionPaid && this.appData.payment.amountOwed >= 0)
      && !this.appData.isRegistered && !this.appData.isCancelOrWithdrawn, list) && !program.isSaving) {
      this.isMusic = program.artsAreaList.includes('Music');
      program.isSaving = true;
      if (!program.isSelected) {
        if (this.isMusic && program.programOptionsArray && program.programOptionsArray.length > 0) { // open modal for music
          // if music, ask for instrument
          this.selectedProgramInstruments = program.programOptionsArray;
          this.modalLessonCount = this.modalLessonCount === 0 ? null : this.modalLessonCount;
          this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result
            .then(instrumentResult => {
              program.selectedInstrument = instrumentResult;
              program.lessonCount = this.modalLessonCount || 0;
              let pgmCopy: Program = Program.duplicateMe(program);
              pgmCopy.isSelected = true;
              this.appData.acProgramData.programs.push(pgmCopy);
              this.appDataService.saveProgram(pgmCopy);
              program.isSelected = true;
              program.isSaving = false;
            }, reason => {
              console.info(`Not Saving: Instrument closed (${reason})`);
              program.isSaving = false;
            });
        } else {
          // if not music, just save
          let pgmCopy: Program = Program.duplicateMe(program);
          pgmCopy.isSelected = true;
          this.appData.acProgramData.programs.push(pgmCopy);
          this.appDataService.saveProgram(pgmCopy);
          program.isSelected = true;
          program.isSaving = false;
        }

        // clean up
        delete this.modalInstrumentChoice;
        delete this.modalLessonCount;
        delete this.isMusic;
        delete this.isRegistered;
        delete this.modalList;
      } else {
        // remove program from 'selected' list in memory
        this.appData.acProgramData.programs.forEach(((p, x) => {
          if (p.id === program.id && (p.artsArea !== 'Music' || (p.selectedInstrument === program.selectedInstrument))) { // have to id by instrument because multiples
            this.appDataService.removeProgram(p);
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


  get programsDisabled(): boolean {
    // Temporarily removed, might come back


    // const unRegisteredPrograms = this.appData.programData.programs.filter(
    //   program => (program.isSelected && !program.isRegistered)).length > 0;
    // const programSaving = this.appData.programData.programs.filter(program => program.isSaving).length > 0;
    // return (this.appData.payment.tuitionPaid && !this.appData.isRegistered) ||
    //   (this.appData.isRegistered && unRegisteredPrograms && !programSaving && this.appData.payment.amountOwed === 0);


    // Temporarily removed, might come back

    return false;
  }

  protected readonly ListTypes = ListTypes;
}
