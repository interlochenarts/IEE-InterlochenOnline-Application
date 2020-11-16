import {Student} from './student';
import {Parent} from './parent';
import {Program} from './program';
import {Portfolio} from './portfolio';

export class ApplicationData {
  student: Student;
  parent: Parent;
  program: Program;
  portfolio: Portfolio;
  isComplete: boolean;
}
