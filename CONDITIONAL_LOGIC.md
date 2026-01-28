# Survey Conditional Logic Documentation

## Overview

The survey system supports conditional visibility for questions. Questions can be configured to only appear when specific conditions are met based on previous answers. This enables dynamic questionnaires that adapt to respondent answers.

## Implementation Details

### Question 7 Restructuring Example

The survey has been restructured to use conditional logic for additional services questions:

#### Question 7 (Main Question)
- **Type:** `radio` (Yes/No)
- **Text:** "Does the PSAP provide any additional services beyond the ones listed in question 6?"
- **ID:** `7`
- **Options:** `["Yes", "No"]`
- **Conditional:** None (always visible)

#### Question 7.1 (Follow-up - List Services)
- **Type:** `text`
- **Text:** "Please list any additional services that you provide:"
- **ID:** `7.1`
- **Conditional Logic:**
  ```json
  "showIf": {
    "questionId": 7,
    "anyOf": ["Yes"]
  }
  ```
- **Visibility:** Only appears when Question 7 = "Yes"

#### Question 7.2 (Follow-up - Hours Per Week)
- **Type:** `number`
- **Text:** "How many hours per week are spent on these additional services?"
- **ID:** `7.2`
- **Conditional Logic:**
  ```json
  "showIf": {
    "questionId": 7,
    "anyOf": ["Yes"]
  }
  ```
- **Visibility:** Only appears when Question 7 = "Yes"

## Conditional Logic Format

### Basic Syntax

All conditional logic is defined in the question's `showIf` property:

```json
{
  "id": "question_id",
  "text": "Question text",
  "type": "text",
  "showIf": {
    "questionId": "referenced_question_id",
    "anyOf": ["option1", "option2"]
  }
}
```

### Conditional Types

#### 1. **anyOf** - At Least One Match
Shows the question if the referenced question matches ANY of the specified values.

```json
"showIf": {
  "questionId": 7,
  "anyOf": ["Yes"]
}
```
*Shows when Q7 = "Yes"*

```json
"showIf": {
  "questionId": 8,
  "anyOf": ["Police", "Fire", "EMS"]
}
```
*Shows when Q8 = any of these three values*

#### 2. **allOf** - All Values Must Match
For checkbox questions, shows if ALL specified options are selected.

```json
"showIf": {
  "questionId": 10,
  "allOf": ["9-1-1", "Admin"]
}
```
*Shows if Q10 has BOTH "9-1-1" AND "Admin" selected*

#### 3. **noneOf** - No Value Match
Shows when the referenced question does NOT match any specified values.

```json
"showIf": {
  "questionId": 5,
  "noneOf": ["Secondary"]
}
```
*Shows when Q5 is NOT "Secondary"*

## How It Works Internally

### 1. Survey Data Definition
Questions are defined in `/survey_data.json` with the `showIf` property.

### 2. Conversion to SurveyJS
The `surveyConverter.ts` utility:
- Converts custom question format to SurveyJS format
- Translates `showIf` conditions to SurveyJS `visibleIf` syntax
- Validates conditional logic for circular dependencies

### 3. Runtime Visibility Control
When the survey loads:
- SurveyJS handles the actual visibility logic
- Questions show/hide automatically as users answer
- Saved responses preserve visibility state

## SurveyJS Conversion

Our conditional format converts to SurveyJS `visibleIf` expressions:

### Input (Our Format)
```json
{
  "id": 7.1,
  "showIf": {
    "questionId": 7,
    "anyOf": ["Yes"]
  }
}
```

### Output (SurveyJS Format)
```json
{
  "name": "q_7.1",
  "visibleIf": "{q_7} = 'Yes'"
}
```

## Validation

The system automatically validates conditional logic for:
- ✓ Circular dependencies (Q7 depends on Q8, Q8 depends on Q7)
- ✓ Referenced questions exist
- ✓ Proper format and syntax

Validation warnings appear in the browser console if issues are detected.

## Adding New Conditional Questions

To add a new conditional question:

1. **Define the parent question** (must already exist)
2. **Create dependent question** with `showIf` property
3. **Use decimal IDs** for dependencies (e.g., if Q5 has conditions, use 5.1, 5.2)

### Example:

```json
{
  "id": 12.1,
  "text": "Please provide details:",
  "type": "text",
  "showIf": {
    "questionId": 12,
    "anyOf": ["Other (Please Specify)"]
  }
}
```

## Data Collection Considerations

When a dependent question is hidden:
- Its value is not included in the response data
- It doesn't count toward survey completion percentage
- No answer is required (even if marked as required)
- Users cannot accidentally submit answers to hidden questions

## Advanced Patterns

### Multiple Conditions on Same Parent
```json
{
  "id": 6.1,
  "showIf": { "questionId": 5, "anyOf": ["Primary"] }
},
{
  "id": 6.2,
  "showIf": { "questionId": 5, "anyOf": ["Secondary"] }
}
```

### Checkbox with Multiple Requirements
```json
{
  "id": 9.1,
  "showIf": {
    "questionId": 10,
    "allOf": ["9-1-1", "Admin"]
  }
}
```

### Deep Dependencies (Q depends on Q, which depends on Q)
Allowed but validated. Questions will only show if entire chain is satisfied.

Example:
- Q10 shows when Q8 = "Yes"
- Q10.1 shows when Q10 = "Police"
- Result: Q10.1 only visible if Q8 = "Yes" AND Q10 = "Police"

## Testing Conditional Logic

When testing, verify:
1. ✓ Question appears when condition is met
2. ✓ Question hides when condition is not met
3. ✓ Changing parent answer updates visibility immediately
4. ✓ Hidden question's data is not submitted
5. ✓ Saved session preserves visibility state

## Code References

### Key Files
- [surveyConverter.ts](../utils/surveyConverter.ts) - Converts survey format and handles conditional logic
- [conditionalLogic.ts](../utils/conditionalLogic.ts) - Conditional logic utilities and validation
- [SurveyPage.tsx](../pages/SurveyPage.tsx) - Renders survey with SurveyJS

### Key Functions
- `convertToSurveyJS()` - Main conversion with validation
- `createVisibilityCondition()` - Converts showIf to SurveyJS syntax
- `evaluateShowCondition()` - Runtime evaluation (for server-side use)
- `validateConditionalLogic()` - Detects circular dependencies and missing references

## Browser Console Debugging

Enable detailed logging by modifying `SurveyPage.tsx`:

```typescript
// In SurveyPage.tsx
console.log('Survey JSON:', JSON.stringify(surveyJson, null, 2));

// In surveyConverter.ts
console.warn('Survey conditional logic validation warnings:', validationErrors);
```

## Future Enhancements

Potential improvements to consider:
- UI for building conditional rules visually
- Support for AND/OR logic combinations
- Time-based visibility (show after delay)
- Calculated conditions based on multiple questions
- Skip logic patterns
