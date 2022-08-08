import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Survey } from '../models/survey';
import { User } from '../models/user';
import { SurveyService } from '../survey/survey-component/survey.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-my-surveys',
  templateUrl: './my-surveys.component.html',
  styleUrls: ['./my-surveys.component.css']
})
export class MySurveysComponent implements OnInit, AfterViewInit {
  user: User;
  surveys: Survey[]
  displayedColumns: string[] = ['created', 'title', 'stats', 'responses', 'edit', 'delete'];

  dataSource: MatTableDataSource<Survey>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatTable) table: MatTable<Survey>;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private surveyService: SurveyService
  ) {
    this.dataSource = new MatTableDataSource([]);
    this.route.data.subscribe((data: { surveys: { data: Survey[] } }) => {
      this.surveys = data.surveys.data;
      this.dataSource.data =this.surveys;
    });
  }
  

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();
  }

  get username(): string {
    const u = this.user.username;
    return u.charAt(0).toUpperCase() + u.slice(1);
  }

  getCreatedDate(survey: Survey): string {
    return new Date(survey.createdDate).toLocaleDateString();
  }

  delete(id: string) {
    this.surveyService.deleteSurvey(id).subscribe(_ => {
      const index = this.surveys.findIndex((s) => s.id == id);
      this.surveys.splice(index, 1);
      this.dataSource.data = this.surveys;
      this.table.renderRows();
    });
  }
}
