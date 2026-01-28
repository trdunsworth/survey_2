/**
 * Conditional Logic Examples and Tests
 * 
 * This file demonstrates how the conditional logic system works
 * and provides examples for different conditional scenarios.
 */

// ============================================================================
// EXAMPLE 1: Simple Yes/No Conditional (Question 7 Pattern)
// ============================================================================

/**
 * Parent Question: Yes/No selection
 */
export const question7Example = {
  id: 7,
  text: "Does the PSAP provide any additional services beyond the ones listed in question 6?",
  description: "This helps identify if there are additional services to document.",
  options: ["Yes", "No"],
  type: "radio" as const,
};

/**
 * Dependent Question 7.1: Shows only when Q7 = "Yes"
 */
export const question7_1Example = {
  id: 7.1,
  text: "Please list any additional services that you provide:",
  description: "Provide details about these additional services.",
  options: [],
  type: "text" as const,
  showIf: {
    questionId: 7,
    anyOf: ["Yes"],
  },
};

/**
 * Dependent Question 7.2: Shows only when Q7 = "Yes"
 */
export const question7_2Example = {
  id: 7.2,
  text: "How many hours per week are spent on these additional services?",
  description: "This helps us understand the impact on staffing.",
  options: [],
  type: "number" as const,
  showIf: {
    questionId: 7,
    anyOf: ["Yes"],
  },
};

// ============================================================================
// EXAMPLE 2: Multiple Option Conditional
// ============================================================================

/**
 * Parent Question: Multi-option selection
 */
export const question8Example = {
  id: 8,
  text: "What is the PSAP operational governance:",
  options: [
    "Federal Government (Airport, Tribal, LEO, Military, Other)",
    "State Government (LEO, Other)",
    "County Government (Sheriff, Fire, EMS, Other)",
    "Municipal Government (Fire, EMS, LEO, Other)",
    "Independent Tax Funded Authority",
    "Private",
    "Other (Please Specify)",
  ],
  type: "select" as const,
};

/**
 * Dependent Question 8.1: Shows only when Q8 is one of several governance types
 */
export const question8_1Example = {
  id: 8.1,
  text: "Which specific agencies fall under this governance:",
  options: ["Police", "Sheriff", "Fire", "EMS", "Airport", "Tribal", "Military", "Other (Please Specify)"],
  type: "checkbox" as const,
  showIf: {
    questionId: 8,
    anyOf: [
      "Federal Government (Airport, Tribal, LEO, Military, Other)",
      "State Government (LEO, Other)",
      "County Government (Sheriff, Fire, EMS, Other)",
      "Municipal Government (Fire, EMS, LEO, Other)",
    ],
  },
};

// ============================================================================
// EXAMPLE 3: Checkbox with All Options Required
// ============================================================================

/**
 * Parent Question: Checkbox selection
 */
export const question10Example = {
  id: 10,
  text: "Types of calls answered by PSAP:",
  options: ["9-1-1", "Admin", "10-digit Emergency", "SMS/Text", "TTY/TDD", "Other (Please Specify)"],
  type: "checkbox" as const,
};

/**
 * Shows only if BOTH "9-1-1" AND "Admin" are selected
 */
export const question10_1Example = {
  id: 10.1,
  text: "Provide additional details about your call handling:",
  options: [],
  type: "text" as const,
  showIf: {
    questionId: 10,
    allOf: ["9-1-1", "Admin"],
  },
};

// ============================================================================
// EXAMPLE 4: Inverse Conditional (noneOf)
// ============================================================================

/**
 * Parent Question: Selection
 */
export const question5Example = {
  id: 5,
  text: "Select the PSAP classification:",
  options: ["Primary", "Secondary"],
  type: "radio" as const,
};

/**
 * Shows only if Q5 is NOT "Secondary"
 */
export const question5_1Example = {
  id: 5.1,
  text: "Describe your primary service area:",
  options: [],
  type: "text" as const,
  showIf: {
    questionId: 5,
    noneOf: ["Secondary"],
  },
};

// ============================================================================
// CONDITIONAL LOGIC EVALUATION EXAMPLES
// ============================================================================

/**
 * Example 1: Evaluate if Question 7.1 should be visible
 * 
 * User answered Q7 = "Yes"
 * Result: Q7.1 should be VISIBLE
 */
export const evaluationExample1 = {
  userAnswers: {
    q_7: "Yes",
  },
  question: question7_1Example,
  expectedResult: true,
  description: "Q7.1 should appear because Q7 = 'Yes'",
};

/**
 * Example 2: Evaluate if Question 7.2 should be visible
 * 
 * User answered Q7 = "No"
 * Result: Q7.2 should be HIDDEN
 */
export const evaluationExample2 = {
  userAnswers: {
    q_7: "No",
  },
  question: question7_2Example,
  expectedResult: false,
  description: "Q7.2 should NOT appear because Q7 = 'No'",
};

/**
 * Example 3: Multiple option evaluation
 * 
 * User answered Q8 = "Private"
 * Result: Q8.1 should be HIDDEN (Private not in anyOf list)
 */
export const evaluationExample3 = {
  userAnswers: {
    q_8: "Private",
  },
  question: question8_1Example,
  expectedResult: false,
  description: "Q8.1 should NOT appear because Q8 = 'Private' is not in the allowed options",
};

/**
 * Example 4: Checkbox allOf evaluation
 * 
 * User selected Q10 = ["9-1-1", "Admin", "SMS/Text"]
 * Result: Q10.1 should be VISIBLE (has both 9-1-1 AND Admin)
 */
