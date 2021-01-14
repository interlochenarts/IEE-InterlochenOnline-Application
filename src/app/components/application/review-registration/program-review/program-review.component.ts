import {Component, Input, OnInit} from '@angular/core';
import {ProgramData} from '../../../../_classes/program-data';

@Component({
  selector: 'iee-program-review',
  templateUrl: './program-review.component.html',
  styleUrls: ['./program-review.component.less']
})
export class ProgramReviewComponent implements OnInit {
  @Input() programData: ProgramData;

  constructor() { }

  ngOnInit(): void {
  }

}
