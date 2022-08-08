import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Survey } from '../models/survey';

class SurveyRow {
  constructor(public survey: Survey) { }

  get id(): string {
    return this.survey.id;
  }

  get title(): string {
    return this.survey.title;
  }

  get creator(): string {
    if (typeof this.survey.creator === 'string') {
      console.log("This shouldn't have happened");
      throw new Error("User object hasn't been fetched from the server.");
    }
    return this.survey.creator.username;
  }

  get endDate(): string {
    let date = this.endDateObj;

    if (date) {
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      const msg = this.isEndingSoon ? " (ends soon)" : "";
      return `${month}/${day}/${year}${msg}`;
    }

    return 'N/A';
  }

  get endDateObj(): Date | null {
    const date = this.survey.endDate;
    if (date && typeof date === 'string') {
      return new Date(Date.parse(date));
    }
    return null;
  }

  get isEndingSoon(): boolean {
    const secondsInADay = 24 * 60 * 60 * 1000;
    const today = new Date().getTime()
    const endDate = this.endDateObj;
    return endDate && endDate.getTime() - today <= secondsInADay * 2;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
  surveys: SurveyRow[]
  displayedColumns: string[] = ['title', 'creator', 'endDate', 'answer'];

  dataSource: MatTableDataSource<SurveyRow>;
  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(
    private route: ActivatedRoute,
  ) {
    this.route.data.subscribe((data: { surveys: { data: Survey[] } }) => {
      this.surveys = data.surveys.data.sort((a, b) => {
        return (new Date(b.createdDate)).getTime() - (new Date(a.createdDate)).getTime();
      }).map(s => new SurveyRow(s))
      this.dataSource = new MatTableDataSource(this.surveys);
    })
  }
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
  }
}
