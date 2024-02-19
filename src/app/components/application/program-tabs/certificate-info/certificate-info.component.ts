import {Component} from '@angular/core';
import {ApplicationData} from "../../../../_classes/application-data";
import {AppDataService} from "../../../../services/app-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from "../../../../_classes/program";
import {CertificateGroup} from "../../../../_classes/certificate-group";

@Component({
  selector: 'iee-certificate-info',
  templateUrl: './certificate-info.component.html',
  styleUrls: ['../program-tabs.component.less', 'certificate-info.component.less']
})
export class CertificateInfoComponent {
  isLoading: boolean = true;
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>> = new Map<string, Set<string>>();
  selectedGroup: CertificateGroup;

  constructor(private appDataService: AppDataService, private modalService: NgbModal) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;

        this.appData.acProgramData.programs.forEach(p => {
          if (p.isSelected) {
            this.addDaysSelected(p);
          }
        });

        console.dir(this.appData.programData.certificateGroups);

        this.isLoading = false;
      } else {
        this.appData = new ApplicationData();
      }
    });
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
      console.log(programIds);
      this.selectedGroup.isSaving = true;
      this.appDataService.saveBundle(this.selectedGroup, programIds);
    })
  }

  removeCertificate(group: CertificateGroup) {

  }
}
