import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from '../../models/question';

@Component({
  selector: 'app-survey-question-container',
  templateUrl: './question-container.component.html',
  styleUrls: ['./question-container.component.css']
})
export class SurveyQuestionContainerComponent implements OnInit {
  @Input() question: Question;
  @Input() form: FormGroup;
  answer: string;

  constructor() { }

  ngOnInit(): void { }

  get isValid() {
    return this.form.controls[this.question.dataName].valid;
  }

  get position(): string {
    return this.question.dataName.split('#', 2)[1];
  }
}
