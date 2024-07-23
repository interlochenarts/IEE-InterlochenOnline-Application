import {SalesforceOption} from './salesforce-option';
import {ListTypes} from "../_enums/enums";
import {Course} from './course';

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
  sessionStartDate: number;
  sessionName: string;
  isSessionActive: boolean;
  isActive: boolean;
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
  courseNumber: string;
  courseId: string;
  courseName: string;

  public static createFromNestedJson(json: any): Program {
    const program = new Program();
    Object.assign(program, json);

    program.sessionDates = program.sessionDates || 'Will Schedule in the Future';
    const label = program.sessionDates;

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

  /**
   * Sort by session start with nulls first
   * @param a
   * @param b
   */
  public static sortBySessionStartNullsFirst(a: Program, b: Program): number {
    if (a.sessionStartDate && b.sessionStartDate) {
      return a.sessionStartDate - b.sessionStartDate;
    } else if (a.sessionStartDate) {
      return 1;
    } else if (b.sessionStartDate) {
      return -1;
    } else {
      return 0;
    }
  }

  /**
   * Sort by session start with nulls last
   * @param a
   * @param b
   */
  public static sortBySessionStartNullsLast(a: Program, b: Program): number {
    if (a.sessionStartDate && b.sessionStartDate) {
      return a.sessionStartDate - b.sessionStartDate
    } else if (a.sessionStartDate) {
      return -1;
    } else if (b.sessionStartDate) {
      return 1;
    } else {
      return 0;
    }
  }

  /**
   * Sort programs by name Ascending
   * @param a
   * @param b
   */
  public static sortByName(a: Program, b: Program): number {
    if (a.name === b.name) {
      return 0;
    }
    return (a.name > b.name) ? 1 : -1;
  }
}
