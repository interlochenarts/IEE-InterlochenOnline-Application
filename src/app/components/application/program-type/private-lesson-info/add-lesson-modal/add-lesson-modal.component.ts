import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {ListTypes} from "../../../../../_enums/enums";
import {FormsModule} from '@angular/forms';
import {NgIf} from '@angular/common';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {PrivateLessonResult} from '../../../../../_classes/private-lesson-result';
import {Program} from '../../../../../_classes/program';

@Component({
  selector: 'iee-add-lesson-modal',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  templateUrl: './add-lesson-modal.component.html',
  styleUrl: './add-lesson-modal.component.less'
})
export class AddLessonModalComponent implements OnInit {
  @Input() modal: NgbActiveModal;
  @Input() modalList: ListTypes;
  @Input() previousCount: number;
  @Input() program: Program;

  @ViewChild('lessonCountAdd') lessonCountAddRef: ElementRef;

  data: PrivateLessonResult = new PrivateLessonResult();

  protected readonly ListTypes = ListTypes;

  get invalidLessonCount(): boolean {
    return this.data.lessonCountAdd < 0 || this.data.lessonCountAdd > 99 || !this.lessonCountAddRef?.nativeElement.checkValidity();
  }

  ngOnInit() {
    this.data.lessonCountAdd = this.previousCount;
  }

  dismiss() {
    this.modal.dismiss('Close clicked');
  }

  ok() {
    this.modal.close(JSON.stringify(this.data));
  }

  buttonDisabled(): boolean {
    return this.invalidLessonCount;
  }
}
