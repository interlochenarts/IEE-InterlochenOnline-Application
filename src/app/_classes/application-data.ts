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
  acProgramData: ProgramData;
  enrollmentAgreement: EnrollmentAgreement;
  payment: Payment;
  termId: string;
  termName: string;
  appId: string;
  appName: string;
  appStatus: string;
  isRegistered: boolean;
  isCancelOrWithdrawn: boolean;
  isAdultApplicant: boolean;
  divisions: Array<string>;

  constructor() {
    this.student = new Student();
    this.student.mailingAddress = new Address();
    this.parents = [];
    this.parents.push(new Parent());
    this.parents[0].mailingAddress = new Address();
    this.programData = new ProgramData();
    this.acProgramData = new ProgramData();
    this.enrollmentAgreement = new EnrollmentAgreement();
    this.payment = new Payment();
  }

  public static createFromNestedJson(json: any): ApplicationData {
    const appData = new ApplicationData();
    Object.assign(appData, json);

    appData.student = Student.createFromNestedJson(json.student);
    appData.parents = json.parents.map((p: Parent) => Parent.createFromNestedJson(p));
    appData.programData = ProgramData.createFromNestedJson(json.programData);
    appData.acProgramData = ProgramData.createFromNestedJson(json.acProgramData);
    appData.enrollmentAgreement = new EnrollmentAgreement();
    appData.payment = Payment.createFromNestedJson(json.payment);
    appData.isRegistered = appData.appStatus === 'Registered';
    appData.isCancelOrWithdrawn = appData.appStatus === 'Application Withdrawn by Applicant' || appData.appStatus === 'Cancel';

    return appData;
  }

  public isComplete(countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    return this.studentInfoIsComplete(countryCodes, stateCodes) && this.hasPrograms();
  }

  private hasPrograms(): boolean {
    let hasProgram = false;

    // check individual courses
    if (this.acProgramData.programs.filter(p => p.isSelected).length > 0) {
      hasProgram = true;
    }

    // check certificate programs
    if (!hasProgram && this.acProgramData.selectedCertificates.length > 0) {
      hasProgram = true;
    }

    // check private lessons
    if (!hasProgram && this.acProgramData.privateLessons.filter(pl => pl.isSelected).length > 0) {
      hasProgram = true;
    }

    return hasProgram;
  }

  //this does not include program
  public studentInfoIsComplete(countryCodes: Array<CountryCode>, stateCodes: Array<StateCode>): boolean {
    return this.student.isComplete(countryCodes, stateCodes) &&
      (this.isAdultApplicant || (this.parents.length > 0 &&
        this.parents.reduce((complete: boolean, parent: Parent) => complete && parent.isComplete(countryCodes, stateCodes), true) &&
        this.parents.reduce((verified: boolean, parent: Parent) => verified || parent.isVerified, false)));
  }
}
