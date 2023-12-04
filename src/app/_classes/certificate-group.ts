import {Program} from "./program";

export class CertificateGroup {
  id: string;
  name: string;
  discount: number;
  programs: Array<Program>;

  public static createFromNestedJson(json: any): CertificateGroup {
    const certificateGroup = new CertificateGroup();
    Object.assign(certificateGroup, json);

    certificateGroup.programs = json.programs.map((p: any) => Program.createFromNestedJson(p));

    return certificateGroup;
  }
}
