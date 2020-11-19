import {Student} from './student';
import {Parent} from './parent';
import {Program} from './program';
import {Payment} from './payment';
import {EnrollmentAgreement} from './enrollment-agreement';

export class ApplicationData {
  student: Student;
  parents: Parent[];
  program: Program;
  enrollmentAgreement: EnrollmentAgreement;
  payment: Payment;
  isComplete: boolean;
}
