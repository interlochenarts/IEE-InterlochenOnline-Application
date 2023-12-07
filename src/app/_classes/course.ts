import {Program} from "./program";

export class Course {
  id: string;
  name: string;

  public static createFromNestedJson(json: any): Course {
    const course = new Course();
    Object.assign(course, json);

    return course;
  }
}
