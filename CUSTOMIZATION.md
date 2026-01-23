# Survey Customization Guide

This guide explains how to customize and modify the NENA PSAP Survey platform.

## Table of Contents

1. [Adding or Modifying Survey Questions](#adding-or-modifying-survey-questions)
2. [Adding Glossary Terms](#adding-glossary-terms)
3. [Changing Survey Structure](#changing-survey-structure)
4. [Customizing Branding](#customizing-branding)
5. [Database Integration](#database-integration)

---

## Adding or Modifying Survey Questions

All survey questions are defined in `survey_data.json`. The structure follows this format:

### Question Types

```json
{
  "id": 1,
  "text": "Your question text here",
  "options": ["Option 1", "Option 2"],
  "type": "select"
}
```

Available question types:

- **`info`** - Display-only text (no answer required)
- **`text`** - Free text input
- **`number`** - Numeric input
- **`select`** - Dropdown selection
- **`radio`** - Single choice from multiple options
- **`checkbox`** - Multiple choices
- **`agencies-with-count`** - Special matrix for agencies and counts

### Adding a New Question

1. Open `survey_data.json`
2. Find the appropriate section
3. Add your question to the `questions` array:

```json
{
  "id": 100,
  "text": "What is your primary dispatch software?",
  "options": ["CAD Pro", "Dispatch Master", "Other (Please Specify)"],
  "type": "select"
}
```

### Adding Conditional Questions

To show a question only when a specific answer is selected:

```json
{
  "id": 101,
  "text": "Please specify your dispatch software:",
  "options": [],
  "type": "text",
  "showIf": {
    "questionId": 100,
    "anyOf": ["Other (Please Specify)"]
  }
}
```

The question with ID 101 will only appear if the user selects "Other (Please Specify)" in question 100.

### Modifying Existing Questions

1. Locate the question by its `id` in `survey_data.json`
2. Update the `text`, `options`, or `type` as needed
3. Save the file - changes will be reflected immediately in development mode

---

## Adding Glossary Terms

Glossary terms are defined in `glossary_data.json`:

```json
[
  {
    "term": "PSAP",
    "definition": "Public Safety Answering Point. A facility equipped and staffed to receive 9-1-1 calls."
  }
]
```

To add a new term:

1. Open `glossary_data.json`
2. Add a new object to the array:

```json
{
  "term": "NG911",
  "definition": "Next Generation 9-1-1. An IP-based system that allows digital information to flow seamlessly from the public to emergency responders."
}
```

The glossary page automatically displays all terms alphabetically. Users can hover over these terms throughout the survey to see their definitions.

---

## Changing Survey Structure

### Adding a New Section

1. Open `survey_data.json`
2. Add a new section to the `sections` array:

```json
{
  "title": "Cybersecurity Measures",
  "questions": [
    {
      "id": 200,
      "text": "Does your PSAP have a dedicated cybersecurity team?",
      "options": ["Yes", "No", "Uncertain"],
      "type": "radio"
    }
  ]
}
```

The application will automatically:
- Create a new route: `/survey/cybersecurity-measures`
- Add it to the surveys list page
- Track its completion status

### Removing a Section

1. Open `survey_data.json`
2. Remove the entire section object from the `sections` array
3. Save the file

**Note**: Users who have already completed the removed section will still have their responses saved locally.

### Reordering Sections

Simply reorder the section objects in the `sections` array. The order in the file determines the display order on the website.

---

## Customizing Branding

### Colors

All colors are defined using CSS variables in `src/index.css`:

```css
:root {
  --color-primary: #cc0000; /* NENA Red */
  --color-primary-dark: #990000;
  --color-primary-light: #ff3333;
  --color-secondary: #ffffff;
  /* ... more colors */
}
```

To change the color scheme:

1. Open `src/index.css`
2. Modify the color values in the `:root` section
3. Ensure WCAG 2.1 AA contrast ratios are maintained:
   - Normal text: 4.5:1 minimum
   - Large text: 3:1 minimum
   - Use a contrast checker: https://webaim.org/resources/contrastchecker/

### Logo and Header

Edit `src/components/Header.tsx`:

```tsx
<div className="logo">
  <Link to="/" aria-label="NENA Survey Home">
    <h1>
      <span className="logo-nena">YOUR ORG</span>
      <span className="logo-subtitle">Your Survey Title</span>
    </h1>
  </Link>
</div>
```

### Footer Content

Edit `src/components/Footer.tsx` to update:
- Organization information
- Privacy statement
- Accessibility statement
- Copyright notice

---

## Database Integration

### Export Format

The application exports data in JSON format designed for database import:

```json
{
  "userId": "unique-session-id",
  "sessionCreated": "2024-01-23T12:00:00.000Z",
  "surveys": [
    {
      "userId": "unique-session-id",
      "surveyId": "location-information",
      "surveyTitle": "Location Information",
      "startTime": "2024-01-23T12:05:00.000Z",
      "completionTime": "2024-01-23T12:15:00.000Z",
      "responses": {
        "q_1": "California",
        "q_2": "100,000 - 250,000"
      },
      "percentComplete": 100
    }
  ],
  "exportedAt": "2024-01-23T12:30:00.000Z"
}
```

### Recommended Database Schema

#### PostgreSQL Example

```sql
-- Survey sessions table
CREATE TABLE survey_sessions (
  user_id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  exported_at TIMESTAMP NOT NULL,
  created_date DATE GENERATED ALWAYS AS (created_at::DATE) STORED
);

-- Survey responses table
CREATE TABLE survey_responses (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES survey_sessions(user_id),
  survey_id VARCHAR(100) NOT NULL,
  survey_title VARCHAR(200) NOT NULL,
  start_time TIMESTAMP NOT NULL,
  completion_time TIMESTAMP NOT NULL,
  percent_complete INTEGER NOT NULL,
  responses JSONB NOT NULL,
  created_date DATE GENERATED ALWAYS AS (completion_time::DATE) STORED
);

-- Indexes for performance
CREATE INDEX idx_survey_responses_user_id ON survey_responses(user_id);
CREATE INDEX idx_survey_responses_survey_id ON survey_responses(survey_id);
CREATE INDEX idx_survey_responses_completion ON survey_responses(completion_time);
CREATE INDEX idx_survey_responses_jsonb ON survey_responses USING gin(responses);

-- Query individual answers
CREATE INDEX idx_survey_responses_state ON survey_responses 
  ((responses->>'q_1'));
```

### Import Script Example (Python)

```python
import json
import psycopg2
from datetime import datetime

def import_survey_data(json_file, db_config):
    # Load JSON
    with open(json_file, 'r') as f:
        data = json.load(f)
    
    # Connect to database
    conn = psycopg2.connect(**db_config)
    cur = conn.cursor()
    
    try:
        # Insert session
        cur.execute(
            """
            INSERT INTO survey_sessions (user_id, created_at, exported_at)
            VALUES (%s, %s, %s)
            ON CONFLICT (user_id) DO NOTHING
            """,
            (data['userId'], data['sessionCreated'], data['exportedAt'])
        )
        
        # Insert survey responses
        for survey in data['surveys']:
            cur.execute(
                """
                INSERT INTO survey_responses 
                (user_id, survey_id, survey_title, start_time, 
                 completion_time, percent_complete, responses)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
                """,
                (
                    survey['userId'],
                    survey['surveyId'],
                    survey['surveyTitle'],
                    survey['startTime'],
                    survey['completionTime'],
                    survey['percentComplete'],
                    json.dumps(survey['responses'])
                )
            )
        
        conn.commit()
        print(f"Successfully imported data for user {data['userId']}")
        
    except Exception as e:
        conn.rollback()
        print(f"Error importing data: {e}")
        
    finally:
        cur.close()
        conn.close()

# Usage
db_config = {
    'dbname': 'nena_survey',
    'user': 'postgres',
    'password': 'your_password',
    'host': 'localhost'
}

import_survey_data('exported_survey.json', db_config)
```

### Querying Survey Data

```sql
-- Count responses by state
SELECT 
  responses->>'q_1' as state,
  COUNT(*) as response_count
FROM survey_responses
WHERE survey_id = 'location-information'
GROUP BY responses->>'q_1'
ORDER BY response_count DESC;

-- Get all responses for a specific section
SELECT 
  user_id,
  completion_time,
  responses
FROM survey_responses
WHERE survey_id = 'psap-classification'
  AND percent_complete = 100
ORDER BY completion_time DESC;

-- Calculate completion rate
SELECT 
  survey_id,
  COUNT(*) as total_attempts,
  SUM(CASE WHEN percent_complete = 100 THEN 1 ELSE 0 END) as completed,
  ROUND(
    100.0 * SUM(CASE WHEN percent_complete = 100 THEN 1 ELSE 0 END) / COUNT(*),
    2
  ) as completion_rate
FROM survey_responses
GROUP BY survey_id;
```

---

## Best Practices

### 1. Testing Changes

After modifying survey data:

```bash
# Check for linting issues
npm run lint

# Check for type errors
npm run type-check

# Build to ensure no errors
npm run build
```

### 2. Question ID Management

- Use sequential IDs for easy tracking
- Use decimal IDs (8.1, 8.2) for related follow-up questions
- Never reuse IDs as this may affect existing data

### 3. Accessibility

When adding new content:
- Ensure proper heading hierarchy (h1 → h2 → h3)
- Add `aria-label` attributes for icon buttons
- Maintain color contrast ratios
- Test with keyboard navigation
- Test with screen readers

### 4. Version Control

- Commit survey_data.json changes separately
- Document survey version in commit messages
- Tag releases with version numbers

---

## Troubleshooting

### Survey not appearing

1. Check `survey_data.json` for syntax errors
2. Ensure the section has a `title` and `questions` array
3. Restart the development server

### Conditional question not showing

1. Verify the `questionId` in `showIf` matches exactly
2. Check that the value in `anyOf` matches the option text exactly (case-sensitive)
3. Ensure the parent question has been answered

### Data not exporting

1. Check browser console for errors
2. Verify localStorage is enabled
3. Try a different browser

---

## Support

For additional help:
- Review the [README.md](README.md) for general documentation
- Check the TypeScript types in `src/types/index.ts`
- Review example questions in `survey_data.json`

---

**Last Updated**: January 2026  
**Version**: 1.0.0
