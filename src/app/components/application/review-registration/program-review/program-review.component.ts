import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ProgramData} from '../../../../_classes/program-data';
import {Program} from '../../../../_classes/program';
import {RouterLink} from '../../../../_classes/router-link';

@Component({
  selector: 'iee-program-review',
  templateUrl: './program-review.component.html',
  styleUrls: ['./program-review.component.less']
})
export class ProgramReviewComponent implements OnInit, OnChanges {
  @Input() programData: ProgramData = new ProgramData();
  @Input() link: RouterLink;
  @Input() isRegistered: boolean;
  selectedPrograms: Array<Program>;
  registeredPrograms: Array<Program>;

  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    // Only unregistered programs
    this.selectedPrograms = this.programData?.programs.filter(p => (p.isSelected && !p.isRegistered) || (p.isSelected && p.isRegistered && p.lessonCountAdd > 0));
    // Sort by Session Date, sessionDates comes in like SessionName: MM-DD-YYYY - MM-DD-YYYY
    this.selectedPrograms.sort((a, b) =>
      new Date(a.sessionDates.split(':')[1].split('-')[0].trim()).getTime() -
      new Date(b.sessionDates.split(':')[1].split('-')[0].trim()).getTime());
    // Only registered programs
    this.registeredPrograms = this.programData?.programs.filter(p => p.isSelected && p.isRegistered && (!p.lessonCountAdd || p.lessonCountAdd === 0));
    // Sort by Session Date, sessionDates comes in like SessionName: MM-DD-YYYY - MM-DD-YYYY
    this.registeredPrograms.sort(Program.sort);
  }

}
