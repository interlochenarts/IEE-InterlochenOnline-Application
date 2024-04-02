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
  /**
   * List of Program/Major ids
   */
  bundleChoices: Array<string> = [];
  appChoiceIds: Array<string> = [];

  public static createFromNestedJson(json: any): CertificateGroup {
    const certificateGroup: CertificateGroup = new CertificateGroup();
    Object.assign(certificateGroup, json);

    certificateGroup.courses = json.courses?.map((c: any) => Course.createFromNestedJson(c));

    return certificateGroup;
  }

  getSelectedProgramsByAgeGroup(ageGroup: string): Program[] {
    const selected: Program[] = [];
    this.bundleChoices.forEach(bc => {
      this.courses.forEach(c => {
        const program = c.getProgramsByDivision(ageGroup).find(p => p.id === bc);
        if (program) {
          selected.push(program);
        }
      });
    });
    return selected.sort(Program.sortBySessionStartNullsLast);
  }

  getAllSelectedPrograms(): Program[] {
    const selected: Program[] = [];
    this.bundleChoices.forEach(bc => {
      this.courses.forEach(c => {
        for (const [key, programs ] of c.programsByDivision.entries()) {
          console.info('key', key);
          const program = programs.find(p => p.id === bc);
          if (program) {
            selected.push(program);
          }
        }
      });
    });
    console.dir(selected);
    return selected.sort(Program.sortBySessionStartNullsLast);
  }
}
