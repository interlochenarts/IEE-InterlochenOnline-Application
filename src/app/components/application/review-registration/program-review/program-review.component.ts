import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ProgramData} from '../../../../_classes/program-data';
import {Program} from '../../../../_classes/program';
import {RouterLink} from '../../../../_classes/router-link';
import {CertificateGroup} from '../../../../_classes/certificate-group';

@Component({
  selector: 'iee-program-review',
  templateUrl: './program-review.component.html',
  styleUrls: ['./program-review.component.less']
})
export class ProgramReviewComponent implements OnInit, OnChanges {
  @Input() programData: ProgramData = new ProgramData();
  @Input() acProgramData: ProgramData = new ProgramData();
  @Input() link: RouterLink;
  @Input() isRegistered: boolean;
  selectedPrograms: Array<Program>;
  selectedPrivateLessons: Array<Program>;
  selectedCertificates: Array<CertificateGroup>;
  registeredPrograms: Array<Program>;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(): void {
    // Only unregistered programs
    this.selectedPrograms = this.acProgramData?.programs.filter(p => p.isSelected && !p.isRegistered && !p.certificateGroupId && p.sessionDates).sort(Program.sort);
    console.dir(this.selectedPrograms);
    // Only registered programs
    this.registeredPrograms = this.acProgramData?.programs.filter(p => p.isSelected && p.isRegistered && (!p.lessonCountAdd || p.lessonCountAdd === 0));
    // Sort by Session Date, sessionDates comes in like SessionName: MM-DD-YYYY - MM-DD-YYYY
    this.registeredPrograms.sort(Program.sort);

    this.selectedPrivateLessons = this.acProgramData.privateLessons.filter(pl => pl.isSelected);
    this.selectedCertificates = this.programData.selectedCertificates;
  }

}
