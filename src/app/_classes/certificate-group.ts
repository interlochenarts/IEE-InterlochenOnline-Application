import {Program} from "./program";

export class CertificateGroup {
  id: string;
  name: string;
  discount: number;
  courses: Array<Program>;
  isSelected: boolean;
  isSaving: boolean;

  public static createFromNestedJson(json: any): CertificateGroup {
    const certificateGroup = new CertificateGroup();
    Object.assign(certificateGroup, json);

    certificateGroup.courses = json.programs?.map((p: any) => Program.createFromNestedJson(p));

    return certificateGroup;
  }
}
