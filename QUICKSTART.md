# NENA Survey Platform - Quick Start Guide

## 🚀 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
# Open http://localhost:3000
```

### Build for Production
```bash
npm run build
npm run preview
```

## 📋 Common Tasks

### Add a Survey Question
1. Edit `survey_data.json`
2. Add to appropriate section's `questions` array
3. Save and reload

### Add a Glossary Term
1. Edit `glossary_data.json`
2. Add `{"term": "...", "definition": "..."}`
3. Term will auto-appear on glossary page

### Change Colors
1. Edit `src/index.css`
2. Modify CSS variables in `:root`
3. Maintain WCAG contrast ratios

## 🔍 Project Structure

```
src/
├── components/      # Reusable UI (Header, Footer, Tooltips)
├── pages/          # Route pages (Landing, Survey, Glossary)
├── types/          # TypeScript definitions
├── utils/          # Helper functions
└── App.tsx         # Main app with routing
```

## 🛠️ Available Commands

```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Check code quality
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

## 📊 Survey Data Format

```json
{
  "title": "Survey Title",
  "sections": [
    {
      "title": "Section Name",
      "questions": [
        {
          "id": 1,
          "text": "Question text?",
          "options": ["Option 1", "Option 2"],
          "type": "radio"
        }
      ]
    }
  ]
}
```

## 🎯 Question Types

- `info` - Display only
- `text` - Free text
- `number` - Numeric input
- `select` - Dropdown
- `radio` - Single choice
- `checkbox` - Multiple choice
- `agencies-with-count` - Agency matrix

## 🔗 Conditional Questions

```json
{
  "id": 2,
  "text": "Follow-up question",
  "type": "text",
  "showIf": {
    "questionId": 1,
    "anyOf": ["Option 1"]
  }
}
```

## 💾 Data Export

Users can export their responses from the Progress page:
- Format: JSON
- Contains: All responses linked by user session ID
- Database-ready format

## ♿ Accessibility Features

✅ WCAG 2.1 AA compliant  
✅ Keyboard navigation  
✅ Screen reader support  
✅ High contrast mode  
✅ Skip navigation links  
✅ ARIA labels  

## 🎨 Branding

**Colors** (in `src/index.css`):
- Primary: `--color-primary: #cc0000`
- Background: `--color-background: #ffffff`

**Logo** (in `src/components/Header.tsx`):
```tsx
<span className="logo-nena">NENA</span>
```

## 🔒 Privacy & Storage

- No server required
- No user authentication
- Data stored in browser localStorage
- Anonymous session IDs
- User-initiated export only

## 📦 Key Dependencies

- React 18 - UI framework
- TypeScript - Type safety
- Vite - Build tool
- React Router - Navigation
- SurveyJS - Survey engine
- UUID - Session IDs

## 🐛 Troubleshooting

**Survey not showing?**
- Check `survey_data.json` syntax
- Restart dev server

**Linting errors?**
```bash
npm run lint:fix
```

**Type errors?**
```bash
npm run type-check
```

**Build failing?**
```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📚 More Information

- Full docs: [README.md](README.md)
- Customization: [CUSTOMIZATION.md](CUSTOMIZATION.md)
- NENA website: https://www.nena.org/

## 🎉 Features

✅ Multi-section surveys  
✅ Automatic progress saving  
✅ Anonymous sessions  
✅ Glossary tooltips  
✅ WCAG compliant  
✅ Mobile responsive  
✅ TypeScript + ESLint  
✅ JSON export  

---

**Quick Reference Card**

| Task | Command |
|------|---------|
| Start dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Format | `npm run format` |
| Type check | `npm run type-check` |
| Add question | Edit `survey_data.json` |
| Add term | Edit `glossary_data.json` |
| Change colors | Edit `src/index.css` |

**Version**: 1.0.0 | **Updated**: January 2026
