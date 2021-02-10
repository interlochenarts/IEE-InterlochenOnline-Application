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

  public static createFromNestedJson(json: any): Program {
    const program = new Program();
    Object.assign(program, json);

    return program;
  }

  get daysDisplay(): string {
    return this.daysOfAttendance.replace(';', ' & ');
  }

  get daysArray(): Array<string> {
    return this.daysOfAttendance.split(';');
  }

  public isDisabled(daysSelected: Set<string>): boolean {
    if (this.isSelected) {
      return false;
    }

    for (const d of daysSelected) {
      if (this.daysArray.includes(d)) {
        return true;
      }
    }

    return false;
  }

  get artsAreaList(): Array<string> {
    return this.artsArea.split(';');
  }
}
