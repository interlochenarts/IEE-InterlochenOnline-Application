import {
  afterNextRender,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ApplicationData} from '../../../../_classes/application-data';
import {AppDataService} from '../../../../services/app-data.service';
import {Program} from '../../../../_classes/program';
import {SalesforceOption} from '../../../../_classes/salesforce-option';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ListTypes} from "../../../../_enums/enums";

@Component({
  selector: 'iee-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['../program-type.component.less', 'program-info.component.less']
})
export class ProgramInfoComponent implements OnInit, OnChanges {
  @Input() ageGroup: string;
  @Input() appDataTime: number;
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>>;
  selectedArtsArea = '';
  selectedSession = '';
  sortedArtsAreas: Array<SalesforceOption> = [];
  sortedSessions: Array<SalesforceOption> = [];
  modalInstrumentChoice: string;
  modalList: ListTypes; // the list (registered, selected, filtered) the modal was invoked from; for setting titles
  isMusic: boolean;
  isRegistered: boolean;
  selectedProgramInstruments: Array<SalesforceOption> = [];
  @ViewChild('selectedCoursesContainer') selectedContainerRef: ElementRef;

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appData = this.appDataService.applicationData.getValue();
    this.updateAreasOfStudy();

    this.appDataService.daysSelectedBySession.asObservable().subscribe(daysSelected => {
      if (daysSelected) {
        this.daysSelectedBySession = daysSelected;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appDataTime) {
      this.appData = this.appDataService.applicationData.getValue();
    }
    this.updateAreasOfStudy();
  }

  get selectedDivisionDescription(): string {
    return this.ageGroup;
  }

  get filteredPrograms(): Array<Program> {
    if (this.appData) {
      return this.appData.programData.programs.filter(p => !p.isSelected &&
        ((p.division === this.ageGroup) &&
          (this.selectedSession ? p.sessionName === this.selectedSession : true) &&
          (this.selectedArtsArea ? p.artsAreaList.indexOf(this.selectedArtsArea) > -1 : true)));
    }

    return [];
  }

  get selectedPrograms(): Array<Program> {
    return this.appData.acProgramData.programs.filter(p => (p.isSelected && !p.isRegistered && p.sessionId));
  }

  get registeredPrograms(): Array<Program> {
    return this.appData.acProgramData.programs.filter(p => (p.isSelected && p.isRegistered && p.sessionId));
  }

  updateAreasOfStudy(): void {
    this.selectedArtsArea = '';
    const artsAreaSet: Set<string> = new Set<string>();
    this.filteredPrograms.forEach(p => {
      p.artsAreaList.forEach(aa => {
        artsAreaSet.add(aa);
      });
    });

    // console.dir(this.filteredPrograms);
    // console.dir(artsAreaSet);

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
    const sessionStartDateSet = new Set<number>();
    const sessionNameByStartDate = new Map<number, string>();
    this.filteredPrograms.forEach((p: Program) => {
      sessionStartDateSet.add(p.sessionStartDate);
      sessionNameByStartDate.set(p.sessionStartDate, p.sessionName);
    });

    const sortedSessionStartDates = Array.from(sessionStartDateSet).sort();

    if (sortedSessionStartDates.length > 1) {
      // sort is now coming from SOQL ORDER BY in IEE_OnlineApplicationController.getProgramData
      this.sortedSessions = sortedSessionStartDates
        .map(sd => {
          const sessionName = sessionNameByStartDate.get(sd);
          return new SalesforceOption(this.appData.programData.sessionDates.get(sessionName), sessionName, false)
        });
      this.sortedSessions.unshift(new SalesforceOption('All', '', true));
    } else if (sortedSessionStartDates.length === 1) {
      this.sortedSessions = sortedSessionStartDates
        .map(sd => {
          const sessionName = sessionNameByStartDate.get(sd);
          return new SalesforceOption(this.appData.programData.sessionDates.get(sessionName), sessionName, true)
        });
      this.selectedSession = this.sortedSessions[0].value;
    }
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
          this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result
            .then(instrumentResult => {
              program.selectedInstrument = instrumentResult;
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

        window.scroll({
          top: window.scrollY + this.selectedContainerRef.nativeElement.getBoundingClientRect().top,
          left: 0,
          behavior: 'instant'
        });

        // clean up
        delete this.modalInstrumentChoice;
        delete this.isMusic;
        delete this.isRegistered;
        delete this.modalList;
      } else {
        // remove program from 'selected' list in memory
        this.appData.acProgramData.programs.forEach(((p, x) => {
          if (p.id === program.id && (p.artsArea !== 'Music' || (p.selectedInstrument === program.selectedInstrument))) { // have to id by instrument because multiples
            this.appDataService.removeProgram(p);
            this.appData.acProgramData.programs.splice(x, 1);
            this.appDataService.applicationData.next(this.appData);
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
