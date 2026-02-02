# Astra Test Cases Manager

A sophisticated test cases management table for Astra's AI agent testing feature, built with AG Grid and following Astra DSM 2.0 design specifications.

## Features

- **AG Grid Integration**: Enterprise-grade table with sorting, filtering, column resizing, row reordering, and Excel-like editing
- **Excel-style Worksheets**: Organize test cases into multiple worksheets with tabs
- **Custom Cell Renderers**: Rich UI for AI responses, metrics badges, and row actions
- **CSV Import/Export**: Import test cases from CSV with column mapping, export results
- **AI Auto-generation**: Generate test cases automatically based on knowledge base
- **Inline Editing**: Edit questions, expected answers, and notes directly in the table
- **Visual Feedback**: Thumbs up/down feedback on AI responses
- **Metrics Display**: Accuracy percentage, latency, and pass/fail status badges

## Tech Stack

- **React 18** + **TypeScript**
- **AG Grid Community** - Enterprise-grade data grid
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **PapaParse** - CSV parsing
- **Lucide React** - Icons

## Getting Started

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

The app runs at `http://localhost:5173`.

## Project Structure

```
src/
├── components/
│   ├── test-cases/
│   │   ├── TestCasesTable.tsx      # Main AG Grid component
│   │   ├── WorksheetTabs.tsx       # Excel-style tabs
│   │   ├── TableControls.tsx       # Search, filter, sort, view toggle
│   │   ├── EmptyState.tsx          # Empty state with CTAs
│   │   ├── cell-renderers/
│   │   │   ├── RowActionsRenderer.tsx
│   │   │   ├── AIResponseRenderer.tsx
│   │   │   └── MetricsRenderer.tsx
│   │   └── modals/
│   │       ├── AddColumnModal.tsx
│   │       ├── ImportCSVModal.tsx
│   │       ├── FilterModal.tsx
│   │       └── AutoGenerateModal.tsx
│   └── ui/                         # Reusable UI components
├── hooks/
│   ├── useTestCases.ts             # Test case data management
│   └── useWorksheets.ts            # Worksheet CRUD
├── pages/
│   └── TestCasesPage.tsx           # Main page component
├── styles/
│   └── ag-grid-astra-theme.css     # Custom AG Grid theme
├── types/
│   └── test-cases.types.ts         # TypeScript definitions
├── lib/
│   └── utils.ts                    # Utility functions
└── utils/
    └── csv-parser.ts               # CSV import/export utilities
```

## Design System

This project follows **Astra DSM 2.0** design specifications:

### Colors
- **Primary**: `#3B82F6` (Astra blue)
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Neutrals**: Gray scale from `#F9FAFB` to `#111827`

### UX Copy Guidelines
- Clarity over cleverness
- Benefit-focused messaging
- Action-oriented verbs
- Sentence case everywhere
- Conversational but professional tone

### Design Resources
- [Figma Design System](https://www.figma.com/design/4Qnz6LBgqUdhDOE6SNrONX/Astra-DSM-2.0)
- Design rules: `.cursor/rules/astra-design-system.md`

## Key Features Explained

### Test Cases Table

The main table supports:
- **Multi-select**: Checkbox selection for bulk actions
- **Row Drag**: Reorder test cases by dragging
- **Inline Editing**: Click cells to edit content
- **Auto-height**: Expanded view shows full content
- **Compact View**: Fixed row height for viewing more data

### Worksheets

Organize test cases into multiple worksheets:
- Create/rename/duplicate/delete worksheets
- Each worksheet maintains its own test cases
- Move test cases between worksheets

### Metrics & Feedback

After running tests:
- Accuracy percentage (color-coded: green ≥90%, yellow ≥70%, red <70%)
- Response latency in seconds
- Pass/fail status badge
- Thumbs up/down feedback on AI responses

### CSV Import

Import test cases from CSV with:
- Preview of CSV data
- Column mapping interface
- Auto-detection of common column names
- Validation before import

## Development

### Adding New Cell Renderers

Create a new renderer in `src/components/test-cases/cell-renderers/`:

```tsx
import React from 'react';
import type { ICellRendererParams } from 'ag-grid-community';

export const MyRenderer: React.FC<ICellRendererParams> = (props) => {
  return <div>{props.value}</div>;
};
```

### Extending the Theme

Modify `src/styles/ag-grid-astra-theme.css` to customize AG Grid appearance while maintaining Astra DSM 2.0 consistency.

### Adding New Modals

1. Create modal in `src/components/test-cases/modals/`
2. Export from `modals/index.ts`
3. Add state and handlers in `TestCasesPage.tsx`

## License

MIT
