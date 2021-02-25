import {Component, OnInit} from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {Program} from '../../../_classes/program';
import {SalesforceOption} from '../../../_classes/salesforce-option';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';

declare const Visualforce: any;

@Component({
  selector: 'iee-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['./program-info.component.css']
})
export class ProgramInfoComponent implements OnInit {
  appData: ApplicationData;
  daysSelected: Set<string> = new Set<string>();
  selectedArtsArea = '';
  selectedSession = '';
  sortedArtsAreas: Array<SalesforceOption> = [];
  sortedSessions: Array<SalesforceOption> = [];
  modalInstrumentChoice: string;

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


  get selectedProgramSessions(): Set<string> {
    const selected = new Set<string>();
    this.appData.programData.programs.filter((p: Program) => p.isSelected).forEach(p => {
      selected.add(p.sessionName);
    });
    return selected;
  }

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;

        this.appData.programData.programs.forEach(p => {
          if (p.isSelected) {
            p.daysArray?.forEach(d => {
              this.daysSelected.add(d);
            });
          }
        });

        this.updateArtsAreas();
        this.updateSessions();
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
    return this.appData.programData.programs.filter(p =>
      (p.division === this.appData.programData.selectedDivision) &&
      (this.selectedSession ? p.sessionName === this.selectedSession : true) &&
      (this.selectedArtsArea ? p.artsArea === this.selectedArtsArea : true));
  }

  updateArtsAreas(): void {
    this.selectedArtsArea = '';
    const artsAreaSet: Set<string> = new Set<string>();
    this.filteredPrograms.forEach(p => {
      artsAreaSet.add(p.artsArea);
    });

    this.sortedArtsAreas = Array.from(artsAreaSet).sort().map(aa => new SalesforceOption(aa, aa, false));
    this.sortedArtsAreas.unshift(new SalesforceOption('All', '', true));
  }

  updateSessions(): void {
    this.selectedSession = '';
    console.dir(this.appData.programData.sessionDates);
    this.sortedSessions = this.appData.programData.sessions.sort()
      .map(s => new SalesforceOption(s + ': ' + this.appData.programData.sessionDates.get(s), s, false));
    this.sortedSessions.unshift(new SalesforceOption('All', '', true));
  }

  updateSelectedDivision(): void {
    const grade = this.appData.programData.gradeInSchool;
    const gradeNumber = grade.match(/\d+/);
    this.appData.programData.selectedDivision = this.appData.programData.divisionGradeMap.get(+gradeNumber);
    this.updateArtsAreas();
  }

  clickProgram(program: Program, modal): void {
    if (!program.isDisabled(this.daysSelected, this.selectedProgramSessions, this.appData.payment.tuitionPaid) && !program.isSaving) {
      program.isSaving = true;
      if (!program.isSelected) {
        if (program.artsArea === 'Music') {
          // if music, ask for instrument
          this.selectedProgramInstruments = program.programOptionsArray;
          this.modalService.open(modal, {ariaLabelledBy: 'modal-basic-title'}).result
            .then(instrumentResult => {
              program.selectedInstrument = instrumentResult;
              this.saveProgram(program);
              delete this.modalInstrumentChoice;
            }, reason => {
              console.dir(`Not Saving: Instrument closed (${reason})`);
              program.isSaving = false;
            });
        } else {
          // if not music, just save
          this.saveProgram(program);
        }
      } else {
        this.removeProgram(program);
      }
    }
  }

  private saveProgram(program: Program): void {
    program.isSelected = true;
    program.daysArray?.forEach(d => {
      this.daysSelected.add(d);
    });
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addAppChoice',
      this.appData.appId, program.id, program.sessionId,
      (program.selectedInstrument ? program.selectedInstrument : ''),
      result => {
        if (result.toString().startsWith('ERR')) {
          console.error(result);
        } else {
          console.log('Saved new program: ' + result);
          program.appChoiceId = result;
        }
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  private removeProgram(program: Program): void {
    program.isSelected = false;
    program.daysArray?.forEach(d => {
      this.daysSelected.delete(d);
    });
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.removeAppChoice',
      this.appData.appId, program.appChoiceId,
      result => {
        console.log(result);
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }
}
