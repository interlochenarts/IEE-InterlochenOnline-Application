import {Component, OnInit} from '@angular/core';
import {ApplicationData} from '../../../_classes/application-data';
import {AppDataService} from '../../../services/app-data.service';
import {ProgramData} from '../../../_classes/program-data';
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
      const opt = new SalesforceOption();
      opt.label = this.appData.programData.divisions.get(k);
      opt.value = k;
      divisions.push(opt);
    }

    divisions.sort((a, b) => {
      const firstDigitA = +a.label[a.label.search(/\d/)];
      const firstDigitB = +a.label[b.label.search(/\d/)];

      return firstDigitA - firstDigitB;
    });

    return divisions;
  }

  get programsBySelectedDivision(): Array<Program> {
    return this.appData.programData.programs.filter(p => p.division === this.appData.programData.selectedDivision);
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
              console.log(result);
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
