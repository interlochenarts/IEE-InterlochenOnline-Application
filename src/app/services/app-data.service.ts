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
  public daysSelectedBySession = new BehaviorSubject<Map<string, Set<string>>>(new Map<string, Set<string>>());

  constructor() {
  }

  public getApplicationData(applicationId: string): void {
    if (applicationId && !this.applicationData.getValue()) {
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
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getUserType',
      (userType: string) => {
        this.userType.next(userType);
      },
      {buffer: false, escape: false}
    );
  }

  public getUserContactId(): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.getUserContactId',
      (userContactId: string) => {
        this.userContactId.next(userContactId);
      },
      {buffer: false, escape: false}
    );
  }

  public getCountryData(): void {
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

  public sendParentCredentials(parent: Parent, student: Student): void {
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
    program.isSelected = true;
    this.addDaysSelected(program);
    const appData = this.applicationData.getValue();
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addAppChoice',
      appData.appId, program.id, program.sessionId,
      (program.selectedInstrument ? program.selectedInstrument : ''), (program.lessonCount ? program.lessonCount : ' '),
      (result: string) => {
        if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          // console.log('Saved new program: ' + result);
          program.appChoiceId = result;
          // Update payment info
          Visualforce.remoting.Manager.invokeAction(
            'IEE_OnlineApplicationController.getPaymentJSON',
            appData.appId,
            (payment: string) => {
              if (payment && payment !== 'null') {
                appData.payment = Payment.createFromNestedJson(JSON.parse(payment));
              }
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
    group.isSelected = true;
    const appData = this.applicationData.getValue();

    console.log('saveBundle', appData.appId, group.id, programIds);
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.addCertificateAppChoices',
      appData.appId, group.id, programIds,
      (result: string) => {
        if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          group.appChoiceIds = result.split(';');

          // console.log('Saved new program: ' + result);
          // Update payment info
          // Visualforce.remoting.Manager.invokeAction(
          //   'IEE_OnlineApplicationController.getPaymentJSON',
          //   appData.appId,
          //   (payment: string) => {
          //     if (payment && payment !== 'null') {
          //       appData.payment = Payment.createFromNestedJson(JSON.parse(payment));
          //     }
          //   },
          //   {buffer: false, escape: false}
          // );
        }
        group.isSaving = false;
      },
      {buffer: false, escape: false}
    );
  }

  public updateProgram(program: Program): void {
    const appData = this.applicationData.getValue();

    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.updateAppChoiceLessons',
      appData.appId, program.appChoiceId, program.lessonCount, program.lessonCountAdd,
      (result: string) => {
        if (result.startsWith('ERR')) {
          console.error(result);
        } else {
          console.log('updated program: ' + result);
          if (!program.isRegistered) {
            program.lessonCount += program.lessonCountAdd;
            program.lessonCountAdd = 0;
          }
          // Update payment info
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
    program.isSelected = false;
    const daysSelected = this.daysSelectedBySession.getValue().get(program.sessionName);
    program.daysArrayApi?.forEach(d => {
      daysSelected.delete(d);
    });
    this.daysSelectedBySession.getValue().set(program.sessionName, daysSelected);
    Visualforce.remoting.Manager.invokeAction(
      'IEE_OnlineApplicationController.removeAppChoice',
      this.applicationData.getValue().appId, program.appChoiceId,
      (result: string) => {
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
