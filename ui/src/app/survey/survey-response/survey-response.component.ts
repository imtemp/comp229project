import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute
} from '@angular/router';
import {
  Answer
} from 'src/app/models/answer';
import {
  Question
} from 'src/app/models/question';
import {
  Survey
} from 'src/app/models/survey';
import {
  SurveySubmission
} from 'src/app/models/survey_submission';
import {
  SurveyService
} from '../survey-component/survey.service';

@Component({
  selector: 'app-survey-response',
  templateUrl: './survey-response.component.html',
  styleUrls: ['./survey-response.component.css']
})
export class SurveyResponseComponent implements OnInit {
  submission: SurveySubmission;
  survey: Survey;
  id2q: Record < string,
  Question > ;

  constructor(private route: ActivatedRoute, private surveyService: SurveyService) {
    const sub = JSON.parse(window.localStorage.getItem('lastSubmission'));
    this.submission = sub.submission;
    this.survey = sub.survey;
    this.id2q = {};
    this.survey.questions.forEach(q => this.id2q[q.id] = q);
  }

  ngOnInit(): void {

  }

  cast(a: Answer | string): Answer {
    return <Answer > < unknown > a;
  }

  getQuestion(a: Answer) {
    return this.id2q[a.question];
  }

  getAnswers(a: Answer): string {
    const q = this.getQuestion(a);
    if (q.controlType == 'choice') {
      return a.answer.map(a => q.payload.find(({
        key
      }) => key == a).value).join(', ');
    }

    return a.answer.join(', ')
  }

  exportAsJson() {
    this.surveyService.saveJson(
      this.submission,
      this.submission.respondentId
    );
  }
}