import {Component, Input, OnInit} from '@angular/core';
import {Parent} from '../../../../_classes/parent';
import {RouterLink} from '../../../../_classes/router-link';

@Component({
  selector: 'iee-parent-review',
  templateUrl: './parent-review.component.html',
  styleUrls: ['./parent-review.component.less']
})
export class ParentReviewComponent implements OnInit {
  @Input() parents: Array<Parent>;
  @Input() link: RouterLink;

  constructor() { }

  ngOnInit(): void {
  }

}
