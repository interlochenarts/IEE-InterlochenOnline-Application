import {Program} from './program';

export class ProgramData {
  divisions: Array<string>;
  programs: Array<Program>;
  selectedDivision: string;

  constructor() {
    this.programs = new Array<Program>();
    this.divisions = [];
  }

  public static createFromNestedJson(json: any): ProgramData {
    const programData = new ProgramData();
    Object.assign(programData, json);

    programData.programs = json.programs.map(p => Program.createFromNestedJson(p));
    programData.divisions = programData.divisions.reverse();

    return programData;
  }
}
