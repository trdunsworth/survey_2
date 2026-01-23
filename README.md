# NENA PSAP Survey Platform

A WCAG 2.1 AA compliant static survey website for collecting PSAP (Public Safety Answering Point) data across North America.

## Features

- ✅ **Fully Anonymous** - No login required, no personal data collected
- ✅ **Session Management** - Automatic linking of survey responses without user authentication
- ✅ **Progress Tracking** - Complete surveys at your own pace with automatic save
- ✅ **SurveyJS Integration** - Professional survey rendering with conditional logic
- ✅ **WCAG 2.1 AA Compliant** - Accessible design with keyboard navigation and screen reader support
- ✅ **NENA Branding** - Red and white color scheme matching NENA.org
- ✅ **Glossary Tooltips** - Hover over terms to see definitions
- ✅ **Data Export** - Export responses as JSON for database import
- ✅ **TypeScript** - Full type safety
- ✅ **Modern Tooling** - ESLint, Prettier for code quality

## Tech Stack

- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Routing**: React Router v6
- **Survey Engine**: SurveyJS
- **Styling**: CSS with CSS Variables
- **Linting**: ESLint with accessibility plugin
- **Formatting**: Prettier

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development Commands

```bash
# Run linter
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Type check
npm run type-check
```

## Project Structure

```
survey_2/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── GlossaryTooltip.tsx
│   ├── pages/          # Page components
│   │   ├── LandingPage.tsx
│   │   ├── SurveysListPage.tsx
│   │   ├── SurveyPage.tsx
│   │   ├── GlossaryPage.tsx
│   │   ├── CompletionPage.tsx
│   │   └── ProgressPage.tsx
│   ├── types/          # TypeScript type definitions
│   │   └── index.ts
│   ├── utils/          # Utility functions
│   │   ├── sessionManager.ts
│   │   └── surveyConverter.ts
│   ├── App.tsx         # Main application component
│   ├── main.tsx        # Application entry point
│   └── index.css       # Global styles
├── survey_data.json    # Survey questions and structure
├── glossary_data.json  # Glossary terms and definitions
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## Survey Data Structure

The survey is organized into sections defined in `survey_data.json`:

- **Welcome** - Introduction and consent
- **Location Information** - State/province data
- **PSAP Classification** - Agency details
- **Yearly Call Counts** - Volume metrics
- **Telecommunicator Staff Numbers** - Staffing data
- **Operations Information** - Vendor and system details
- **Call Center Data** - Performance metrics
- **Radio Data** - Communication channels
- **New Technologies** - AI and automation
- **Future Technology** - Planned implementations
- **Training** - Education programs
- **Additional Duties** - Other responsibilities
- **Closing** - Thank you message

## Session Management

The application uses localStorage to manage user sessions without requiring authentication:

- **Session ID**: Unique UUID generated per user
- **Progress Tracking**: Automatically saves responses
- **Multi-Survey Support**: Link responses across different survey sections
- **Data Export**: Download responses as JSON for database import

### Data Export Format

```json
{
  "userId": "unique-session-id",
  "sessionCreated": "2024-01-23T12:00:00.000Z",
  "surveys": [
    {
      "userId": "unique-session-id",
      "surveyId": "section-id",
      "surveyTitle": "Section Title",
      "startTime": "2024-01-23T12:05:00.000Z",
      "completionTime": "2024-01-23T12:15:00.000Z",
      "responses": { /* survey answers */ },
      "percentComplete": 100
    }
  ],
  "exportedAt": "2024-01-23T12:30:00.000Z"
}
```

## Accessibility Features

- ✅ Semantic HTML5 structure
- ✅ ARIA labels and roles
- ✅ Keyboard navigation support
- ✅ Focus management
- ✅ High contrast mode support
- ✅ Screen reader optimization
- ✅ Skip to content link
- ✅ Minimum 44px touch targets (WCAG 2.1)
- ✅ Color contrast ratios meeting WCAG AA

## Glossary Integration

Terms defined in `glossary_data.json` automatically get tooltip support throughout the survey:

```json
[
  {
    "term": "PSAP",
    "definition": "Public Safety Answering Point. A facility equipped and staffed to receive 9-1-1 calls."
  }
]
```

## Customization

### Adding New Survey Sections

1. Edit `survey_data.json`
2. Add a new section object with title and questions
3. The application automatically generates routes and pages

### Modifying Survey Questions

1. Edit `survey_data.json`
2. Update question text, type, or options
3. Add conditional logic using `showIf` property

### Adding Glossary Terms

1. Edit `glossary_data.json`
2. Add term and definition
3. Tooltips automatically appear when term is used

### Customizing Branding

1. Edit CSS variables in `src/index.css`
2. Modify colors in the `:root` selector
3. Update logo and header in `src/components/Header.tsx`

## Database Integration

The exported JSON format is designed for easy import into relational databases:

### Recommended Schema

```sql
-- Users table
CREATE TABLE survey_sessions (
  user_id VARCHAR(36) PRIMARY KEY,
  created_at TIMESTAMP,
  exported_at TIMESTAMP
);

-- Survey responses table
CREATE TABLE survey_responses (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(36) REFERENCES survey_sessions(user_id),
  survey_id VARCHAR(100),
  survey_title VARCHAR(200),
  start_time TIMESTAMP,
  completion_time TIMESTAMP,
  percent_complete INTEGER,
  responses JSONB
);

-- Individual answers table (optional, for normalized data)
CREATE TABLE survey_answers (
  id SERIAL PRIMARY KEY,
  response_id INTEGER REFERENCES survey_responses(id),
  question_id VARCHAR(50),
  question_text TEXT,
  answer_value TEXT,
  answer_type VARCHAR(50)
);
```

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License

© 2026 NENA. All rights reserved.

## Support

For questions or issues, please contact NENA at https://www.nena.org/

## Contributing

This is an internal NENA project. Please follow NENA's contribution guidelines.
