import {Component, Input, OnInit} from '@angular/core';
import {Parent} from '../../../../_classes/parent';

@Component({
  selector: 'iee-parent-review',
  templateUrl: './parent-review.component.html',
  styleUrls: ['./parent-review.component.less']
})
export class ParentReviewComponent implements OnInit {
  @Input() parents: Array<Parent>;

  constructor() { }

  ngOnInit(): void {
  }

}
