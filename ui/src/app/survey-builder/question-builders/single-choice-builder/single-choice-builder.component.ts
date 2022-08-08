import { COMMA, ENTER } from "@angular/cdk/keycodes";
import { CdkDragDrop, moveItemInArray } from "@angular/cdk/drag-drop";
import { Component, Input, OnInit } from "@angular/core";
import {
  AbstractControl,
  Form,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from "@angular/forms";
import { MatChipInputEvent, MatChipList } from "@angular/material/chips";
import { Question } from "src/app/models/question";
import { SurveyQuestionPickerComponent } from "../../survey-question-picker/survey-question-picker.component";
import { QuestionBuilder } from "../question-builder";

@Component({
  selector: "app-single-choice-builder",
  templateUrl: "./single-choice-builder.component.html",
  styleUrls: ["./single-choice-builder.component.css"],
})
export class SingleChoiceBuilderComponent
  extends QuestionBuilder
  implements OnInit {
  readonly MIN_CHOICES = 2;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @Input() questionPicker: SurveyQuestionPickerComponent;

  multiple = false;
  selectable = true;
  addOnBlur = true;
  choices: string[] = [];

  /// This event is fired every time a chip is added.
  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = (event.value || "").trim();
    if (value) {
      this.choices.push(value);
    }
    if (input) {
      input.value = "";
    }

    // We must manually update the value of the chip list to make the custom validator work.
    this.updateChipsValidity();
  }

  /// This event is fired every time a chip is removed.
  remove(choice: string): void {
    const index = this.choices.indexOf(choice);

    if (index >= 0) {
      this.choices.splice(index, 1);
    }

    this.updateChipsValidity();
  }

  /// This event is fired every time a chip is dropped.
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.choices, event.previousIndex, event.currentIndex);
    this.updateChipsValidity();
  }

  updateChipsValidity() {
    this.getControl("choices-chips").setValue(this.choices);
  }

  /// In addition to the parent controls, register the chip controls
  registerControls(form: FormGroup) {
    super.registerControls(form);
    form.addControl(
      this.getControlName("choices-chips"),
      new FormControl("", [this.choiceNumberValidator.bind(this)])
    );
    form.addControl(
      this.getControlName("choices-input"),
      new FormControl("", [])
    );
    form.addControl(this.getControlName("multiple-cb"), new FormControl());
    this.updateChipsValidity();
  }

  /// Remove the chip controls and clear the choices.
  removeControls(form: FormGroup) {
    super.removeControls(form);

    this.choices = [];
    form.removeControl(this.getControlName("choices-chips"));
    form.removeControl(this.getControlName("choices-input"));
    form.removeControl(this.getControlName("multiple-cb"));
  }

  initFromQuestion(q: Question): void {
    this.prompt = q.prompt;
    this.required = q.required;
    this.choices = q.payload
      .filter(({ key }) => key.startsWith("choice-"))
      .map(({ value }) => value);
    this.multiple =
      q.payload.find(({ key }) => key == "config-multiple").value == "true";
  }

  /// Validates the chip list to make sure that the number of options
  /// is equal to or greater than the minimum.
  choiceNumberValidator(control: AbstractControl): ValidationErrors | null {
    return control.value.length < this.MIN_CHOICES
      ? { value: control.value }
      : null;
  }

  buildQuestion(): Question {
    const payload = this.choices.map((c, i) => {
      return { key: `choice-${i}`, value: c };
    });
    payload.push({
      key: "config-multiple",
      value: this.multiple ? "true" : "false",
    });
    return new Question({
      surveyId: "",
      id: "",
      defaultValue: null,
      prompt: this.prompt,
      dataName: `question-#${this.questionPicker.position}`,
      required: this.required,
      controlType: "choice",
      payload: payload,
    });
  }
}
