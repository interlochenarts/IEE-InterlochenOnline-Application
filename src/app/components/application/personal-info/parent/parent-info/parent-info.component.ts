import {Component, Input, OnInit} from '@angular/core';
import {Parent} from '../../../../../_classes/parent';
import {Student} from '../../../../../_classes/student';

@Component({
  selector: 'iee-parent-info',
  templateUrl: './parent-info.component.html',
  styleUrls: ['./parent-info.component.css']
})
export class ParentInfoComponent implements OnInit {
  @Input() parent: Parent;
  @Input() student: Student;

  constructor() { }

  ngOnInit(): void {
  }

  copyAddressFromStudent(): void {
    this.parent.mailingAddress.street = this.student.mailingAddress.street;
    this.parent.mailingAddress.city = this.student.mailingAddress.city;
    this.parent.mailingAddress.country = this.student.mailingAddress.country;
    this.parent.mailingAddress.stateProvince = this.student.mailingAddress.stateProvince;
    this.parent.mailingAddress.zipPostalCode = this.student.mailingAddress.zipPostalCode;
  }

  save(): void {
    this.parent.editing = false;
  }
}
