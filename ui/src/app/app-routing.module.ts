import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { LoginComponent } from "./login/login.component";
import { SurveyBuilderComponent } from "./survey-builder/survey-builder.component";
import { SurveyComponent } from "./survey/survey-component/survey.component";
import { SurveyResolver } from "./survey/survey-component/survey.resolver";
import { AuthGuardService as AuthGuard } from "./auth-guard.service";
import { MySurveysComponent } from "./my-surveys/my-surveys.component";
import { SurveyResponsesComponent } from "./survey/survey-responses/survey-responses.component";
import { SurveyResponseComponent } from "./survey/survey-response/survey-response.component";
import { AboutComponent } from "./about/about.component";
import { SurveyStatsComponent } from './survey/stats/stats.component';

const routes: Routes = [
  {
    path: "survey/:id",
    component: SurveyComponent,
    resolve: { survey: SurveyResolver },
  },
  {
    path: "update/:id",
    component: SurveyBuilderComponent,
    resolve: { existingSurvey: SurveyResolver },
    canActivate: [AuthGuard],
  },
  {
    path: "responses/:id/:response_id",
    component: SurveyResponseComponent,
  },
  {
    path: "stats/:id",
    component: SurveyStatsComponent,
    resolve: { survey: SurveyResolver },
  },
  {
    path: "responses/:id",
    component: SurveyResponsesComponent,
    resolve: { survey: SurveyResolver },
  },
  {
    path: "my-surveys",
    component: MySurveysComponent,
    resolve: { surveys: SurveyResolver },
    canActivate: [AuthGuard],
  },
  {
    path: "new-survey",
    component: SurveyBuilderComponent,
    canActivate: [AuthGuard],
  },
  {
    path: "login",
    component: LoginComponent,
  },
  {
    path: "about",
    component: AboutComponent,
  },
  {
    path: "",
    component: HomeComponent,
    resolve: { surveys: SurveyResolver },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
