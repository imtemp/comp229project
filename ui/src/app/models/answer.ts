/// The answer to a question in a survey.
export class Answer {
    /// The id of the question.
    question: string;
    /// The answer to the question.
    answer: string[];

    constructor(question: string, answer: string | string[]) {
        this.question = question;
        this.answer = typeof answer === 'string' ? [answer] : answer;
    }
}
