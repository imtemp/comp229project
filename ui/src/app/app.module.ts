import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";
import { MatButtonModule } from "@angular/material/button";
import { MatRadioModule } from "@angular/material/radio";
import { MatDividerModule } from "@angular/material/divider";
import { MatIconModule } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatInputModule } from "@angular/material/input";
import { MatCardModule } from "@angular/material/card";
import { MatSelectModule } from "@angular/material/select";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatTableModule } from "@angular/material/table";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatBadgeModule } from "@angular/material/badge";
import { MatDialogModule } from "@angular/material/dialog";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatChipsModule } from "@angular/material/chips";
import { MatNativeDateModule } from "@angular/material/core";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from "@angular/material/form-field";
import { ChartsModule } from 'ng2-charts';

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { SurveyComponent } from "./survey/survey-component/survey.component";
import { SurveyQuestionContainerComponent } from "./survey/question-container/question-container.component";
import { SurveyBuilderComponent } from "./survey-builder/survey-builder.component";
import { SurveyQuestionPickerComponent } from "./survey-builder/survey-question-picker/survey-question-picker.component";
import { TextInputBuilderComponent } from "./survey-builder/question-builders/text-input-builder/text-input-builder.component";
import { SingleChoiceBuilderComponent } from "./survey-builder/question-builders/single-choice-builder/single-choice-builder.component";
import { DatepickerBuilderComponent } from "./survey-builder/question-builders/datepicker-builder/datepicker-builder.component";
import { QuestionTextInputComponent } from "./survey/questions/question-text-input/question-text-input.component";
import { LoginComponent } from "./login/login.component";
import { SpinnerDialogComponent } from "./spinner-dialog/spinner-dialog.component";
import { QuestionChoiceInputComponent } from "./survey/questions/question-choice-input/question-choice-input.component";
import { QuestionDatepickerInputComponent } from "./survey/questions/question-datepicker-input/question-datepicker-input.component";
import { DragDropModule } from "@angular/cdk/drag-drop";
import { MySurveysComponent } from "./my-surveys/my-surveys.component";
import { AboutComponent } from "./about/about.component";
import { SurveyResponsesComponent } from "./survey/survey-responses/survey-responses.component";
import { SurveyResponseComponent } from "./survey/survey-response/survey-response.component";
import { SurveyStatsComponent } from './survey/stats/stats.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    SurveyComponent,
    SurveyQuestionContainerComponent,
    SurveyQuestionPickerComponent,
    QuestionTextInputComponent,
    LoginComponent,
    SpinnerDialogComponent,

    // Question Builders
    SurveyBuilderComponent,
    TextInputBuilderComponent,
    SingleChoiceBuilderComponent,
    QuestionChoiceInputComponent,
    MySurveysComponent,
    DatepickerBuilderComponent,
    QuestionDatepickerInputComponent,
    AboutComponent,
    SurveyResponsesComponent,
    SurveyResponseComponent,
    SurveyStatsComponent,
  ],
  imports: [
    AppRoutingModule,
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatInputModule,
    MatCardModule,
    MatSelectModule,
    MatCheckboxModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatDialogModule,
    MatChipsModule,
    DragDropModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    ChartsModule,
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: { appearance: "outline" },
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
