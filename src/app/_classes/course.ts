import {Program} from "./program";

export class Course {
  id: string;
  name: string;
  displayOrder: number;
  programsByDivision: Map<string, Array<Program>>;
  selectedSessionDates: string;
  ioRegistrationFee: number;


  public static createFromNestedJson(json: any): Course {
    const course = new Course();
    Object.assign(course, json);

    let keys = Object.keys(json.programsByDivision);
    course.programsByDivision = new Map<string, Array<Program>>();

    keys.forEach(k => {
      course.programsByDivision.set(k, json.programsByDivision[k].map((p: any) => Program.createFromNestedJson(p)));
    });

    return course;
  }

  getProgramsByDivision(division: string): Array<Program> {
    // console.log('division', division);
    let programs: Array<Program> = this.programsByDivision.get(division);
    if (this.displayOrder === 1) {
      // remove the sessionless (stub) program from the list
      programs = programs.filter(p => p.sessionId);
    }
    // console.log(this.programsByDivision);
    if (programs) {
      programs.sort(Program.sortBySessionStartNullsFirst);
    }

    return programs || [];
  }
}
