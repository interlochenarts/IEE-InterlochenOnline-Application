import { Component } from '@angular/core';
import {ApplicationData} from "../../../../_classes/application-data";
import {AppDataService} from "../../../../services/app-data.service";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {Program} from "../../../../_classes/program";

declare const Visualforce: any;

@Component({
  selector: 'iee-bundle-info',
  templateUrl: './bundle-info.component.html',
  styleUrls: ['./bundle-info.component.less']
})
export class BundleInfoComponent {
  isLoading: boolean = true;
  appData: ApplicationData;
  daysSelectedBySession: Map<string, Set<string>> = new Map<string, Set<string>>();

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
}
