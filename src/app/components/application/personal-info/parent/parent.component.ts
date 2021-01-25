import {Component, Input, OnInit} from '@angular/core';
import {Address} from '../../../../_classes/address';
import {Parent} from '../../../../_classes/parent';
import {Student} from '../../../../_classes/student';
import {ParentVerification} from '../../../../_classes/parent-verification';
import {LegacyParentResults} from '../../../../_classes/legacy-parent-results';

declare const Visualforce: any;

@Component({
  selector: 'iee-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  @Input() parents: Array<Parent>;
  @Input() student: Student;
  primaryBillingContact: string;

  // parent search
  showParentSearch = false;
  parentVerification: ParentVerification;
  parentResult: LegacyParentResults;
  parentNotFound = false;
  addingUnverifiedParent = false;

  constructor() { }

  ngOnInit(): void {
    this.parents = this.parents || new Array<Parent>();
  }

  editParent(parent: Parent): void {
    parent.editing = true;
  }

  reSendVerification(parent: Parent): void {
    // TODO: re-send verification email function call
  }

  searchForParent(): void {
    if (this.parentResult) {
      delete this.parentResult;
    }
    this.parentVerification = new ParentVerification();
    this.showParentSearch = true;
  }

  createParent(): void {
    const parent: Parent = new Parent();
    parent.mailingAddress = new Address();
    parent.editing = true;

    this.parents.push(parent);
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
            console.log('found parent: ' + this.parentResult);
            this.showParentSearch = false;
          } else {
            console.log('no parent found, creating new one.');
            const emptyParent = Parent.createFromVerificationData(this.parentVerification);
            emptyParent.editing = true;
            emptyParent.verification = 'Verified';
            this.parents.push(emptyParent);
            this.parentNotFound = true;
          }

          delete this.parentVerification;
        },
        {buffer: false, escape: false}
      );
    }
  }

  verifyParent(): void {
    Visualforce.remoting.Manager.invokeAction(
      'IEE_CampApplication_ParentController.verifyParentContactById',
      this.student.contactId, this.parentResult.contactIdParent.value,
      JSON.stringify(this.parentVerification),
      result => {
        // `result` is unused because it uses the old data model. We create a new parent from the verification data
        // and add the contact id
        const unverifiedParent = Parent.createFromVerificationData(this.parentVerification);
        unverifiedParent.contactId = this.parentResult.contactIdParent.value;
        this.parents.push(unverifiedParent);

        delete this.parentVerification;
        delete this.parentResult;
      },
      {buffer: false, escape: false}
    );
  }

  clearRelationSearchForm(): void {

  }

  searchFormComplete(): boolean {
    return !!this.parentVerification.email &&
      !!this.parentVerification.firstName &&
      !!this.parentVerification.lastName &&
      !!this.parentVerification.phone;
  }
}
