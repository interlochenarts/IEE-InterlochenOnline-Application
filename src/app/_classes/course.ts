import {Program} from "./program";

export class Course {
  id: string;
  name: string;
  displayOrder: number;

  public static createFromNestedJson(json: any): Course {
    const course = new Course();
    Object.assign(course, json);

    return course;
  }
}
