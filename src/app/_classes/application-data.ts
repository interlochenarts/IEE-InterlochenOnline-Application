import {Student} from './student';
import {Parent} from './parent';
import {Program} from './program';
import {Payment} from './payment';
import {EnrollmentAgreement} from './enrollment-agreement';
import {Address} from './address';

export class ApplicationData {
  student: Student;
  parents: Array<Parent>;
  programs: Array<Program>;
  enrollmentAgreement: EnrollmentAgreement;
  payment: Payment;
  isComplete: boolean;

  constructor() {
    this.student = new Student();
    this.student.mailingAddress = new Address();
    this.parents = [];
    this.parents.push(new Parent());
    this.parents[0].mailingAddress = new Address();
    this.programs = [];
    this.programs.push(new Program());
    this.enrollmentAgreement = new EnrollmentAgreement();
    this.payment = new Payment();

    this.isComplete = false;
  }

  public static createFromNestedJson(json: any): ApplicationData {
    const appData = new ApplicationData();
    Object.assign(appData, json);

    appData.student = Student.createFromNestedJson(json.student);
    console.log(json.parents);
    appData.parents = json.parents.map(p => Parent.createFromNestedJson(p));
    appData.programs = new Array<Program>();
    appData.enrollmentAgreement = new EnrollmentAgreement();
    appData.payment = new Payment();

    return appData;
  }
}
