import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {ProgramData} from '../../../../_classes/program-data';
import {Program} from '../../../../_classes/program';
import {RouterLink} from '../../../../_classes/router-link';
import {CertificateGroup} from '../../../../_classes/certificate-group';
import {ApplicationData} from '../../../../_classes/application-data';
import {AppDataService} from '../../../../services/app-data.service';

@Component({
  selector: 'iee-program-review',
  templateUrl: './program-review.component.html',
  styleUrls: ['./program-review.component.less']
})
export class ProgramReviewComponent implements OnInit, OnChanges {
  @Input() appData: ApplicationData = new ApplicationData();
  @Input() link: RouterLink;
  @Input() isRegistered: boolean;

  selectedPrograms: Array<Program>;
  selectedPrivateLessons: Array<Program>;
  selectedCertificates: Array<CertificateGroup>;
  registeredPrograms: Array<Program>;
  transactionId = '';
  paymentReceived = false;

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {

    this.appDataService.transactionId.asObservable().subscribe(trxId => {
      if (trxId) {
        this.transactionId = trxId;
      }
    });

    this.appDataService.paymentReceived.asObservable().subscribe(x => {
      this.paymentReceived = x;
    });
  }

  get programComplete() {
    return (this.paymentReceived && !!this.transactionId) || this.appData.hasPrograms();
  }

  ngOnChanges(): void {
    // Only unregistered programs
    this.selectedPrograms = this.appData.acProgramData?.programs.filter(p => p.isSelected && !p.isRegistered && !p.certificateGroupId && p.sessionDates).sort(Program.sortBySessionStartNullsFirst);
    // Only registered programs
    this.registeredPrograms = this.appData.acProgramData?.programs.filter(p => p.isSelected && p.isRegistered && (!p.lessonCountAdd || p.lessonCountAdd === 0)).sort(Program.sortBySessionStartNullsFirst);

    this.selectedPrivateLessons = this.appData.acProgramData.privateLessons.filter(pl => pl.isSelected || (pl.isRegistered && pl.lessonCountAdd > 0));
    this.selectedCertificates = this.appData.programData.selectedCertificates;
  }

  get showError(): boolean {
    let missingProgram = true;

    // check individual courses
    if (this.selectedPrograms && this.selectedPrograms.length > 0) {
      missingProgram = false;
    }

    // check certificate programs
    if (missingProgram && this.selectedCertificates && this.selectedCertificates.length > 0) {
      missingProgram = false;
    }

    // check private lessons
    if (missingProgram && this.selectedPrivateLessons && this.selectedPrivateLessons.length > 0) {
      missingProgram = false;
    }

    return missingProgram;
  }

  protected readonly Program = Program;
}
