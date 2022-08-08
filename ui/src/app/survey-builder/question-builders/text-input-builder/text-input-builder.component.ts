import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from 'src/app/models/question';
import { SurveyQuestionPickerComponent } from '../../survey-question-picker/survey-question-picker.component';
import { QuestionBuilder } from '../question-builder';

@Component({
  selector: 'app-text-input-builder',
  templateUrl: './text-input-builder.component.html',
  styleUrls: ['./text-input-builder.component.css']
})
export class TextInputBuilderComponent extends QuestionBuilder implements OnInit {
  @Input() questionPicker: SurveyQuestionPickerComponent;

  registerControls(form: FormGroup) {
    super.registerControls(form);
  }

  initFromQuestion(q: Question): void {
    // TODO: more input types
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
      controlType: "text-input",
      inputType: "text",
      payload: [],
    })
  }
}
