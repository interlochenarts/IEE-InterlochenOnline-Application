import {Component, OnInit} from '@angular/core';
import {AppDataService} from "../../../services/app-data.service";
import {ApplicationData} from "../../../_classes/application-data";
import {SalesforceOption} from "../../../_classes/salesforce-option";

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

  get selectedCoursesText(): string {
    const courseCount = this.appData.acProgramData.programs.filter(p => p.isSelected && !p.certificateGroupId).length;
    if (courseCount > 0) {
      return `${courseCount} Selected`;
    }

    // return empty string if no courses
    return '';
  }

  get selectedCertificatesText(): string {
    const certCount = this.appData.programData.certificateGroups.filter(cg => cg.isSelected).length;
    if (certCount > 0) {
      return `${certCount} Selected`;
    }

    // return empty string if no certs
    return '';
  }

  get hasCertError(): boolean {
    let hasError = false;
    this.appData.programData.selectedCertificates.forEach(cert => {
      cert.getAllSelectedPrograms().forEach(program => {
        hasError = hasError || (program.sessionId && (!program.isSessionActive || !program.isActive));
      });
    });

    return hasError;
  }

  get selectedLessonsText(): string {
    const lessonCount = this.appData.acProgramData.privateLessons.filter(pl => pl.isSelected || (pl.isRegistered && pl.lessonCountAdd > 0)).length;
    if (lessonCount > 0) {
      return `${lessonCount} Selected`;
    }

    // return empty string if no lessons
    return '';
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
    typeAccordion.scrollIntoView({behavior: 'instant', block: 'start', inline: 'nearest'});
  }
}
