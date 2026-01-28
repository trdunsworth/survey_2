import type {
  SurveyData,
  SurveySection,
  SurveyQuestion,
  SurveyJSModel,
  SurveyJSPage,
  SurveyJSQuestion,
} from '../types';
import { evaluateShowCondition, validateConditionalLogic } from './conditionalLogic';

/**
 * Convert custom survey format to SurveyJS format
 */
export const convertToSurveyJS = (
  section: SurveySection,
  sectionIndex: number
): SurveyJSModel => {
  // Validate conditional logic before converting
  const validationErrors = validateConditionalLogic(section.questions);
  if (validationErrors.length > 0) {
    console.warn('Survey conditional logic validation warnings:', validationErrors);
  }

  const pages: SurveyJSPage[] = [
    {
      name: `page_${sectionIndex}`,
      title: section.title,
      elements: section.questions.map((q) => convertQuestion(q)),
    },
  ];

  return {
    title: section.title,
    pages,
    showProgressBar: 'top',
    progressBarType: 'pages',
    completeText: 'Complete Section',
    showQuestionNumbers: 'on',
  };
};

/**
 * Convert a single question to SurveyJS format
 */
const convertQuestion = (question: SurveyQuestion): SurveyJSQuestion => {
  const baseQuestion: SurveyJSQuestion = {
    name: `q_${question.id}`,
    title: question.text,
    description: question.description,
    type: getSurveyJSType(question.type),
  };

  // Add choices for selection-based questions
  if (question.options && question.options.length > 0) {
    baseQuestion.choices = question.options;

    // For dropdown/select type, use renderAs to ensure proper rendering
    if (question.type === 'select') {
      // Use native HTML select for better browser compatibility
      (baseQuestion as { renderAs?: string }).renderAs = 'select';
    }

    // Enable "other" option if present
    if (question.options.some((opt) => opt.toLowerCase().includes('other'))) {
      (baseQuestion as { hasOther?: boolean }).hasOther = true;
    }
  }

  // Add conditional visibility
  if (question.showIf) {
    baseQuestion.visibleIf = createVisibilityCondition(question.showIf);
  }

  // Handle special question types
  if (question.type === 'agencies-with-count') {
    return createAgenciesQuestion(question);
  }

  // Set input type for text fields
  if (question.type === 'number') {
    baseQuestion.inputType = 'number';
  }

  // Make non-info questions required
  if (question.type !== 'info') {
    baseQuestion.isRequired = false; // Allow users to skip questions
  }

  return baseQuestion;
};

/**
 * Map custom question types to SurveyJS types
 */
const getSurveyJSType = (type: SurveyQuestion['type']): string => {
  const typeMap: Record<string, string> = {
    info: 'html',
    select: 'dropdown',
    radio: 'radiogroup',
    checkbox: 'checkbox',
    text: 'text',
    number: 'text',
    'agencies-with-count': 'matrixdynamic',
  };

  return typeMap[type] || 'text';
};

/**
 * Create visibility condition for SurveyJS
 * Converts our conditional format to SurveyJS visibleIf syntax
 */
const createVisibilityCondition = (showIf: SurveyQuestion['showIf']): string => {
  if (!showIf) return '';

  const { questionId, anyOf, allOf, noneOf } = showIf;
  const qName = `q_${questionId}`;

  // Handle anyOf (at least one value matches)
  if (anyOf && anyOf.length > 0) {
    const conditions = anyOf.map((value) => `{${qName}} = '${value}'`);
    return conditions.join(' or ');
  }

  // Handle allOf (all values must match) - only applicable for checkbox arrays
  if (allOf && allOf.length > 0) {
    const conditions = allOf.map((value) => `{${qName}} contains '${value}'`);
    return conditions.join(' and ');
  }

  // Handle noneOf (none of the values should match)
  if (noneOf && noneOf.length > 0) {
    const conditions = noneOf.map(
      (value) => `{${qName}} != '${value}'`
    );
    return conditions.join(' and ');
  }

  return '';
};

/**
 * Create a matrix dropdown question for agencies with counts
 */
const createAgenciesQuestion = (question: SurveyQuestion): SurveyJSQuestion => {
  // For agencies-with-count, we want a matrix where each agency is a row
  // and users can enter the count for each
  return {
    name: `q_${question.id}`,
    title: question.text,
    type: 'matrixdropdown',
    rows: question.options,
    columns: [
      {
        name: 'count',
        title: 'Number of Agencies',
        cellType: 'text',
        inputType: 'number',
      },
    ],
    isRequired: false,
  };
};

/**
 * Split survey sections into logical groups
 */
export const groupSurveysByCategory = (surveyData: SurveyData): SurveySection[] => {
  // Return all sections as they are already well-organized
  return surveyData.sections.filter(
    (section) => section.title !== 'Welcome' && section.title !== 'Closing'
  );
};

/**
 * Get welcome section
 */
export const getWelcomeSection = (surveyData: SurveyData): SurveySection | undefined => {
  return surveyData.sections.find((section) => section.title === 'Welcome');
};

/**
 * Get closing section
 */
export const getClosingSection = (surveyData: SurveyData): SurveySection | undefined => {
  return surveyData.sections.find((section) => section.title === 'Closing');
};

/**
 * Create a URL-friendly ID from section title
 */
export const createSectionId = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
};
