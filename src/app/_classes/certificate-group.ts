import {Course} from "./course";

export class CertificateGroup {
  id: string;
  name: string;
  discount: number;
  courses: Array<Course>;
  isSelected: boolean;
  isSaving: boolean;
  bundleSize: number;
  appChoiceIds: Array<string> = [];

  public static createFromNestedJson(json: any): CertificateGroup {
    const certificateGroup: CertificateGroup = new CertificateGroup();
    Object.assign(certificateGroup, json);

    certificateGroup.courses = json.courses?.map((c: any) => Course.createFromNestedJson(c));
    certificateGroup.courses.sort((a, b) => a.displayOrder - b.displayOrder);

    return certificateGroup;
  }
}
