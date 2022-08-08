import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Question } from 'src/app/models/question';
import { SurveyQuestionPickerComponent } from '../survey-question-picker/survey-question-picker.component';

// TODO: suppress the lint
@Component({ template: "" })
export abstract class QuestionBuilder implements OnInit {
    abstract questionPicker: SurveyQuestionPickerComponent;
    public required: boolean = false;
    public prompt: string;

    ngOnInit(): void {
        this.questionPicker.question = this;
    }

    /// Register the form controls that this builder uses.
    registerControls(form: FormGroup): void {
        form.addControl(this.getControlName('prompt-input'), new FormControl('', [Validators.required]));
        form.addControl(this.getControlName('required-cb'), new FormControl());
    }

    /// Remove the form controls that this builder uses.
    removeControls(form: FormGroup) {
        form.removeControl(this.getControlName('prompt-input'));
        form.removeControl(this.getControlName('required-cb'));
    }

    /// Generate a random control name.
    getControlName(name: string): string {
        return `${name}-${this.questionPicker.ID}`;
    }

    /// Returns a control by its name, using the `getControlName` method.
    getControl(name: string) {
        return this.questionPicker.parent.surveyForm.get(this.getControlName(name));
    }

    /// Initialize the builder from an existing question.
    abstract initFromQuestion(q: Question): void;

    /// Build a new `Question`.
    abstract buildQuestion(): Question;
}
