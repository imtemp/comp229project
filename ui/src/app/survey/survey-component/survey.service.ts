import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormArray, FormControl, FormGroup, Validators } from "@angular/forms";
import { tap } from "rxjs/operators";
import { CONTROL_TYPES, Question } from "src/app/models/question";
import { SurveySubmission } from 'src/app/models/survey_submission';
import { API_URL } from "src/environments/environment";
import { Survey } from "../../models/survey";

@Injectable({
  providedIn: "root",
})
export class SurveyService {
  private authOptions = { withCredentials: true };

  constructor(private http: HttpClient) { }

  fetchSurvey(id: string, includeSubmissions: boolean = false) {
    return this.http.get<Survey>(
      `${API_URL}/surveys/by/id/${id}?includeSubmissions=${includeSubmissions}`,
      this.authOptions
    );
  }

  listSurveys() {
    return this.http.get<{ data: Survey[] }>(
      `${API_URL}/surveys/list`,
      this.authOptions
    );
  }

  listUserSurveys(userId: string) {
    // TODO: replace this with  surveys/by/user/${userId} when #29 lands.
    return this.http.get<{ data: Survey[] }>(`${API_URL}/surveys/list`).pipe(
      tap((s) => {
        s.data = s.data.filter((s) => {
          return typeof s.creator === "string"
            ? s.creator == userId
            : s.creator.id == userId;
        });
      })
    );
  }

  createSurvey(survey: Survey) {
    return this.http.post(
      `${API_URL}/surveys/create`,
      survey,
      this.authOptions
    );
  }

  updateSurvey(survey: Survey) {
    return this.http.put(`${API_URL}/surveys/update`, survey, this.authOptions);
  }

  deleteSurvey(surveyId: string) {
    return this.http.delete(
      `${API_URL}/surveys/delete/${surveyId}`,
      this.authOptions
    );
  }

  submitSurvey(submission: SurveySubmission) {
    return this.http.post(
      `${API_URL}/surveys/submit/${submission.surveyId}`,
      submission,
      this.authOptions
    );
  }

  toFormGroup(survey: Survey) {
    const group: any = {};

    survey.questions.forEach((questionData) => {
      const question = new Question({ ...questionData });
      if (question.controlType == "choice" && question.isMultipleChoice()) {
        group[question.dataName] = new FormArray(
          question.choices().map((_) => new FormControl(false)),
          question.required
            ? (arr: FormArray) => this.formArrayRequiredValidator(arr)
            : []
        );
      } else {
        const validators = question.required ? Validators.required : [];
        group[question.dataName] = new FormControl(
          question.defaultValue || "",
          validators
        );
      }
    });

    return new FormGroup(group);
  }

  private formArrayRequiredValidator(arr: FormArray) {
    const arrayValues = arr.controls.map((c) => c.value);
    if (arrayValues.reduce((acc, x) => acc || x, false)) {
      return null;
    }

    return { arrayValues: arrayValues };
  }

  public saveJson(json: any, filename: string) {
    var data = new Blob([JSON.stringify(json)], {
      type: 'application/json'
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
  }
}
