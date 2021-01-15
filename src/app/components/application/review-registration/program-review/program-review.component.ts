import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ProgramData} from '../../../../_classes/program-data';
import {Program} from '../../../../_classes/program';

@Component({
  selector: 'iee-program-review',
  templateUrl: './program-review.component.html',
  styleUrls: ['./program-review.component.less']
})
export class ProgramReviewComponent implements OnInit, OnChanges {
  @Input() programData: ProgramData = new ProgramData();
  selectedPrograms: Array<Program>;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    this.selectedPrograms = this.programData?.programs.filter(p => p.isSelected);
  }

}
