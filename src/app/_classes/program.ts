import {SalesforceOption} from './salesforce-option';

export class Program {
  id: string;
  sessionId: string;
  name: string;
  daysOfAttendance: string;
  artsArea: string;
  division: string;
  isSelected = false;
  appChoiceId: string;
  sessionDates: string;
  sessionName: string;
  programOptions: string;
  selectedInstrument: string;
  isSaving = false;

  public static createFromNestedJson(json: any): Program {
    const program = new Program();
    Object.assign(program, json);

    return program;
  }

  get daysDisplay(): string {
    return this.daysArray?.reduce((prev: string, curr: string, index: number, array: string[]): string => {
      return prev + (index === array.length - 1 ? ', & ' : ', ') + curr;
    });
  }

  get daysArray(): Array<string> {
    return this.daysOfAttendance?.split(';');
  }

  get programOptionsArray(): Array<SalesforceOption> {
    return this.programOptions?.split(';').map(i => new SalesforceOption(i, i, false));
  }

  public isDisabled(daysSelectedBySession: Map<string, Set<string>>, feePaid: boolean): boolean {
    // disable everything if fee already paid
    if (feePaid) {
      return true;
    }

    // allow changes to selected
    if (this.isSelected) {
      return false;
    }

    let daySelected = false;
    // if no days selected for a session, return a set instead of null
    const daysSelected = daysSelectedBySession.get(this.sessionName) || new Set<string>();
    for (const d of daysSelected) {
      if (this.daysArray?.includes(d)) {
        daySelected = true;
      }
    }

    return daySelected;
  }

  get artsAreaList(): Array<string> {
    return this.artsArea.split(';');
  }
}
