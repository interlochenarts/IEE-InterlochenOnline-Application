import {Program} from './program';

export class ProgramData {
  divisions: Map<string, string>;
  programs: Array<Program>;
  selectedDivision: string;

  constructor() {
    this.programs = new Array<Program>();
    this.divisions = new Map<string, string>();
  }

  public static createFromNestedJson(json: any): ProgramData {
    const programData = new ProgramData();
    Object.assign(programData, json);

    programData.programs = json.programs.map(p => Program.createFromNestedJson(p));
    programData.divisions = new Map(Object.entries(json.divisions));

    return programData;
  }
}
