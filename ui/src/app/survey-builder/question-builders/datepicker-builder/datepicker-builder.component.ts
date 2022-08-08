import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Question } from 'src/app/models/question';
import { SurveyQuestionPickerComponent } from '../../survey-question-picker/survey-question-picker.component';
import { QuestionBuilder } from '../question-builder';

// TODO: see if we can inherit from TextInputBuilderComponent
@Component({
  selector: 'app-datepicker-builder',
  templateUrl: './datepicker-builder.component.html',
  styleUrls: ['./datepicker-builder.component.css']
})
export class DatepickerBuilderComponent extends QuestionBuilder implements OnInit {
  @Input() questionPicker: SurveyQuestionPickerComponent;

  initFromQuestion(q: Question): void {
    this.prompt = q.prompt;
    this.required = q.required;
  }

  buildQuestion(): Question {
    return new Question({
      surveyId: "",
      id: "",
      defaultValue: null,
      prompt: this.prompt,
      dataName: `question-#${this.questionPicker.position}`,
      required: this.required,
      controlType: "datepicker",
      inputType: null,
      payload: [],
    })
  }
}