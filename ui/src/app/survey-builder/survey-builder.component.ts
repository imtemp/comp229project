import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ComponentFactory,
  ComponentFactoryResolver,
  ComponentRef,
  Input,
  OnInit,
  ViewChild,
  ViewContainerRef,
} from "@angular/core";
import {
  FormControl,
  FormGroup,
  Validators
} from "@angular/forms";
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {
  ActivatedRoute,
  Router
} from "@angular/router";
import {
  Question
} from "src/app/models/question";
import {
  Survey
} from "src/app/models/survey";
import {
  SurveyService
} from "../survey/survey-component/survey.service";
import {
  UserService
} from "../user.service";
import {
  SurveyQuestionPickerComponent
} from "./survey-question-picker/survey-question-picker.component";

@Component({
  selector: "app-survey-builder",
  templateUrl: "./survey-builder.component.html",
  styleUrls: ["./survey-builder.component.scss"],
})
export class SurveyBuilderComponent implements OnInit, AfterViewInit {
  @ViewChild("qpInsertionPoint", {
    read: ViewContainerRef
  })
  qpInsertionPoint: ViewContainerRef;

  /// An already existing survey to pre-populate the builder.
  @Input() existingSurvey: Survey = null;

  /// Whether this survey has an ending date
  displayDatePicker: boolean = false;

  surveyForm = new FormGroup({
    surveyName: new FormControl("", [Validators.required]),
    surveyEndDate: new FormControl("", []),
  });
  questions: SurveyQuestionPickerComponent[];
  questionFactory: ComponentFactory < SurveyQuestionPickerComponent > ;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private surveyService: SurveyService,
    private userService: UserService,
    private resolver: ComponentFactoryResolver,
    private cdr: ChangeDetectorRef,
    private snackBar: MatSnackBar,
  ) {
    this.route.data.subscribe((data: {
      existingSurvey: Survey
    }) => {
      this.existingSurvey = data.existingSurvey;
    });
  }

  ngOnInit(): void {
    this.questions = [];
    this.questionFactory = this.resolver.resolveComponentFactory(
      SurveyQuestionPickerComponent
    );

    if (this.existingSurvey) {
      this.surveyNameControl.setValue(this.existingSurvey.title);
      this.surveyEndDateControl.setValue(this.existingSurvey.endDate);
      this.displayDatePicker = this.existingSurvey.endDate ? true : false;
    }
  }

  ngAfterViewInit(): void {
    if (!this.existingSurvey) {
      return;
    }

    this.existingQuestions.forEach(({
      i,
      q
    }: {
      i: number;q: Question
    }) => {
      const ref = this.createNewQuestionPicker();
      ref.instance.questionToInitFrom = q;
      ref.instance.removable = i >= 0;
      ref.instance.controlType = q.controlType;
    });

    this.cdr.detectChanges();
  }

  /// Adds a new question picker to the list. Returns the new number of QPs.
  addQuestionPicker(qp: SurveyQuestionPickerComponent): number {
    this.questions.push(qp);
    return this.questions.length;
  }

  /// Creates a new SurveyQuestionPickerComponent and inserts it
  /// at #qpInsertionPoint.
  createNewQuestionPicker(): ComponentRef < SurveyQuestionPickerComponent > {
    const ref = this.qpInsertionPoint.createComponent(this.questionFactory);
    ref.instance.parent = this;
    ref.instance.removable = true;
    ref.instance.onDeleteClicked = () => {
      // Remove the question object from the array
      this.questions.splice(ref.instance.position - 1, 1);
      // Destroy the picker component
      ref.destroy();
      // Update the position badges
      this.questions.forEach((v, i) => (v.position = i + 1));
    };
    return ref;
  }

  toggleEndDate() {
    this.displayDatePicker = !this.displayDatePicker;
    // TODO: figure a nice way to supports this in the view
    // const control = this.surveyForm.get("surveyEndDate");
    // control.setValidators(this.endDateRequired ? Validators.required : []);
    // control.updateValueAndValidity();
  }

  get surveyNameControl() {
    return this.surveyForm.get("surveyName");
  }

  get surveyEndDateControl() {
    return this.surveyForm.get("surveyEndDate");
  }

  get existingQuestions(): {
    i: number;q: Question
  } [] {
    return (this.existingSurvey?.questions || []).map((q, i) => {
      return {
        i: i,
        q: q
      };
    });
  }

  create() {
    const questions = this.questions.map((q) => q.buildQuestion());
    const survey = new Survey({
      id: this.existingSurvey?.id || null,
      creator: this.userService.getUser().id,
      title: this.surveyNameControl.value,
      createdDate: new Date(Date.now()), // TODO: handle timezones
      endDate: this.surveyEndDateControl.value,
      questions: questions,
    });
    this.surveyService.createSurvey(survey).subscribe((res) => {
      this.router.navigateByUrl("/my-surveys");
    });
  }

  update() {
    const questions = this.questions.map((q) => q.buildQuestion());

    const survey = new Survey({
      id: this.existingSurvey.id,
      creator: this.userService.getUser().id,
      title: this.surveyNameControl.value,
      createdDate: this.existingSurvey.createdDate,
      endDate: this.surveyEndDateControl.value,
      questions: questions,
    });

    this.surveyService.updateSurvey(survey).subscribe((res) => {
      this.router.navigateByUrl("/my-surveys");
    }, (e) => {
      this.snackBar.open(`Couldn't update the survey: ${e.error.error}`, 'Close', {
        duration: 5000,
        panelClass: ['mat-toolbar', 'mat-warn', 'style-error']
      });
    });
  }

  delete() {
    this.surveyService.deleteSurvey(this.existingSurvey.id).subscribe((res) => {
      this.router.navigateByUrl("/my-surveys");
    }, (e) => {
      this.snackBar.open(`Couldn't delete the survey: ${e.error.error}`, 'Close', {
        duration: 5000,
        panelClass: ['mat-toolbar', 'mat-warn', 'style-error']
      });
    });
  }
}