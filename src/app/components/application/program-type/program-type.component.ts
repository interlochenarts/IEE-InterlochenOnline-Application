import {Component, OnInit} from '@angular/core';
import {AppDataService} from "../../../services/app-data.service";
import {ApplicationData} from "../../../_classes/application-data";
import {SalesforceOption} from "../../../_classes/salesforce-option";
import {NgbAccordionDirective} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'iee-program-type',
  templateUrl: './program-type.component.html',
  styleUrls: ['./program-type.component.less']
})
export class ProgramTypeComponent implements OnInit {
  isLoading: boolean = true;
  appData: ApplicationData;
  appDataTime: number = 0;
  _selectedDivision: string;
  divisionOptions: Array<SalesforceOption>;

  get selectedDivision(): string {
    if (!this._selectedDivision) {
      this._selectedDivision = this.appData?.ageGroup;
    }

    // console.log('selectedDivision', this._selectedDivision, 'appData.division', this.appData?.programData?.selectedDivision);
    return this._selectedDivision;
  }

  set selectedDivision(value) {
    this._selectedDivision = value;
    this.appData.ageGroup = value;
    this.appDataService.applicationData.next(this.appData);
  }

  constructor(private appDataService: AppDataService) {
  }

  saveAgeGroup(): void {
    this.appDataService.reviewCompleted.next(false);
    this.appDataService.saveAgeGroup(this.selectedDivision);
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        console.info('program-type updating app data');
        this.appData = app;

        // // pre-check boxes for app choices in the main program list
        // this.appData.acProgramData.programs.forEach(acp => {
        //   if (acp.sessionId) { // ignore stub programs for IO bundles
        //     this.appData.programData.programs.find(p => p.id === acp.id).isSelected = true;
        //   }
        // });
        //
        // // pre-check boxes for app choices in the main private lesson list
        // this.appData.acProgramData.privateLessons.forEach(acp => {
        //   if (!acp.artsAreaList.includes('Music')) {
        //     this.appData.programData.privateLessons.find(p => p.id === acp.id).isSelected = true;
        //   }
        // });

        this.divisionOptions = [];
        for (const [value, label] of this.appData.programData.divisions.entries()) {
          this.divisionOptions.push(new SalesforceOption(label, value, false));
        }

        this.isLoading = false;
        this.appDataTime = new Date().getTime();
      } else {
        this.appData = new ApplicationData();
      }
    });
  }

  changeType(typeAccordion: HTMLDivElement) {
    const scrollOffset = typeAccordion.offsetTop;

    if(window.scrollY > scrollOffset) {
      console.info(`scrolling to ${scrollOffset} from ${window.scrollY}`);
      window.scroll({
        top: scrollOffset,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}
