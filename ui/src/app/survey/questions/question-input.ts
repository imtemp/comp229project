import { FormGroup } from '@angular/forms';
import { SurveyQuestionContainerComponent } from '../question-container/question-container.component';
import { Question } from 'src/app/models/question';

export abstract class QuestionInput {
    abstract parent: SurveyQuestionContainerComponent;

    get question(): Question {
        return this.parent.question;
    }

    get form(): FormGroup {
        return this.parent.form;
    }

    get answer(): string {
        return this.parent.answer;
    }
}