export const evaluationExample4 = {
  userAnswers: {
    q_10: ["9-1-1", "Admin", "SMS/Text"],
  },
  question: question10_1Example,
  expectedResult: true,
  description: "Q10.1 should appear because Q10 has both required options selected",
};

/**
 * Example 5: Checkbox allOf evaluation - missing one option
 * 
 * User selected Q10 = ["9-1-1", "SMS/Text"]
 * Result: Q10.1 should be HIDDEN (missing Admin)
 */
export const evaluationExample5 = {
  userAnswers: {
    q_10: ["9-1-1", "SMS/Text"],
  },
  question: question10_1Example,
  expectedResult: false,
  description: "Q10.1 should NOT appear because Q10 is missing 'Admin' selection",
};

/**
 * Example 6: noneOf evaluation
 * 
 * User answered Q5 = "Primary"
 * Result: Q5.1 should be VISIBLE (Primary is not Secondary)
 */
export const evaluationExample6 = {
  userAnswers: {
    q_5: "Primary",
  },
  question: question5_1Example,
  expectedResult: true,
  description: "Q5.1 should appear because Q5 = 'Primary' is not 'Secondary'",
};

/**
 * Example 7: noneOf evaluation - condition not met
 * 
 * User answered Q5 = "Secondary"
 * Result: Q5.1 should be HIDDEN
 */
export const evaluationExample7 = {
  userAnswers: {
    q_5: "Secondary",
  },
  question: question5_1Example,
  expectedResult: false,
  description: "Q5.1 should NOT appear because Q5 = 'Secondary'",
};

// ============================================================================
// TEST RUNNER EXAMPLE
// ============================================================================

/**
 * Quick test to verify conditional logic evaluation
 * 
 * To use this in your test suite:
 * 
 * ```typescript
 * import { evaluateShowCondition } from '../utils/conditionalLogic';
 * 
 * const testConditionalLogic = () => {
 *   const examples = [
 *     evaluationExample1,
 *     evaluationExample2,
 *     evaluationExample3,
 *     evaluationExample4,
 *     evaluationExample5,
 *     evaluationExample6,
 *     evaluationExample7,
 *   ];
 * 
 *   examples.forEach((example) => {
 *     const result = evaluateShowCondition(
 *       example.question.showIf!,
 *       example.userAnswers
 *     );
 * 
 *     const status = result === example.expectedResult ? '✓ PASS' : '✗ FAIL';
 *     console.log(`${status}: ${example.description}`);
 *   });
 * };
 * ```
 */

// ============================================================================
// VALIDATION EXAMPLES
// ============================================================================

/**
 * Valid Survey Questions
 */
export const validSurveyStructure = [
  {
    id: 7,
    text: "Does the PSAP provide additional services?",
    type: "radio",
    options: ["Yes", "No"],
  },
  {
    id: 7.1,
    text: "List the services:",
    type: "text",
    options: [],
    showIf: { questionId: 7, anyOf: ["Yes"] },
  },
  {
    id: 7.2,
    text: "Hours per week:",
    type: "number",
    options: [],
    showIf: { questionId: 7, anyOf: ["Yes"] },
  },
];

/**
 * Invalid: Circular Dependency
 * Should trigger validation error
 */
export const invalidCircularDependency = [
  {
    id: 15,
    text: "Question A",
    type: "radio",
    options: ["Yes", "No"],
    showIf: { questionId: 16, anyOf: ["Yes"] }, // Depends on Q16
  },
  {
    id: 16,
    text: "Question B",
    type: "radio",
    options: ["Yes", "No"],
    showIf: { questionId: 15, anyOf: ["Yes"] }, // Depends on Q15 - CIRCULAR!
  },
];

/**
 * Invalid: Missing Referenced Question
 * Should trigger validation error
 */
export const invalidMissingQuestion = [
  {
    id: 40,
    text: "Question that references non-existent Q99",
    type: "text",
    options: [],
    showIf: { questionId: 99, anyOf: ["Yes"] }, // Q99 doesn't exist
  },
];

// ============================================================================
// DOCUMENTATION AND USAGE NOTES
// ============================================================================

/**
 * KEY POINTS:
 * 
 * 1. SIMPLE YES/NO CONDITIONALS
 *    - Use `anyOf: ["Yes"]` to show when answer is "Yes"
 *    - Use `noneOf: ["No"]` as an alternative (show when NOT "No")
 * 
 * 2. MULTIPLE OPTION CONDITIONALS
 *    - Use `anyOf: ["Option1", "Option2"]` to show when answer is any of these
 *    - Question appears if answer matches ANY option in the list
 * 
 * 3. CHECKBOX CONDITIONALS
 *    - `anyOf`: Shows if ANY of the specified options are checked
 *    - `allOf`: Shows ONLY if ALL specified options are checked
 * 
 * 4. ID NAMING
 *    - Parent question: Integer ID (7, 8, 10)
 *    - First dependent: Decimal ID (7.1, 8.1, 10.1)
 *    - Second dependent: Decimal ID (7.2, 8.2, 10.2)
 *    - Pattern: parent_id.child_number
 * 
 * 5. DATA FLOW
 *    - showIf defined in survey_data.json
 *    - Converted to SurveyJS visibleIf in surveyConverter.ts
 *    - Runtime visibility handled by SurveyJS library
 *    - Validation happens on survey load
 * 
 * 6. BEST PRACTICES
 *    - Keep dependency chains short (avoid deep nesting)
 *    - Validate circular dependencies with validateConditionalLogic()
 *    - Test all visibility paths before deployment
 *    - Document complex conditional logic in CONDITIONAL_LOGIC.md
 */
