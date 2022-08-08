import { Component, Input, OnInit } from '@angular/core';
import { SurveyQuestionContainerComponent } from '../../question-container/question-container.component';
import { QuestionInput } from '../question-input';

@Component({
  selector: 'app-question-datepicker-input',
  templateUrl: './question-datepicker-input.component.html',
  styleUrls: ['./question-datepicker-input.component.css']
})
export class QuestionDatepickerInputComponent extends QuestionInput implements OnInit {
  @Input() parent: SurveyQuestionContainerComponent;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }

  get datepickerControl() {
    return this.form.get(this.question.dataName);
  }
}
