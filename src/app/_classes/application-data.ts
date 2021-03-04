import {Student} from './student';
import {Parent} from './parent';
import {Payment} from './payment';
import {EnrollmentAgreement} from './enrollment-agreement';
import {Address} from './address';
import {ProgramData} from './program-data';
import {CountryCode} from './country-code';
import {StateCode} from './state-code';

export class ApplicationData {
  student: Student;
  parents: Array<Parent>;
  programData: ProgramData;
  enrollmentAgreement: EnrollmentAgreement;
  payment: Payment;
  termId: string;
  termName: string;
  appId: string;
  appName: string;

  constructor() {
    this.student = new Student();
    this.student.mailingAddress = new Address();
    this.parents = [];
    this.parents.push(new Parent());
    this.parents[0].mailingAddress = new Address();
    this.programData = new ProgramData();
    this.enrollmentAgreement = new EnrollmentAgreement();
    this.payment = new Payment();
  }

  public static createFromNestedJson(json: any): ApplicationData {
    const appData = new ApplicationData();
    Object.assign(appData, json);

    appData.student = Student.createFromNestedJson(json.student);
    appData.parents = json.parents.map(p => Parent.createFromNestedJson(p));
    appData.programData = ProgramData.createFromNestedJson(json.programData);
    appData.enrollmentAgreement = new EnrollmentAgreement();
    appData.payment = Payment.createFromNestedJson(json.payment);

    return appData;
  }

  public isComplete(countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    return this.student.isComplete(countryCodes, stateCodes) &&
      this.parents.length > 0 &&
      this.parents.reduce((complete: boolean, parent: Parent) => complete && parent.isComplete(countryCodes, stateCodes), true) &&
      this.parents.reduce((verified: boolean, parent: Parent) => verified || parent.isVerified, false) &&
      this.programData.programs.filter(p => p.isSelected).length > 0;
  }
}
