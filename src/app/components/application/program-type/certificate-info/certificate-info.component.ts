import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {ApplicationData} from "../../../../_classes/application-data";
import {AppDataService} from "../../../../services/app-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from "../../../../_classes/program";
import {CertificateGroup} from "../../../../_classes/certificate-group";

@Component({
  selector: 'iee-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['../program-type.component.less', 'certificate-info.component.less']
})
export class CertificateInfoComponent implements OnInit, OnChanges {
  @Input() appDataTime: number = 0;
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>> = new Map<string, Set<string>>();
  selectedGroup: CertificateGroup;

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appData = this.appDataService.applicationData.getValue();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.appDataTime) {
      this.appData = this.appDataService.applicationData.getValue();
    }
  }

  private addDaysSelected(p: Program): void {
    p.daysArrayApi?.forEach(d => {
      const daysSelected: Set<string> = this.daysSelectedBySession.get(p.sessionName) || new Set<string>();
      if (p.allowsConflicts === false) {
        daysSelected.add(d);
      }
      this.daysSelectedBySession.set(p.sessionName, daysSelected);
    });
  }

  addOrEditCertificate(group: CertificateGroup, modal: any) {
    this.selectedGroup = group;
    const modalRef = this.modalService.open(modal, {size: 'lg'});

    modalRef.closed.subscribe(programIds => {
      this.appDataService.saveBundle(this.selectedGroup, programIds);
    });
  }

  removeCertificate(group: CertificateGroup) {
    this.appDataService.removeBundle(group);
  }
}
