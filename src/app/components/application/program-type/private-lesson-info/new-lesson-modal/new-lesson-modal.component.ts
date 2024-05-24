import {Component, ElementRef, Input, ViewChild} from '@angular/core';
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

  @ViewChild('lessonCountField') lessonCountFieldRef: ElementRef;

  data: PrivateLessonResult = new PrivateLessonResult();

  get invalidLessonCount(): boolean {
    return this.data.lessonCount < 1 || this.data.lessonCount > 99 || !this.lessonCountFieldRef?.nativeElement.checkValidity();
  }

  get formInvalid(): boolean {
    if (this.isMusic) {
      return (!this.data.instrument || !this.data.lessonCount) || this.invalidLessonCount;
    } else {
      return !this.data.lessonCount || this.invalidLessonCount;
    }
  }

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
    return this.formInvalid;
  }
}
