import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {ApplicationData} from '../_classes/application-data';
import {CountryCode} from '../_classes/country-code';
import {StateCode} from '../_classes/state-code';
import {RouterLink} from '../_classes/router-link';
import {Parent} from '../_classes/parent';
import {Student} from '../_classes/student';
import {Program} from "../_classes/program";
import {Payment} from "../_classes/payment";
import {CertificateGroup} from "../_classes/certificate-group";

declare const Visualforce: any;

@Injectable({
  providedIn: 'root'
})
export class AppDataService {
  public applicationData = new BehaviorSubject<ApplicationData>(null);
  public applicationId = new BehaviorSubject<string>(null);
  public transactionId = new BehaviorSubject<string>(null);
  public userType = new BehaviorSubject<string>(null);
  public userContactId = new BehaviorSubject<string>(null);
  public countryData = new BehaviorSubject<Array<CountryCode>>(new Array<CountryCode>());
  public stateData = new BehaviorSubject<Array<StateCode>>(new Array<StateCode>());
  public isSaving = new BehaviorSubject<boolean>(false);
  public routerLinks = new BehaviorSubject<Array<RouterLink>>([]);
  public credentialStatus = new BehaviorSubject<string>(null);
  public reviewCompleted = new BehaviorSubject<boolean>(false);
  public paymentReceived = new BehaviorSubject<boolean>(false);
  public daysSelectedBySession = new BehaviorSubject<Map<string, Set<string>>>(new Map<string, Set<string>>());

  constructor() {
  }

