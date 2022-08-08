import { v4 as uuidv4 } from 'uuid';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ControlType, CONTROL_TYPES, CONTROL_TYPES_NAMES, Question } from '../../models/question';
import { QuestionBuilder } from '../question-builders/question-builder';
import { SurveyBuilderComponent } from '../survey-builder.component';

@Component({
  selector: 'app-survey-question-picker',
  templateUrl: './survey-question-picker.component.html',
  styleUrls: ['./survey-question-picker.component.css'],
})
export class SurveyQuestionPickerComponent implements OnInit, OnDestroy {
  private _id: string;
  private _question: QuestionBuilder;

  controlTypes = CONTROL_TYPES_NAMES;
  @Input() controlType: string = CONTROL_TYPES[0];
  @Input() parent: SurveyBuilderComponent;
  @Input() removable = true;
  position: number;
  questionToInitFrom: Question = null;

  onDeleteClicked = null;

  constructor() {
    if (this.onDeleteClicked == null) {
      this.onDeleteClicked = () => {
        // Remove the question object from the array
        this.parent.questions.splice(this.position - 1, 1);
        // Update the position badges
        this.parent.questions.forEach((v, i) => v.position = i + 1);
      };
    }
  }

  ngOnInit(): void {
    this.position = this.parent.addQuestionPicker(this);
  }

  get ID(): string {
    if (this._id === undefined) {
      this._id = uuidv4();
    }
    return this._id;
  }

  get question(): QuestionBuilder {
    return this._question;
  }

  set question(q: QuestionBuilder) {
    // Remove the previous form controls
    if (this._question) {
      this._question.removeControls(this.parent.surveyForm);
    }
    this._question = q;
    if (this.questionToInitFrom) {
      this._question.initFromQuestion(this.questionToInitFrom);
    }
    this.question.registerControls(this.parent.surveyForm);
  }

  ngOnDestroy() {
    this.question.removeControls(this.parent.surveyForm);
  }

  buildQuestion(): Question {
    return this.question.buildQuestion();
  }
}
