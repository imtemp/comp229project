import { Component, Inject, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Question } from "src/app/models/question";
import { SurveySubmission } from 'src/app/models/survey_submission';
import { Answer } from "../../models/answer";
import { Survey } from "../../models/survey";
import { SurveyService } from "./survey.service";

@Component({
  selector: "app-survey",
  templateUrl: "./survey.component.html",
  styleUrls: ["./survey.component.css"],
})
export class SurveyComponent implements OnInit {
  survey: Survey;
  form: FormGroup;
  /// The questions from the survey but sorted (mongo sometimes returns them in the wrong order).
  questions: Question[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {
    this.route.data.subscribe((data: { survey: Survey }) => {
      this.survey = data.survey;
      this.questions = this.survey.questions.sort((a, b) =>
        a.dataName.localeCompare(b.dataName)
      );
    });
  }

  ngOnInit(): void {
    this.form = this.surveyService.toFormGroup(this.survey);
  }

  onSubmit() {
    const rawAnswers = this.form.getRawValue();
    const answers = [];

    for (const q of this.survey.questions) {
      let value = rawAnswers[q.dataName];

      // This is a multiple choice array
      if (value.constructor === Array) {
        value = value.filter((v: boolean | string) => typeof v === "string");
      }
      answers.push(new Answer(q.id, value));
    }

    const submission = new SurveySubmission({ id: null, surveyId: this.survey.id, user: null, answers: answers });
    this.surveyService.submitSurvey(submission).subscribe((_) => {
      this.router.navigateByUrl("/");
    });
  }
}
