import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../../../../_classes/student';

@Component({
  selector: 'iee-student-review',
  templateUrl: './student-review.component.html',
  styleUrls: ['./student-review.component.less']
})
export class StudentReviewComponent implements OnInit {
  @Input() student: Student;

  constructor() { }

  ngOnInit(): void {
  }
}
