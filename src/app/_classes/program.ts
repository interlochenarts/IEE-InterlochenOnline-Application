import {SalesforceOption} from './salesforce-option';
import {ListTypes} from "../_enums/enums";

export class Program {
  id: string;
  sessionId: string;
  name: string;
  daysOfAttendance: string;
  daysOfAttendanceApi: string;
  artsArea: string;
  division: string;
  isSelected = false;
  isRegistered = false;
  registeredDate: string;
  allowsConflicts = false;
  isCancelOrWithdrawn = false;
  appChoiceId: string;
  sessionDates: string;
  sessionName: string;
  programOptions: string;
  selectedInstrument: string;
  isSaving = false;
  lessonCount = 0;
  lessonCountAdd = 0;
  isPrivateLesson = false;
  certificateGroupId: string;
  certificateGroupName: string;
  certificateGroupOption: SalesforceOption;
  selectedInstrumentOther: string;

  public static createFromNestedJson(json: any): Program {
    const program = new Program();
    Object.assign(program, json);

    const label = program.sessionName || 'Will Schedule in the Future';

    program.certificateGroupOption = new SalesforceOption(label, program.id, false);

    return program;
  }

  public static duplicateMe(inProgram: Program): Program {
    const program = new Program();
    Object.assign(program, inProgram);

    return program;
  }

  get daysDisplay(): string {
    return this.daysArray?.reduce((prev: string, curr: string, index: number, array: string[]): string => {
      return prev + (index === array.length - 1 ? ' & ' : ', ') + curr;
    });
  }

  get daysArray(): Array<string> {
    return this.daysOfAttendance?.split(';');
  }

  get daysArrayApi(): Array<string> {
    return this.daysOfAttendanceApi?.split(';');
  }

  get programOptionsArray(): Array<SalesforceOption> {
    return this.programOptions?.split(';').map(i => new SalesforceOption(i, i, false));
  }

  public isDisabled(daysSelectedBySession: Map<string, Set<string>>, feePaid: boolean, list: ListTypes): boolean {
    // Don't let them re-select it if they already had this program selected and canceled or withdrew
    if (this.isCancelOrWithdrawn) {
      return true;
    }

    // disable program if it has been selected as part of a bundle
    if (this.certificateGroupId || this.certificateGroupName) {
      return true;
    }

    // disable everything if fee already paid
    // "feePaid" is the passed in result of the program-info.programsDisabled() function currently commented out, except where called in program-info.clickProgram()
    // we're leaving the private lesson music re-selectable (because their existing instruments will be disabled, but they can pick new ones for pvt lessons)
    if (list === ListTypes.SELECTED && (feePaid || this.isRegistered)) {
      return true;
    }

    if (list === ListTypes.FILTERED &&
      ((this.isRegistered && this.isPrivateLesson && this.artsArea != 'Music')
        || (this.isRegistered && !this.isPrivateLesson))) {
      return true;
    }

    // allow changes to "selected"
    if (this.isSelected) {
      return false;
    }

    let daySelected = false;
    // if no days selected for a session, return a set instead of null
    const daysSelected = daysSelectedBySession.get(this.sessionName) || new Set<string>();
    for (const d of daysSelected) {
      if (this.daysArrayApi?.includes(d)) {
        daySelected = true;
      }
    }

    return daySelected;
  }

  get artsAreaList(): Array<string> {
    return this.artsArea.split(';');
  }

  public static sort(a: Program, b: Program): number {
    return a.sessionDates.includes(':') && b.sessionDates.includes(':') ?
      (new Date(a.sessionDates.split(':')[1].split('-')[0].trim()).getTime() -
        new Date(b.sessionDates.split(':')[1].split('-')[0].trim()).getTime()): 0;
  }
}
