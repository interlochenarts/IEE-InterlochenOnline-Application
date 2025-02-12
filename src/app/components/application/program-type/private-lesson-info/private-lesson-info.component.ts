import {
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ApplicationData} from "../../../../_classes/application-data";
import {AppDataService} from '../../../../services/app-data.service';
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from "../../../../_classes/program";
import {ListTypes} from "../../../../_enums/enums";
import {SalesforceOption} from "../../../../_classes/salesforce-option";
import {PrivateLessonResult} from '../../../../_classes/private-lesson-result';

@Component({
  selector: 'iee-private-lesson-info',
  templateUrl: './private-lesson-info.component.html',
  styleUrls: ['../program-type.component.less', 'private-lesson-info.component.less']
})
export class PrivateLessonInfoComponent implements OnInit, OnChanges {
  @Input() appDataTime: number = 0;
  @ViewChild('selectedLessonContainer') selectedContainerRef: ElementRef;
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>>;

  modalExistingCount: number;
  modalListType: ListTypes;
  isMusic: boolean;
  isRegistered: boolean;
  selectedProgram: Program;
  selectedProgramInstruments: Array<SalesforceOption> = [];

  modalOptions = {
    ariaLabelledBy: 'modal-basic-title',
    animation: true,
    size: 'lg',
  };

  get filteredLessons(): Array<Program> {
    return this.appData.programData.privateLessons.filter(p =>
      (this.appData.ageGroup === p.division) &&
      (this.appData.isAdultApplicant ? p.division === 'Adult' : p.division !== 'Adult') &&
      (!p.isSelected || p.artsAreaList.includes('Music')));
  }

  get selectedPrograms(): Array<Program> {
    return this.appData.acProgramData.privateLessons.filter(p => p.isSelected && !p.isRegistered && p.division === this.appData.ageGroup);
  }

  get registeredPrograms(): Array<Program> {
    return this.appData.acProgramData.privateLessons.filter(p => p.isRegistered && p.division === this.appData.ageGroup);
  }

  get programsDisabled(): boolean {
    return false;
  }

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appData = this.appDataService.applicationData.getValue();

    this.appDataService.daysSelectedBySession.asObservable().subscribe(days => {
      if (days) {
        this.daysSelectedBySession = days;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appDataTime) {
      this.appData = this.appDataService.applicationData.getValue();
    }
  }

  clickProgram(program: Program, modal: any, list: ListTypes): void {
    this.isMusic = program.artsAreaList.includes('Music');
    this.selectedProgram = program;

    if (!program.isDisabled(this.daysSelectedBySession,
      (this.appData.payment.tuitionPaid && this.appData.payment.amountOwed >= 0)
      && !this.appData.isRegistered && !this.appData.isCancelOrWithdrawn, list) && !program.isSaving) {

      if (!program.isSelected) {
        // if music, ask for instrument
        if (this.isMusic) {
          this.selectedProgramInstruments = program.programOptionsArray;
          // disable instruments from list if they exist in currently selected courses selected instrument, but only for private lessons.
          this.selectedProgramInstruments.forEach((option: SalesforceOption) => {
            this.appData.acProgramData.privateLessons.forEach(p => {
              if (p.isPrivateLesson && p.selectedInstrument === option.value) {
                option.disabled = true;
              }
            });
          });
        }

        const modalRef = this.modalService.open(modal, this.modalOptions);

        modalRef.closed.subscribe((newLesson: string) => {
          const result: PrivateLessonResult = JSON.parse(newLesson);

          if (this.isMusic) {
            program.selectedInstrument = result.instrument;
            program.selectedInstrumentOther = result.otherInstrument;
            program.isRegistered = false;
          }
          program.lessonCount = result.lessonCount;

          let pgmCopy: Program = Program.duplicateMe(program);
          console.dir(pgmCopy);
          this.appData.acProgramData.privateLessons.push(pgmCopy);
          this.appDataService.saveProgram(pgmCopy);
          program.isSelected = !this.isMusic; // if private lesson, set music selected to false.

          window.scroll({
            top: window.scrollY + this.selectedContainerRef.nativeElement.getBoundingClientRect().top,
            left: 0,
            behavior: 'instant'
          });
        });

      } else {
        // remove program from 'selected' list in memory
        this.appData.acProgramData.privateLessons.forEach(((p: Program, x: number) => {
          if (p.id === program.id && (p.artsArea !== 'Music' || p.selectedInstrument === program.selectedInstrument)) { // have to id by instrument because multiples
            this.appDataService.removeProgram(p);
            this.appData.acProgramData.privateLessons.splice(x, 1);
            this.appDataService.applicationData.next(this.appData);
          }
        }));
        // sync up the filtered list.
        this.appData.programData.privateLessons.forEach((p => {
          if (p.id === program.id) { // only one music program in filtered list
            p.isSelected = false;
          }
        }));
      }
    }
  }

  addLessons(program: Program, modal: any): void {
    if (program.isRegistered) {
      this.modalExistingCount = program.lessonCountAdd;
    } else {
      this.modalExistingCount = program.lessonCount;
    }
    this.modalListType = program.isRegistered ? ListTypes.REGISTERED : ListTypes.SELECTED;
    this.selectedProgram = program;
    const modalRef = this.modalService.open(modal, this.modalOptions);
    modalRef.closed.subscribe((lessonResult: string) => {
      const result = JSON.parse(lessonResult);
      if (program.isRegistered) {
        program.lessonCountAdd = result.lessonCountAdd || 0;
      } else {
        program.lessonCount = result.lessonCountAdd || 0;
      }
      this.appDataService.updateProgram(program);
    });
  }

  protected readonly ListTypes = ListTypes;
}
