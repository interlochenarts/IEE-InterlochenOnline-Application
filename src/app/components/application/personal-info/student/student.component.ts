import {Component, Input, OnInit} from '@angular/core';
import {Student} from '../../../../_classes/student';
import {Parent} from '../../../../_classes/parent';
import {Address} from '../../../../_classes/address';

@Component({
  selector: 'iee-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.css']
})
export class StudentComponent implements OnInit {
  @Input() student: Student;
  @Input() parents: Array<Parent>;

  yesNoOptions = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'}
  ];

  genderIdentityOptions = [
    {label: 'Female', value: 'Female'},
    {label: 'Male', value: 'Male'},
    {label: 'Non-Binary', value: 'Non-Binary'}
  ];

  constructor() {
  }

  ngOnInit(): void {
    this.student = this.student || new Student();
    this.student.mailingAddress = this.student.mailingAddress || new Address();
  }

  genderDetailRequired(): boolean {
    return this.student.genderIdentity === 'Non-Binary';
  }

  copyAddressFrom(parentAddress: Address): void {
    this.student.mailingAddress.street = parentAddress.street;
    this.student.mailingAddress.city = parentAddress.city;
    this.student.mailingAddress.country = parentAddress.country;
    this.student.mailingAddress.stateProvince = parentAddress.stateProvince;
    this.student.mailingAddress.zipPostalCode = parentAddress.zipPostalCode;
  }

}
