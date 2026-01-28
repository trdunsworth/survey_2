import type { SurveyQuestion } from '../types';

/**
 * Conditional Logic Handler for Survey
 * 
 * This utility manages conditional visibility and logic for survey questions.
 * It handles:
 * - Simple yes/no conditionals (single question, single or multiple values)
 * - Nested conditionals (question depends on multiple prior questions)
 * - Complex conditions (AND, OR logic)
 */

export interface ConditionalShowIf {
  questionId: string | number;
  anyOf?: string[];
  allOf?: string[];
  noneOf?: string[];
}

export interface ConditionalLogicRule {
  questionId: string | number;
  condition: 'equals' | 'notEquals' | 'contains' | 'anyOf' | 'allOf';
  values: string[];
  logic?: 'AND' | 'OR';
}

/**
 * Check if a question should be visible based on the provided answers
 * 
 * @param question - The question to check
 * @param answers - The collected survey answers
 * @returns true if the question should be visible, false otherwise
 */
export const shouldQuestionBeVisible = (
  question: SurveyQuestion,
  answers: Record<string, string | string[] | number>
): boolean => {
  if (!question.showIf) {
    return true;
  }

  return evaluateShowCondition(question.showIf, answers);
};

/**
 * Evaluate a show condition against collected answers
 * 
 * @param showIf - The conditional visibility rule
 * @param answers - The collected survey answers
 * @returns true if the condition is met, false otherwise
 */
export const evaluateShowCondition = (
  showIf: ConditionalShowIf,
  answers: Record<string, string | string[] | number>
): boolean => {
  const answerValue = answers[`q_${showIf.questionId}`];

  if (answerValue === undefined) {
    return false;
  }

  // Check anyOf condition (at least one value matches)
  if (showIf.anyOf && showIf.anyOf.length > 0) {
    if (Array.isArray(answerValue)) {
      // For checkbox questions, check if any of the anyOf values are in the answer
      return showIf.anyOf.some((val) => answerValue.includes(val));
    } else {
      // For radio or select, check if the answer is in anyOf
      return showIf.anyOf.includes(String(answerValue));
    }
  }

  // Check allOf condition (all values must match)
  if (showIf.allOf && showIf.allOf.length > 0) {
    if (Array.isArray(answerValue)) {
      // For checkbox questions, all values must be selected
      return showIf.allOf.every((val) => answerValue.includes(val));
    } else {
      // For single-value questions, allOf doesn't make sense but check equality
      return showIf.allOf.includes(String(answerValue));
    }
  }

  // Check noneOf condition (none of the values should match)
  if (showIf.noneOf && showIf.noneOf.length > 0) {
    if (Array.isArray(answerValue)) {
      // For checkbox questions, none of the values should be selected
      return !showIf.noneOf.some((val) => answerValue.includes(val));
    } else {
      // For radio or select, the answer should not be in noneOf
      return !showIf.noneOf.includes(String(answerValue));
    }
  }

  return true;
};

/**
 * Create a human-readable description of a conditional logic rule
 * Useful for documentation and UI explanations
 * 
 * @param question - The question with conditional logic
 * @returns A readable description of the condition
 */
export const getConditionalDescription = (question: SurveyQuestion): string => {
  if (!question.showIf) {
    return '';
  }

  const { questionId, anyOf, allOf, noneOf } = question.showIf;
  let description = `This question appears when Question ${questionId}`;

  if (anyOf && anyOf.length > 0) {
    description += ` is answered with: ${anyOf.join(' or ')}`;
  } else if (allOf && allOf.length > 0) {
    description += ` includes all of: ${allOf.join(' and ')}`;
  } else if (noneOf && noneOf.length > 0) {
    description += ` is NOT answered with: ${noneOf.join(' or ')}`;
  }

  return description;
};

/**
 * Validate conditional logic doesn't create circular dependencies
 * 
 * @param questions - All survey questions
 * @returns Array of validation errors, empty if valid
 */
export const validateConditionalLogic = (questions: SurveyQuestion[]): string[] => {
  const errors: string[] = [];
  const questionMap = new Map(questions.map((q) => [q.id, q]));
  const visited = new Set<string | number>();

  const hasCycle = (questionId: string | number, path: Set<string | number>): boolean => {
    if (path.has(questionId)) {
      return true;
    }

    const question = questionMap.get(questionId);
    if (!question || !question.showIf) {
      return false;
    }

    path.add(questionId);
    const hasCyclicDep = hasCycle(question.showIf.questionId, new Set(path));
    path.delete(questionId);

    return hasCyclicDep;
  };

  for (const question of questions) {
    if (question.showIf && !visited.has(question.id)) {
      visited.add(question.id);
      if (hasCycle(question.id, new Set())) {
        errors.push(`Question ${question.id} has circular conditional dependency`);
      }
    }
  }

  // Validate that referenced questions exist
  for (const question of questions) {
    if (question.showIf) {
      if (!questionMap.has(question.showIf.questionId)) {
        errors.push(
          `Question ${question.id} references non-existent question ${question.showIf.questionId}`
        );
      }
    }
  }

  return errors;
};

/**
 * Example conditional logic for the survey:
 * 
 * Question 7: "Does the PSAP provide any additional services beyond the ones listed?"
 *   - Type: radio
 *   - Options: ["Yes", "No"]
 * 
 * Question 7.1: "Please list any additional services..."
 *   - Visible when: Question 7 = "Yes"
 *   - showIf: { questionId: 7, anyOf: ["Yes"] }
 * 
 * Question 7.2: "How many hours per week are spent on these additional services?"
 *   - Visible when: Question 7 = "Yes"
 *   - showIf: { questionId: 7, anyOf: ["Yes"] }
 */
