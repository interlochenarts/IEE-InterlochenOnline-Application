import {Program} from "./program";

export class Course {
  id: string;
  name: string;
  displayOrder: number;
  programsByDivision: Map<string, Array<Program>>;
  selectedSessionDates: string;


  public static createFromNestedJson(json: any): Course {
    const course = new Course();
    Object.assign(course, json);

    let keys = Object.keys(json.programsByDivision);
    course.programsByDivision = new Map<string, Array<Program>>();

    keys.forEach(k => {
      course.programsByDivision.set(k, json.programsByDivision[k].map(p => Program.createFromNestedJson(p)));
    });

    return course;
  }

  getProgramsByDivision(division: string): Array<Program> {
    return this.programsByDivision.get(division);
  }
}
