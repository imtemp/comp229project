/// The possible control types.
export type ControlType = "text-input" | "choice" | "datepicker";
export const CONTROL_TYPES = Object.freeze([
  "text-input",
  "choice",
  "datepicker",
]);
export const CONTROL_TYPES_NAMES = Object.freeze(
  CONTROL_TYPES.map((name, _idx, _arr) => {
    return {
      key: name,
      value: name
        .split("-")
        .map((s, _idx, _arr) => s.charAt(0).toUpperCase() + s.slice(1))
        .join(" "),
    };
  })
);

/// A question in a survey.
export class Question {
  /// The id of the survey this question belongs to.
  public surveyId: string;
  /// The id of the question.
  public id: string;
  /// The default value for the question.
  public defaultValue?: string;
  /// The question prompt that will be displayed to the user.
  public prompt: string;
  /// The value of the `name` field.
  public dataName: string;
  /// The boolean value indicating whether this question must be answered.
  public required: boolean;
  /// The type of the question, e.g. choice, multiple choice
  public controlType: ControlType;
  /// The type of the `input` attribute if the question's UI element is input.
  public inputType?: string;
  /// The questions payload, e.g. the <option>s of a <select>.
  public payload: { key: string; value: string }[];

  constructor(opts: {
    surveyId: string;
    id: string;
    defaultValue?: string;
    prompt: string;
    dataName: string;
    required: boolean;
    controlType: ControlType;
    inputType?: string;
    payload: { key: string; value: string }[];
  }) {
    this.surveyId = opts.surveyId;
    this.id = opts.id;
    this.defaultValue = opts.defaultValue || "";
    this.prompt = opts.prompt;
    this.dataName = opts.dataName;
    this.required = opts.required;
    this.controlType = opts.controlType;
    this.inputType = opts.inputType || "";
    this.payload = opts.payload || [];
  }

  choices(): string[] {
    return this.payload
      .filter(({ key }) => key.startsWith("choice-"))
      .map(({ value }) => value);
  }

  isMultipleChoice(): boolean {
    return (
      this.payload.find(({ key }) => key == "config-multiple")?.value == "true"
    );
  }
}
