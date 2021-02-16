import {Component, OnInit} from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {Program} from '../../../_classes/program';
import {SalesforceOption} from '../../../_classes/salesforce-option';

declare const Visualforce: any;

@Component({
  selector: 'iee-program-info',
  templateUrl: './program-info.component.html',
  styleUrls: ['./program-info.component.css']
})
export class ProgramInfoComponent implements OnInit {
  appData: ApplicationData;
  anyProgramUpdating = false;
  daysSelected: Set<string> = new Set<string>();
  selectedArtsArea = '';

  // hardcode because salesforce is dumb and we can't pull picklist values based on record type
  gradeInSchoolOptions: Array<SalesforceOption> = [
    new SalesforceOption('2nd', '2nd', false),
    new SalesforceOption('3rd', '3rd', false),
    new SalesforceOption('4th', '4th', false),
    new SalesforceOption('5th', '5th', false),
    new SalesforceOption('6th', '6th', false),
    new SalesforceOption('7th', '7th', false),
    new SalesforceOption('8th', '8th', false),
    new SalesforceOption('9th', '9th', false),
    new SalesforceOption('10th', '10th', false),
    new SalesforceOption('11th', '11th', false),
    new SalesforceOption('12th', '12th', false),
  ];

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.appDataService.applicationData.asObservable().subscribe(app => {
      if (app) {
        this.appData = app;

        this.appData.programData.programs.forEach(p => {
          if (p.isSelected) {
            p.daysArray.forEach(d => {
              this.daysSelected.add(d);
            });
          }
        });

      } else {
        this.appData = new ApplicationData();
      }
    });

  }

  get sortedDivisions(): Array<SalesforceOption> {
    const divisions = Array<SalesforceOption>();
    for (const k of this.appData.programData.divisions.keys()) {
      const opt = new SalesforceOption(this.appData.programData.divisions.get(k), k, false);
      divisions.push(opt);
    }

    divisions.sort((a, b) => {
      const firstNumA = +a.label[a.label.search(/\d/)];
      const firstNumB = +a.label[b.label.search(/\d/)];

      return firstNumA - firstNumB;
    });

    return divisions;
  }

  get filteredPrograms(): Array<Program> {
    return this.appData.programData.programs.filter(p =>
      (p.division === this.appData.programData.selectedDivision) &&
      (this.selectedArtsArea ? p.artsArea === this.selectedArtsArea : true));
  }

  get filteredArtsAreas(): Array<SalesforceOption> {
    this.selectedArtsArea = '';
    const artsAreaSet: Set<string> = new Set<string>();
    this.filteredPrograms.forEach(p => {
      artsAreaSet.add(p.artsArea);
    });

    const sortedArtsAreas = Array.from(artsAreaSet).sort().map(aa => new SalesforceOption(aa, aa, false));
    sortedArtsAreas.unshift(new SalesforceOption('All', '', true));

    return sortedArtsAreas;
  }

  updateSelectedDivision(): void {
    const grade = this.appData.programData.gradeInSchool;
    const gradeNumber = grade.match(/\d+/);
    this.appData.programData.selectedDivision = this.appData.programData.divisionGradeMap.get(+gradeNumber);
  }

  clickProgram(program: Program): void {
    if (!program.isDisabled(this.daysSelected)) {
      if (!program.isSelected) {
        program.isSelected = true;
        program.daysArray.forEach(d => {
          this.daysSelected.add(d);
        });

        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.addAppChoice',
          this.appData.appId, program.id, program.sessionId,
          result => {
            if (result.toString().startsWith('ERR')) {
              console.error(result);
            } else {
              console.log('Saved new program: ' + result);
              program.appChoiceId = result;
            }
          },
          {buffer: false, escape: false}
        );

      } else {
        program.isSelected = false;
        program.daysArray.forEach(d => {
          this.daysSelected.delete(d);
        });

        Visualforce.remoting.Manager.invokeAction(
          'IEE_OnlineApplicationController.removeAppChoice',
          this.appData.appId, program.appChoiceId,
          result => {
            console.log(result);
          },
          {buffer: false, escape: false}
        );
      }
    }
  }
}
