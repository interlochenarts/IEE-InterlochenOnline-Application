import {Program} from "./program";
import {Course} from "./course";

export class CertificateGroup {
  id: string;
  name: string;
  discount: number;
  courses: Array<Course>;
  isSelected: boolean;
  isSaving: boolean;
  // INFO: bundle size is hardcoded for now, but this should be stored on the CertificateGroup record if it's ever not 3
  bundleSize: number = 3;
  appChoiceIds: Array<string> = [];

  public static createFromNestedJson(json: any): CertificateGroup {
    const certificateGroup = new CertificateGroup();
    Object.assign(certificateGroup, json);

    certificateGroup.courses = json.courses?.map((c: any) => Course.createFromNestedJson(c));
    certificateGroup.courses.sort((a, b) => a.displayOrder - b.displayOrder);

    return certificateGroup;
  }
}
