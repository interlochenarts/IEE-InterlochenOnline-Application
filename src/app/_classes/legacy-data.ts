export class LegacyData {
  name: string;
  value: string;
  sfFieldName: string;
  readOnly: boolean;

  public static createFromJson(json: any): LegacyData {
    const data = new LegacyData();
    Object.assign(data, json);
    return data;
  }
}
