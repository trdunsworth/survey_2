# Question 7 Restructuring - Quick Reference

## What Changed

Question 7 now uses **conditional logic** to show/hide follow-up questions based on the user's answer.

## User Experience

### Before
- User sees: "Please list any additional services that you provide:" (text input)

### After
1. User sees: "Does the PSAP provide any additional services beyond the ones listed in question 6?" (Yes/No)
2. If YES → Two additional questions appear:
   - "Please list any additional services that you provide:" (text)
   - "How many hours per week are spent on these additional services?" (number)
3. If NO → Those two questions are hidden, survey continues normally

## Technical Changes

### Question IDs

| Question | ID  | Type    | Visible When           |
|----------|-----|---------|------------------------|
| Main     | 7   | radio   | Always                 |
| Services | 7.1 | text    | Q7 = "Yes"             |
| Hours    | 7.2 | number  | Q7 = "Yes"             |

### Data Submitted

**If user answers "No":**
```json
{
  "q_7": "No"
}
```

**If user answers "Yes":**
```json
{
  "q_7": "Yes",
  "q_7_1": "Services text here",
  "q_7_2": 5
}
```

## Files Updated

1. **survey_data.json** - Main survey definition
2. **survey_data_2.json** - Alternative survey version
3. **src/types/index.ts** - Type definitions
4. **src/utils/surveyConverter.ts** - Survey converter logic
5. **src/utils/conditionalLogic.ts** - NEW: Conditional logic utilities
6. **src/utils/conditionalLogicExamples.ts** - NEW: Examples and tests
7. **CONDITIONAL_LOGIC.md** - NEW: Complete documentation
8. **IMPLEMENTATION_SUMMARY.md** - NEW: Implementation details

## How Conditional Logic Works

### In Survey Definition (JSON)

```json
{
  "id": 7.1,
  "text": "Question text",
  "showIf": {
    "questionId": 7,
    "anyOf": ["Yes"]
  }
}
```

### Conversion Process

```
Survey JSON → surveyConverter.ts → SurveyJS format → Browser
```

### Runtime Behavior

```
User answers Q7 "Yes" → SurveyJS shows Q7.1 & Q7.2 → Data saved
User answers Q7 "No"  → SurveyJS hides Q7.1 & Q7.2 → Only Q7 saved
```

## Testing

### Manual Test Steps

1. Load survey
2. See no errors in browser console
3. Answer Q7 with "No" → Q7.1 and Q7.2 should be hidden
4. Change Q7 to "Yes" → Q7.1 and Q7.2 should appear
5. Fill values and submit → Only relevant questions in response

### Validation

The system automatically checks for:
- ✓ Circular dependencies
- ✓ Missing referenced questions
- ✓ Invalid syntax

Warnings appear in browser console if issues found.

## Common Patterns

### Pattern 1: Simple Yes/No with Follow-up
```json
{
  "showIf": {
    "questionId": 7,
    "anyOf": ["Yes"]
  }
}
```

### Pattern 2: Multiple Options
```json
{
  "showIf": {
    "questionId": 8,
    "anyOf": ["Option1", "Option2", "Option3"]
  }
}
```

### Pattern 3: All Options Required (Checkbox)
```json
{
  "showIf": {
    "questionId": 10,
    "allOf": ["Option1", "Option2"]
  }
}
```

### Pattern 4: Exclude Options
```json
{
  "showIf": {
    "questionId": 5,
    "noneOf": ["Secondary"]
  }
}
```

## Key Code Locations

| What | Where |
|------|-------|
| Survey data | survey_data.json (lines 155-195) |
| Converter | src/utils/surveyConverter.ts |
| Logic utilities | src/utils/conditionalLogic.ts |
| Type defs | src/types/index.ts |
| Examples | src/utils/conditionalLogicExamples.ts |
| Full docs | CONDITIONAL_LOGIC.md |

## Adding More Conditionals

To add another conditional question:

1. Create a new question with decimal ID (e.g., 7.3 for another Q7 variant)
2. Add `showIf` property with your condition
3. Rebuild the survey
4. Test visibility on browser

Example:
```json
{
  "id": 7.3,
  "text": "What is the category of these services?",
  "type": "select",
  "options": ["Administrative", "Operational", "Other"],
  "showIf": {
    "questionId": 7,
    "anyOf": ["Yes"]
  }
}
```

## Troubleshooting

### Conditional questions not appearing?
1. Check browser console for errors
2. Verify questionId matches parent question
3. Check that anyOf value exactly matches an option
4. Ensure JSON is valid

### Questions disappearing on save?
1. Not a problem - hidden question data is not saved
2. Change parent answer back to show them again
3. Data is preserved in memory until submission

### Performance issues?
1. Avoid deep dependencies (Q1 → Q2 → Q3 → Q4)
2. Use validation warnings to find issues
3. Consider splitting into multiple survey sections

## Documentation

- **CONDITIONAL_LOGIC.md** - Complete guide (read this first)
- **IMPLEMENTATION_SUMMARY.md** - Technical details
- **conditionalLogicExamples.ts** - Code examples
- **surveyConverter.ts** - How conversion works

## Support

For questions or issues:
1. Check CONDITIONAL_LOGIC.md
2. Review conditionalLogicExamples.ts
3. Check browser console for validation errors
4. Read code comments in conditionalLogic.ts
