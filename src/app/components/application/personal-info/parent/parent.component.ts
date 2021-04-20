import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Address} from '../../../../_classes/address';
import {Parent} from '../../../../_classes/parent';
import {Student} from '../../../../_classes/student';
import {ParentVerification} from '../../../../_classes/parent-verification';
import {LegacyParentResults} from '../../../../_classes/legacy-parent-results';
import {LegacyData} from '../../../../_classes/legacy-data';
import {CountryCode} from '../../../../_classes/country-code';
import {StateCode} from '../../../../_classes/state-code';
import {AppDataService} from '../../../../services/app-data.service';

declare const Visualforce: any;

@Component({
  selector: 'iee-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit, OnChanges {
  @Input() parents: Array<Parent>;
  @Input() student: Student;
  @Input() isParent: boolean;
  @Input() userContactId: string;
  @Input() countryCodes: Array<CountryCode> = [];
  @Input() stateCodes: Array<StateCode> = [];

  // parent search
  showParentSearch = false;
  parentVerification: ParentVerification;
  parentResult: LegacyParentResults;
  parentNotFound = false;
  addingUnverifiedParent = false;
  deletingParentId = 'none';
  isSaving = false;

  constructor(private appDataService: AppDataService) {
  }

  ngOnInit(): void {
    this.parents = this.parents || new Array<Parent>();

    this.appDataService.isSaving.asObservable().subscribe(saving => {
      this.isSaving = saving;
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setDefaultBillingParent();
  }

  editParent(parent: Parent): void {
    parent.isEditing = true;
  }

  reSendVerification(parent: Parent): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampApplication_ParentController.sendVerificationEmail',
      this.student.contactId, parent.contactId,
      result => {
        if (!result.includes('@')) {
          console.error('ERROR: Failed to send verification email');
        } else {
          parent.verificationSent = true;
          parent.email = result;
        }
      },
      {buffer: false, escape: false}
    );
  }

  searchForParent(): void {
    if (this.parentResult) {
      delete this.parentResult;
    }
    if (this.parentVerification) {
      delete this.parentVerification;
    }
    this.parentVerification = new ParentVerification();
    this.showParentSearch = true;
  }

  setDefaultBillingParent(): void {
    if (this.student && this.parents.length === 1) {
      this.student.billingParentId = this.parents[0].contactId;
    }
  }

  findRelation(): void {
    this.parentNotFound = false;

    if (this.searchFormComplete()) {
      // search salesforce for an existing person
      Visualforce.remoting.Manager.invokeAction(
        'IEE_CampApplication_ParentController.findParentContact',
        this.student.contactId,
        JSON.stringify(this.parentVerification),
        result => {
          if (result && result !== 'null') {
            this.parentResult = JSON.parse(result);
            // console.log('found parent: ' + this.parentResult);
          } else {
            // console.log('no parent found, creating new one.');
            const emptyParent = Parent.createFromVerificationData(this.parentVerification);
            emptyParent.isEditing = true;
            emptyParent.verification = 'Verified';
            this.parents.push(emptyParent);
            this.parentNotFound = true;

            // save parent on create
            emptyParent.isSaving = true;
            Visualforce.remoting.Manager.invokeAction(
              'IEE_OnlineApplicationController.saveParent',
              JSON.stringify(emptyParent), this.student.contactId,
              parentSaveResult => {
                emptyParent.isSaving = false;
                if (parentSaveResult.startsWith('ERR')) {
                  console.error('ERROR: Could not save parent');
                } else {
                  emptyParent.contactId = parentSaveResult;
                }
              },
              {buffer: false, escape: false}
            );
          }
          this.showParentSearch = false;
        },
        {buffer: false, escape: false}
      );
    }
  }

  verifyParent(): void {
    this.addingUnverifiedParent = true;
    // console.log('verifying parent: %s, student: %s', this.student.contactId, this.parentResult.contactIdParent.value);
    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampApplication_ParentController.verifyParentContactById',
      this.student.contactId, this.parentResult.contactIdParent.value,
      JSON.stringify(this.parentVerification),
      result => {
        // console.dir(result);
        const obj = JSON.parse(result);

        const legacyParent: Map<string, LegacyData> = new Map<string, LegacyData>();
        for (const key of Object.keys(obj)) {
          // console.dir(key);
          legacyParent.set(key, LegacyData.createFromJson(obj[key]));
        }

        const unverifiedParent = Parent.createFromLegacyData(legacyParent);
        unverifiedParent.contactId = this.parentResult.contactIdParent.value;
        this.parents.push(unverifiedParent);

        this.setDefaultBillingParent();

        delete this.parentVerification;
        delete this.parentResult;

        this.addingUnverifiedParent = false;
      },
      {buffer: false, escape: false}
    );
  }

  clearRelationSearchForm(): void {
    delete this.parentVerification;
    this.showParentSearch = false;
  }

  searchFormComplete(): boolean {
    return !!this.parentVerification.email &&
      !!this.parentVerification.firstName &&
      !!this.parentVerification.lastName &&
      !!this.parentVerification.phone;
  }

  removeParent(parentContactId: string): void {
    console.log(`removing ${parentContactId}`);
    const pi = this.parents.findIndex(p => p.contactId === parentContactId);
    if (!this.isSaving || !this.parents[pi].isSaving || !this.parents[pi].isDeleting) {
      this.deletingParentId = parentContactId;
      this.parents[pi].isDeleting = true;
      Visualforce.remoting.Manager.invokeAction(
        'IEE_OnlineApplicationController.removeParent',
        parentContactId, this.student.contactId,
        result => {
          if (result === true) {
            // console.log('removed parent');
            this.parents.splice(pi, 1);
            if (this.student.billingParentId === parentContactId) {
              this.student.billingParentId = null;
              // Set a new default billing parent if we can
              this.setDefaultBillingParent();
            }
          } else {
            console.error('Could not delete parent: ' + parentContactId);
            this.parents[pi].isDeleting = false;
          }
          this.deletingParentId = 'none';
        },
        {buffer: false, escape: false}
      );
    }
  }
}
