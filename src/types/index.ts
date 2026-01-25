// Types for Survey Data
export interface SurveyQuestion {
  id: number | string;
  text: string;
  description?: string;
  options: string[];
  type: 'info' | 'select' | 'radio' | 'checkbox' | 'text' | 'number' | 'agencies-with-count';
  showIf?: {
    questionId: number | string;
    anyOf: string[];
  };
}

export interface SurveySection {
  title: string;
  questions: SurveyQuestion[];
}

export interface SurveyData {
  title: string;
  sections: SurveySection[];
}

// Types for Glossary
export interface GlossaryTerm {
  term: string;
  definition: string;
}

// Types for User Session
export interface UserSession {
  userId: string;
  createdAt: string;
  completedSurveys: string[];
}

// Types for Survey Results
export interface SurveyResult {
  userId: string;
  surveyId: string;
  surveyTitle: string;
  startTime: string;
  completionTime: string;
  responses: Record<string, unknown>;
  percentComplete: number;
}

// SurveyJS Model Types
export interface SurveyJSQuestion {
  name: string;
  title: string;
  description?: string;
  type: string;
  choices?: string[] | { value: string; text: string }[];
  inputType?: string;
  isRequired?: boolean;
  visibleIf?: string;
  columns?: Array<{ name: string; title: string; cellType?: string; inputType?: string }>;
  rows?: string[];
}

export interface SurveyJSPage {
  name: string;
  title?: string;
  elements: SurveyJSQuestion[];
}

export interface SurveyJSModel {
  title: string;
  pages: SurveyJSPage[];
  showProgressBar?: string;
  progressBarType?: string;
  completeText?: string;
  showQuestionNumbers?: string;
}
