import {
  Component,
  OnInit
} from '@angular/core';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { Accent6 } from 'chartjs-plugin-colorschemes/src/colorschemes/colorschemes.brewer';

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
  SurveyService
} from '../survey-component/survey.service';


interface IChart {
  data: any[]; // TODO: more specific type
  labels: string[];
  legend: boolean;
  type: string;
  question: Question;
  options: any;
  stats: any;
}

class RoundRobinPalette 
{
  private current: number;
  private opacity: string;

  constructor(public palette: string[], opacity: number = 0.6) {
    this.current = 0;
    this.opacity = ((255 * opacity) | 0).toString(16);
  }

  next(): string {
    return this.palette[this.current++ % this.palette.length] + this.opacity;
  }
}

@Component({
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.css']
})
export class SurveyStatsComponent implements OnInit {
  private chartOptions = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  survey: Survey;
  charts: IChart[]; // TODO: a precise type
  id2q: Record < string, Question > ;
  id2idx: Record < string, number > ;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService
  ) {
    this.route.data.subscribe((data: {
      survey: Survey
    }) => {
      this.survey = data.survey;
      this.id2q = {};
      this.id2idx = {};
      this.charts = [];
      this.survey.questions.forEach((q, i) => {
        this.id2q[q.id] = new Question(q);
        this.id2idx[q.id] = i;
        this.charts.push({
          question: q,
          data: [],
          labels: [],
          legend: true,
          type: "bar",
          options: this.chartOptions,
          stats: undefined,
        });
      });

      this.computeAnswerStats();
    });
  }

  ngOnInit(): void {}

  computeAnswerStats() {
    this.computeStats();
    this.generateCharts();
  }

  computeStats() {
    for (const sub of this.survey.submissions) {
      for (const a of < Answer[] > sub.answers) {
        const q = this.id2q[a.question];
        const chart = this.charts[this.id2idx[a.question]];

        if (q.controlType == "text-input") {
          if (!chart.stats) {
            chart.stats = {
              min: 2 ** 32 - 1,
              max: 0,
              avg: 0,
              count: 0,
            };
          }
          const length = a.answer[0].length;
          chart.stats.min = Math.min(chart.stats.min, length);
          chart.stats.max = Math.max(chart.stats.max, length);
          chart.stats.avg += length;
          chart.stats.count += 1;
        } else if (q.controlType == "choice") {
          if (!chart.stats) {
            chart.stats = {
              data: {},
              count: 0
            };
          }
          for (const choice of a.answer) {
            chart.stats.data[choice] = (chart.stats.data[choice] || 0) + 1;
          }
          chart.stats.count += 1;
        } else if (q.controlType == "datepicker") {
          if (!chart.stats) {
            chart.stats = {
              data: {},
              count: 0,
            }
          }
          const date = new Date(Date.parse(a.answer[0]));
          const day = date.getDate();
          const month = date.getMonth();
          const year = date.getFullYear();
          const dateString = `${month}/${day}/${year}`;
          chart.stats.data[dateString] = (chart.stats.data[dateString] || 0) + 1;
          chart.stats.count += 1;
        } else {
          throw new Error("Unreachable");
        }
      }
    }
  }

  generateCharts() {
    for (const sub of this.survey.submissions) {
      for (const a of < Answer[] > sub.answers) {
        const q = this.id2q[a.question];
        const chart = this.charts[this.id2idx[a.question]];

        if (q.controlType == "text-input") {
          chart.labels = [`Response Length (${chart.stats.count} responses)`]
          chart.data = [{
              data: [chart.stats.min],
              label: 'Min',
              stack: 'a'
            }, {
              data: [chart.stats.avg / chart.stats.count],
              label: 'Avg',
              stack: 'a'
            },
            {
              data: [chart.stats.max],
              label: 'Max',
              stack: 'a'
            }
          ];
          chart.options = {
            ...chart.options,
            scales: { 
              xAxes: [{
                stacked: true,
                id: "bar-x-axis1",
              }, {
                display: false,
                stacked: true,
                id: "bar-x-axis2",
                type: 'category',
                gridLines: {
                  offsetGridLines: true
                },
                offset: true
              }],
              yAxes: [{
                stacked: false,
                ticks: {
                  beginAtZero: true
                },
              }]
            }
          };
        } else if (q.controlType == "choice") {
          chart.labels = [];
          chart.data = [{
            data: [],
            label: `Responses (${q.isMultipleChoice() ? 'multiple choice' : 'single choice'})`,
            backgroundColor: [],
          }];
          const palette = new RoundRobinPalette(Accent6);

          q.payload
            .filter(({ key }) => key.startsWith("choice-"))
            .sort((a: { key: string }, b: { key: string }) => {
              return a.key.localeCompare(b.key);
            })
            .forEach((v: { key: string, value: string }) => {
              chart.data[0].data.push(chart.stats.data[v.key] || 0);
              chart.labels.push(v.value);
              chart.data[0].backgroundColor.push(palette.next());
          });
          chart.options = {
            ...chart.options,
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                }
              }]
            }
          };
        } else if (q.controlType == "datepicker") {
          chart.labels = [];
          chart.data = [{
            data: [],
            label: `Picked Dates (${chart.stats.count} dates)`,
            backgroundColor: [],
          }];
          const palette = new RoundRobinPalette(Accent6);

          Object.entries(chart.stats.data)
            .sort((a: [string, string], b: [string, string]) =>
              new Date(a[0]).getTime() - new Date(b[0]).getTime()
            ).forEach((a: [string, string]) => {
              chart.labels.push(a[0]);
              chart.data[0].backgroundColor.push(palette.next());
              chart.data[0].data.push(a[1]);
            });
          chart.options = {
            ...chart.options,
            scales: {
              yAxes: [{
                display: true,
                ticks: {
                  suggestedMin: 0,
                }
              }]
            }
          }
        } else {
          throw new Error("Unreachable");
        }
      }
    }

    for (const chart of this.charts) {
      if (chart.labels.length === 0) {
        chart.labels = ["No Data"];
        chart.legend = false;
      }
    }
  }

}
