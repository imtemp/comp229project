import {
  Component,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  MatPaginator
} from '@angular/material/paginator';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import {
  Survey
} from 'src/app/models/survey';
import {
  SurveySubmission
} from 'src/app/models/survey_submission';
import {
  SurveyService
} from '../survey-component/survey.service';

class ResponseRow {
  constructor(private submission: SurveySubmission) {}

  get id(): string {
    return this.submission.id;
  }

  get username(): string {
    if (!this.submission.user) {
      return 'Anonymous';
    }
    if (typeof this.submission.user === 'string') {
      console.log("This shouldn't have happened");
      throw new Error("User object hasn't been fetched from the server.");
    }
    return this.submission.user.username;
  }

  get respondentId(): string {
    return this.submission.respondentId;
  }

  get nAnswers(): number {
    return this.submission.answers.length;
  }

  get date(): string {
    const date = new Date(this.submission.date);
    const day = date.getDay();
    const month = date.getMonth();
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
}

@Component({
  selector: 'app-survey-responses',
  templateUrl: './survey-responses.component.html',
  styleUrls: ['./survey-responses.component.css']
})
export class SurveyResponsesComponent implements OnInit {
  survey: Survey;
  submissions: ResponseRow[];
  displayedColumns: string[] = ['username', 'respondentId', 'date', 'nAnswers', 'viewAnswers'];

  dataSource: MatTableDataSource < ResponseRow > ;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {
    this.route.data.subscribe((data: {
      survey: Survey
    }) => {
      this.survey = data.survey;
      this.submissions = [];
      this.dataSource = new MatTableDataSource(this.submissions);
      this.submissions.push(...this.survey.submissions.sort((a, b) =>
        (new Date(a.date)).getTime() - (new Date( < string > < unknown > b.date)).getTime()
      ).map(s => new ResponseRow(s)));
    });
  }

  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openResponse(sub: SurveySubmission) {
    window.localStorage.setItem('lastSubmission', JSON.stringify({
      survey: this.survey,
      submission: sub
    }));
    this.router.navigate([`/responses/${sub.surveyId}/${sub.id}`]);
  }

  exportAsJson() {
    this.surveyService.saveJson(
      this.survey, 
      `${this.survey.title}-${this.survey.createdDate}`
    );
  }
}