  public getApplicationData(applicationId: string): void {
    if (applicationId && !this.applicationData.getValue()) {
      // noinspection JSUnresolvedReference
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.getApplicationData',
        applicationId,
        (json: string) => {
          if (json !== null) {
            // build app data
            // console.info('json', json);
            this.applicationData.next(ApplicationData.createFromNestedJson(JSON.parse(json)));
          }
        },
        {buffer: false, escape: false}
      );
    }
  }

  public getUserType(): void {
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getUserType',
      (userType: string) => {
        this.userType.next(userType);
      },
      {buffer: false, escape: false}
    );
  }

  public getUserContactId(): void {
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getUserContactId',
      (userContactId: string) => {
        this.userContactId.next(userContactId);
      },
      {buffer: false, escape: false}
    );
  }

  public getCountryData(): void {
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_DataController.getCountryData',
      (json: string) => {
        if (json !== null) {
          const countryJson = JSON.parse(json);
          const countryCodes = countryJson.map((country: any) => CountryCode.createFromJson(country));
          this.countryData.next(countryCodes);
        }
      },
      {buffer: false, escape: false}
    );
  }

  public getStateData(): void {
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_DataController.getStateData',
      (json: string) => {
        if (json !== null) {
          const stateJson = JSON.parse(json);
          const stateCodes = stateJson.map((state: any) => StateCode.createFromJson(state));
          this.stateData.next(stateCodes);
        }
      },
      {buffer: false, escape: false}
    );
  }

  public saveApplication(): void {
    const appData: ApplicationData = this.applicationData.getValue();
    const appId: string = this.applicationId.getValue();

    const appDataCopy = ApplicationData.createFromNestedJson(JSON.parse(JSON.stringify(appData)));
    // only save parents who are not being deleted, and that already have a contact id
    // hopefully prevents creating duplicate parents
    appDataCopy.parents = appDataCopy.parents.filter(p => !p.isDeleting && !!p.contactId);

    // only save if we have an app and appId. Also wait until previous save is done.
    if (appData && appId && (this.isSaving.getValue() === false)) {
      this.isSaving.next(true);
      // noinspection JSUnresolvedReference
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.saveApplication',
        JSON.stringify(appDataCopy),
        appId,
        (result: string) => {
          if (result !== null) {
            // Commenting out for now, don't want to save parents here for the first time
            // const resultApp = ApplicationData.createFromNestedJson(JSON.parse(result));
            // resultApp.parents.forEach((p: Parent) => {
            //   // match on first name because I can't think of anything better
            //   appData.parents.find(ap => ap.firstName === p.firstName).contactId = p.contactId;
            // });
          }
          this.isSaving.next(false);
        },
        {buffer: false, escape: false}
      );
    }
  }

  /**
   * Save the Age Group to the application record
   * @param ageGroup The Age Group to save to the application
   * @param that should never be specified by the calling function, only used in the timeout
   */
  public saveAgeGroup(ageGroup: string, that = this): void {
    const appId: string = that.applicationId.getValue();
    const isSaving: boolean = that.isSaving.getValue();

    // wait until previous save is done.
    if (!isSaving) {
      that.isSaving.next(true);
      // noinspection JSUnresolvedReference
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.saveGradeInSchool',
        appId, ageGroup,
        () => {
          that.isSaving.next(false);
        },
        {buffer: false, escape: false}
      );
    } else {
      // repeat the save until it goes through
      setTimeout(that.saveAgeGroup, 1000, ageGroup, that);
    }
  }

  public sendParentCredentials(parent: Parent, student: Student): void {
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_UserUtilityController.sendUserLoginByContactId',
      parent.contactId, student.contactId, 'Adult',
      (result: string) => {
        if (result.includes('@')) {
          this.credentialStatus.next('Credentials sent to ' + result);
        } else {
          console.error(result);
          this.credentialStatus.next('Sorry. Something went wrong.');
        }
      },
      {buffer: false, escape: false}
    );
  }

  public saveProgram(program: Program): void {
    this.reviewCompleted.next(false);
    program.isSelected = true;
    program.isSaving = true;
    this.addDaysSelected(program);
    const appData = this.applicationData.getValue();
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addAppChoice',
      appData.appId, program.id, program.sessionId,
      (program.selectedInstrument ? program.selectedInstrument : ''),
      (program.lessonCount ? program.lessonCount : ''),
      (program.selectedInstrumentOther ? program.selectedInstrumentOther : ''),
      (result: string) => {
        if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          // console.log('Saved new program: ' + result);
          program.appChoiceId = result;
          // Update payment info
          // noinspection JSUnresolvedReference
          Visualforce.remoting.Manager.invokeAction(
            'IEE_OnlineApplicationController.getPaymentJSON',
            appData.appId,
            (payment: string) => {
              if (payment && payment !== 'null') {
                appData.payment = Payment.createFromNestedJson(JSON.parse(payment));
              }
              this.applicationData.next(appData);
            },
            {buffer: false, escape: false}
          );
        }
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  public saveBundle(group: CertificateGroup, programIds: string): void {
    this.reviewCompleted.next(false);
    group.isSelected = true;
    group.isSaving = true;
    const appData = this.applicationData.getValue();

    const appChoiceString = group.appChoiceIds.filter(ac => !!ac).join(';');

    // console.log('saveBundle() - appId: ', appData.appId, ', groupId: ', group.id, ', programIds: ', programIds, ', appChoices: ', appChoiceString);
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addCertificateAppChoices',
      appData.appId, group.id, programIds, appChoiceString,
      (result: string) => {
        if (!result) {
          console.error('something went wrong on the server');
        } else if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          group.bundleChoices = programIds.split(';');
          const appChoices = result.split(';');
          const appChoiceIds = []
          for (let i = 0; i < appChoices.length; i++) {
            const [id, dates] = appChoices[i].split('|');
            appChoiceIds.push(id);
            group.courses[i].selectedSessionDates = dates;
          }
          group.appChoiceIds = appChoiceIds;
          // console.info('bundle saved, updating app data');
          group.getSelectedProgramsByAgeGroup(appData.ageGroup)
            .forEach((p, index) => {
              p.isSelected = true;
              p.certificateGroupId = group.id;
              // remove any unselected programs from acProgramData
              appData.acProgramData.programs.filter((acp) => acp.certificateGroupId === group.id)
                .forEach(acProgram => {
                    const acProgramIndex = appData.acProgramData.programs.findIndex(fp => acProgram.id === fp.id);
                  if (!group.bundleChoices.includes(acProgram.id) && acProgramIndex > -1) {
                    console.log('removing from acProgramData', acProgram.name, acProgram.sessionName);
                    this.clearProgramFlags(acProgram);
                    appData.acProgramData.programs.splice(acProgramIndex, 1);
                    // Don't add it back if it's an inactive program from an expired cert
                    if (acProgram.isActive && acProgram.isSessionActive) {
                      appData.programData.programs.push(acProgram);
                    } else {
                      // If the removed program was expired, reset the course data to no longer be invalid
                      group.courses.forEach(course => {
                        course.getProgramsByDivision(acProgram.division).forEach(program => {
                          if (program.id == acProgram.id) {
                            course.isInvalid = false;
                          }
                        });
                      });
                    }
                  }
                });

              // move newly selected from programData to acProgramData
              const mainProgramIndex = appData.programData.programs.findIndex(fp => p.id === fp.id);
              if (mainProgramIndex > -1) {
                // might not find one because it's unscheduled (session-less)
                const mainProgram = appData.programData.programs[mainProgramIndex];
                mainProgram.isSelected = true;
                mainProgram.certificateGroupId = group.id;
                mainProgram.certificateGroupName = group.name;
                mainProgram.appChoiceId = appChoiceIds[index];

                appData.programData.programs.splice(mainProgramIndex, 1);
                if (appData.acProgramData.programs.findIndex(acp => acp.id === mainProgram.id) < 0) {
                  // only add if not already in list
                  appData.acProgramData.programs.push(mainProgram);
                }
              }
            });
          // make sure appData gets a new value for observers
          this.applicationData.next(appData);
        }
        group.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  /**
   * Remove a bundle group
   * @param group The Certificate Bundle to remove
   */
  public removeBundle(group: CertificateGroup): void {
    this.reviewCompleted.next(false);
    group.isSaving = true;
    group.isSelected = false;
    const appData: ApplicationData = this.applicationData.getValue();
    const appChoiceIds: string = group.appChoiceIds.join(';')

    // console.log('removeBundle() - appId:', appData.appId, ', appChoiceIds:', appChoiceIds);
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.removeAppChoiceList',
      appData.appId, appChoiceIds,
      (result: string) => {
        if (!result) {
          console.error('something went wrong on the server');
        } else if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          group.getSelectedProgramsByAgeGroup(appData.ageGroup).forEach((p: Program) => {
            p.isSelected = false;
            const acProgramIndex = appData.acProgramData.programs.findIndex(acp => acp.id === p.id);
            if (acProgramIndex > -1) {
              const acProgram = appData.acProgramData.programs[acProgramIndex];
              this.clearProgramFlags(acProgram);
              appData.acProgramData.programs.splice(acProgramIndex, 1);
              appData.programData.programs.push(acProgram);
            }
          });
          group.appChoiceIds.length = 0;
          group.bundleChoices.length = 0;

          // console.info('removed Certificate Group');
          // console.dir(group);
          //TODO: Update Payment info?
        }
        group.isSaving = false;
        console.info('bundle removed, updating app data');
        this.applicationData.next(appData);
      },
      {buffer: false, escape: false}
    );
  }

  /**
   * Make a program unselected and remove from bundle
   * @param program
   * @private
   */
  private clearProgramFlags(program: Program) {
    program.isSelected = false;
    program.certificateGroupId = null;
    program.certificateGroupName = null;
  }

  public updateProgram(program: Program): void {
    this.reviewCompleted.next(false);
    const appData = this.applicationData.getValue();
    program.isSaving = true;

    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.updateAppChoiceLessons',
      appData.appId, program.appChoiceId, program.lessonCount, program.lessonCountAdd,
      (result: string) => {
        if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          if (!program.isRegistered) {
            program.lessonCount += program.lessonCountAdd;
            program.lessonCountAdd = 0;
          }
          // Update payment info
          // noinspection JSUnresolvedReference
          Visualforce.remoting.Manager.invokeAction(
            'IEE_OnlineApplicationController.getPaymentJSON',
            appData.appId,
            (payment: string) => {
              if (payment && payment !== 'null') {
                appData.payment = Payment.createFromNestedJson(JSON.parse(payment));
              }
              this.applicationData.next(appData);
            },
            {buffer: false, escape: false}
          );
        }
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  public removeProgram(program: Program): void {
    this.reviewCompleted.next(false);
    program.isSelected = false;
    program.isSaving = true;
    const daysSelected = this.daysSelectedBySession.getValue().get(program.sessionName);
    program.daysArrayApi?.forEach(d => {
      daysSelected.delete(d);
    });
    this.daysSelectedBySession.getValue().set(program.sessionName, daysSelected);
    // noinspection JSUnresolvedReference
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.removeAppChoice',
      this.applicationData.getValue().appId, program.appChoiceId,
      () => {
        // console.log(result);
        program.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  public addDaysSelected(p: Program): void {
    p.daysArrayApi?.forEach(d => {
      const daysSelected: Set<string> = this.daysSelectedBySession.getValue().get(p.sessionName) || new Set<string>();
      if (p.allowsConflicts === false) {
        daysSelected.add(d);
      }
      this.daysSelectedBySession.getValue().set(p.sessionName, daysSelected);
    });
  }
}
