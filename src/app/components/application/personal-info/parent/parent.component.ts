import {Component, Input, OnInit} from '@angular/core';
import {Address} from '../../../../_classes/address';
import {Parent} from '../../../../_classes/parent';
import {Student} from '../../../../_classes/student';

@Component({
  selector: 'iee-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  @Input() parents: Array<Parent>;
  @Input() student: Student;
  primaryBillingContact: string;

  constructor() { }

  ngOnInit(): void {
  }

  editParent(parent: Parent): void {
    parent.editing = true;
  }

  createParent(): void {
    const parent: Parent = new Parent();
    parent.mailingAddress = new Address();
    parent.editing = true;

    this.parents.push(parent);
  }
}
