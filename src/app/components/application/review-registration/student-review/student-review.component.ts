import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../../../../_classes/student';
import {RouterLink} from '../../../../_classes/router-link';

@Component({
  selector: 'iee-student-review',
  templateUrl: './student-review.component.html',
  styleUrls: ['./student-review.component.less']
})
export class StudentReviewComponent implements OnInit {
  @Input() student: Student;
  @Input() link: RouterLink;

  constructor() { }

  ngOnInit(): void {
  }
}
