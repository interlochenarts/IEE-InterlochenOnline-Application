import {Course} from "./course";
import {Program} from './program';

export class CertificateGroup {
  id: string;
  name: string;
  discount: number;
  courses: Array<Course>;
  isSelected: boolean;
  isSaving: boolean;
  bundleSize: number;
  bundleChoices: Array<string> = [];
  appChoiceIds: Array<string> = [];

  public static createFromNestedJson(json: any): CertificateGroup {
    const certificateGroup: CertificateGroup = new CertificateGroup();
    Object.assign(certificateGroup, json);

    certificateGroup.courses = json.courses?.map((c: any) => Course.createFromNestedJson(c));

    return certificateGroup;
  }

  selectedPrograms(selectedDivision: string): Program[] {
    const selected: Program[] = [];
    this.bundleChoices.forEach(bc => {
      this.courses.forEach(c => {
        const program = c.getProgramsByDivision(selectedDivision).find(p => p.id === bc);
        if (program) {
          selected.push(program);
        }
      });
    });
    return selected.sort(Program.sortBySessionStartNullsLast);
  }
}
