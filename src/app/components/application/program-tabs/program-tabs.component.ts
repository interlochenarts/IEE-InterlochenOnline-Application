import {Component, OnInit} from '@angular/core';
import {AppDataService} from "../../../services/app-data.service";
import {ApplicationData} from "../../../_classes/application-data";
import {SalesforceOption} from "../../../_classes/salesforce-option";

@Component({
  selector: 'iee-program-tabs',
  templateUrl: './program-tabs.component.html',
  styleUrls: ['./program-tabs.component.less']
})
export class ProgramTabsComponent implements OnInit {
  isLoading: boolean = true;
  appData: ApplicationData;
  _selectedDivision: string;
  divisionOptions: Array<SalesforceOption>;

  get selectedDivision(): string {
    if (!this._selectedDivision) {
      if (this.appData?.isAdultApplicant) {
        this._selectedDivision = 'Adult';
        this.appData.programData.selectedDivision = 'Adult';
      }
    }

    return this._selectedDivision;
  }

  set selectedDivision(value) {
    this._selectedDivision = value;
    this.appData.programData.selectedDivision = value;
  }

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;

        // pre-check boxes for app choices in the main program list
        this.appData.acProgramData.programs.forEach(acp => {
          if (acp.sessionId) { // ignore stub programs for IO bundles
            this.appData.programData.programs.find(p => p.id === acp.id).isSelected = true;
          }
        });

        // pre-check boxes for app choices in the main private lesson list
        this.appData.acProgramData.privateLessons.forEach(acp => {
          if (!acp.artsAreaList.includes('Music')) {
            this.appData.programData.privateLessons.find(p => p.id === acp.id).isSelected = true;
          }
        });

        this.divisionOptions = this.appData.divisions.map(d => new SalesforceOption(d, d, false));

        this.isLoading = false;
      } else {
        this.appData = new ApplicationData();
      }
    });
  }
}
