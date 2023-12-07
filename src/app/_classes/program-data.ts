import {Program} from './program';
import {CertificateGroup} from "./certificate-group";

export class ProgramData {
  divisions: Map<string, string>;
  programs: Array<Program>;
  sessions: Array<string>;
  sessionDates: Map<string, string>;
  selectedDivision: string;
  gradeInSchool: string;
  certificateGroups: Array<CertificateGroup>;

  constructor() {
    this.programs = new Array<Program>();
    this.divisions = new Map<string, string>();
    this.sessions = new Array<string>();
    this.sessionDates = new Map<string, string>();
    this.certificateGroups = new Array<CertificateGroup>();
  }

  public static createFromNestedJson(json: any): ProgramData {
    const programData = new ProgramData();
    Object.assign(programData, json);

    programData.programs = json.programs.map((p: any) => Program.createFromNestedJson(p));
    programData.divisions = new Map(Object.entries(json.divisions));
    programData.sessionDates = new Map(Object.entries(json.sessionDates));
    programData.certificateGroups = json.certificateGroups?.map((cg: CertificateGroup) => CertificateGroup.createFromNestedJson(cg));

    return programData;
  }

  get divisionGradeMap(): Map<number, string> {
    const map = new Map<number, string>();

    for (const key of this.divisions.keys()) {
      const divisionName = this.divisions.get(key);
      const numbers: RegExpMatchArray = divisionName.match(/\d+/g);
      for (let i = parseInt(numbers[0], 10); i <= parseInt(numbers[1], 10); i++) {
        map.set(i, key);
      }
    }

    return map;
  }
}
