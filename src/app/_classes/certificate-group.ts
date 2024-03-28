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
    certificateGroup.courses.sort((a, b) => a.displayOrder - b.displayOrder);

    return certificateGroup;
  }

  selectedPrograms(selectedDivision: string): Program[] {
    const selected: Program[] = [];
    this.bundleChoices.forEach(bc => {
      this.courses.forEach(c =>
        selected.push(c.getProgramsByDivision(selectedDivision).find(p => p.id === bc)));
    });
    return selected.sort(Program.sort);
  }
}
