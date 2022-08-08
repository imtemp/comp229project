import { Component, Input, OnInit } from '@angular/core';
import { SurveyQuestionContainerComponent } from '../../question-container/question-container.component';
import { QuestionInput } from '../question-input';

@Component({
  selector: 'app-question-text-input',
  templateUrl: './question-text-input.component.html',
  styleUrls: ['./question-text-input.component.css']
})
export class QuestionTextInputComponent extends QuestionInput implements OnInit {
  @Input() parent: SurveyQuestionContainerComponent;

  constructor() {
    super();
  }

  ngOnInit(): void {
  }
}
