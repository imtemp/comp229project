import { Component, Input, OnInit } from "@angular/core";
import { FormArray } from "@angular/forms";
import { SurveyQuestionContainerComponent } from "../../question-container/question-container.component";
import { QuestionInput } from "../question-input";

@Component({
  selector: "app-question-choice-input",
  templateUrl: "./question-choice-input.component.html",
  styleUrls: ["./question-choice-input.component.css"],
})
export class QuestionChoiceInputComponent
  extends QuestionInput
  implements OnInit {
  @Input() parent: SurveyQuestionContainerComponent;
  choices: { key: string; value: string }[];
  multiple: boolean;
  controlArray: FormArray;

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.choices = this.question.payload.filter(({ key }) =>
      key.startsWith("choice-")
    );
    this.multiple =
      this.question.payload.find(({ key }) => key == "config-multiple").value ==
      "true";
    this.controlArray = this.parent.form.get(
      this.question.dataName
    ) as FormArray;
  }

  onCheckChange(event: {
    source: { value: any /* MatCheckBox */ };
    checked: any;
  }) {
    const formArray: FormArray = this.parent.form.get(
      this.question.dataName
    ) as FormArray;

    // TODO: find a better way to do this
    const value = event.source.value;
    const index = Number.parseInt(value.split("-").pop());
    const control = formArray.controls[index];

    if (event.checked) {
      control.setValue(value);
    } else {
      control.setValue(false);
    }
  }
}
