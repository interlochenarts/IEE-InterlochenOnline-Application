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

  get programOptionsArray(): Array<string> {
    return this.programOptions?.split(';');
  }

  public isDisabled(daysSelected: Set<string>, selectedSessions: Set<string>): boolean {
    if (this.isSelected) {
      return false;
    }

    let daySelected = false;
    let sessionSelected = false;
    for (const d of daysSelected) {
      if (this.daysArray.includes(d)) {
        daySelected = true;
      }
      if (Array.from(selectedSessions).includes(this.sessionName)) {
        sessionSelected = true;
      }
    }

    return daysSelected && sessionSelected;
  }

  get artsAreaList(): Array<string> {
    return this.artsArea.split(';');
  }
}
