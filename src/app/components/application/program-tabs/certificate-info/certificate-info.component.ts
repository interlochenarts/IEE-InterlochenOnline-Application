import { Component } from '@angular/core';
import {ApplicationData} from "../../../../_classes/application-data";
import {AppDataService} from "../../../../services/app-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from "../../../../_classes/program";
import {CertificateGroup} from "../../../../_classes/certificate-group";

declare const Visualforce: any;

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

  clickCertificate(group: CertificateGroup, modal: any) {
    this.selectedGroup = group;
    this.modalService.open(modal)
  }
}
