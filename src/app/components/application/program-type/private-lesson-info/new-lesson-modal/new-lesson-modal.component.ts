import {Component, Input} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForOf, NgIf} from '@angular/common';
import {SalesforceOption} from '../../../../../_classes/salesforce-option';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PrivateLessonResult} from '../../../../../_classes/private-lesson-result';
import {Program} from '../../../../../_classes/program';

@Component({
  selector: 'iee-new-lesson-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgForOf,
    NgIf
  ],
  templateUrl: './new-lesson-modal.component.html',
  styleUrl: './new-lesson-modal.component.less'
})
export class NewLessonModalComponent {
  @Input() modal: NgbActiveModal;
  @Input() isMusic: boolean;
  @Input() instrumentOptions: Array<SalesforceOption>;
  @Input() program: Program;

  data: PrivateLessonResult = new PrivateLessonResult();

  get isOtherInstrument(): boolean {
    return this.data.instrument === 'Other';
  }

  dismiss() {
    this.modal.dismiss('close clicked');
  }

  ok() {
    this.modal.close(JSON.stringify(this.data));
  }

  buttonDisabled(): boolean {
    if (this.isMusic) {
      return (!this.data.instrument || !this.data.lessonCount) || this.data.lessonCount < 1 || this.data.lessonCount > 999;
    } else {
      return !this.data.lessonCount || this.data.lessonCount < 1 || this.data.lessonCount > 999;
    }
  }
}
