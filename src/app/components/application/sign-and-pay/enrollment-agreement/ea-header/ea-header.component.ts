import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {Program} from '../../../../../_classes/program';

@Component({
  selector: 'iee-ea-header',
  templateUrl: './ea-header.component.html',
  styleUrls: ['./ea-header.component.less']
})
export class EaHeaderComponent implements OnInit {
  @Input() programs: Array<Program>;

  constructor() { }

  ngOnInit(): void {
    // console.dir(this.programs);
  }
}
