# Practise — DSA Practice & Developer Workspace

A serious, understated, precise, and developer-first Data Structures & Algorithms (DSA) preparation platform and coding workspace built with React, Vite, Monaco Editor, and plain CSS.

---

## 1. Product Identity & Design Principles

Practise is designed as daily desktop software for engineers preparing for technical interviews at top-tier software companies.

- **Developer-First Ergonomics**: Neutral graphite surfaces, muted green accents, compact tables, and monospace technical metadata.
- **No Marketing Fluff**: Zero glowing cards, purple gradients, glassmorphism, or non-functional placeholder buttons.
- **Split IDE Workspace**: Dual-pane layout featuring Monaco Editor, multi-language support (JavaScript, Python, C++, Java), persistent drafts, expandable editorials, personal notes, and test runner controls.
- **Client Persistence**: Versioned `localStorage` handles problem completion, code drafts, personal notes, spaced repetition revision schedules, and mock interview logs.
- **Clean Service Boundary**: Modular client abstractions for future Express backend services (code execution sandbox, server-side GitHub OAuth, and AI provider routing).

---

## 2. Technology Stack

- **Framework**: React 19 + Vite
- **Language**: JavaScript (JSX)
- **Styling**: Pure CSS with CSS Custom Properties / Tokens (`src/styles/variables.css`)
- **Routing**: React Router v7
- **Code Editor**: `@monaco-editor/react` (Monaco Editor)
- **Icons**: `lucide-react`
- **Charts**: `recharts`
- **Persistence**: Centralized browser `localStorage` utility

---

## 3. Project Structure

```text
practise/
├── .env.example
├── README.md
├── index.html
├── package.json
├── vite.config.ts
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── routes/
    │   └── AppRoutes.jsx
    ├── components/
    │   ├── common/
    │   │   ├── Button.jsx
    │   │   ├── ConfirmDialog.jsx
    │   │   ├── DifficultyBadge.jsx
    │   │   ├── EmptyState.jsx
    │   │   ├── Modal.jsx
    │   │   ├── SearchInput.jsx
    │   │   ├── Select.jsx
    │   │   └── StatusBadge.jsx
    │   ├── layout/
    │   │   ├── AppShell.jsx
    │   │   ├── GlobalSearchModal.jsx
    │   │   ├── PageHeader.jsx
    │   │   ├── Sidebar.jsx
    │   │   └── Topbar.jsx
    │   ├── workspace/
    │   │   ├── GitHubPublishModal.jsx
    │   │   ├── WorkspaceBottomPanel.jsx
    │   │   ├── WorkspacePaneLeft.jsx
    │   │   └── WorkspacePaneRight.jsx
    │   ├── ai/
    │   │   └── AIAssistantPanel.jsx
    │   └── revisions/
    │       └── RevisionModal.jsx
    ├── pages/
    │   ├── BookmarksPage.jsx
    │   ├── DashboardPage.jsx
    │   ├── MockInterviewsPage.jsx
    │   ├── NotFoundPage.jsx
    │   ├── ProblemsPage.jsx
    │   ├── ProgressPage.jsx
    │   ├── RevisionPage.jsx
    │   ├── SettingsPage.jsx
    │   └── WorkspacePage.jsx
    ├── context/
    │   └── AppContext.jsx
    ├── data/
    │   ├── companyData.js
    │   └── questions.js
    ├── services/
    │   ├── apiClient.js
    │   ├── executionService.js
    │   ├── aiService.js
    │   └── githubService.js
    ├── utils/
    │   ├── dates.js
    │   ├── statistics.js
    │   ├── storage.js
    │   └── validation.js
    └── styles/
        ├── variables.css
        ├── global.css
        ├── layout.css
        ├── components.css
        └── pages/
            ├── dashboard.css
            ├── mockInterviews.css
            ├── problems.css
            ├── progress.css
            ├── revisions.css
            ├── settings.css
            └── workspace.css
```

---

## 4. Local Installation & Development

### Prerequisites
- Node.js (v18+)
- npm

### Commands
```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 5. Backend Integration Specifications

Practise is architected with a strict service layer (`src/services/`) so the upcoming Node.js + Express backend can be connected without frontend rewrites.

### 5.1 Code Execution Service (`executionService.js`)
- **Endpoint**: `POST /api/execute`
- **Request Payload**:
  ```json
  {
    "problemId": "two-sum",
    "language": "javascript",
    "sourceCode": "function twoSum(nums, target) { ... }",
    "testInput": "[2, 7, 11, 15]\n9",
    "options": {
      "timeoutLimitMs": 3000,
      "memoryLimitMb": 128
    }
  }
  ```
- **Expected Response**:
  ```json
  {
    "status": "passed",
    "stdout": "Output log...",
    "stderr": "",
    "executionTimeMs": 42,
    "memoryUsageKb": 14200,
    "testResults": [
      { "id": 1, "passed": true, "input": "...", "output": "[0, 1]", "expected": "[0, 1]" }
    ]
  }
  ```
- **Dev-Mode Behavior**: When the backend is offline, Practise displays structured diagnostics explaining backend connectivity rather than fabricating synthetic execution results.

### 5.2 GitHub OAuth & Publishing Service (`githubService.js`)
- **Endpoints**:
  - `GET /api/github/status`: Verifies OAuth handshake status.
  - `GET /api/github/repos`: Lists user's repositories.
  - `POST /api/github/publish`: Commits solution code and markdown metadata directly to chosen repository and branch.
- **Request Payload**:
  ```json
  {
    "repoName": "username/dsa-solutions",
    "branch": "main",
    "filePath": "Arrays/two-sum/solution.js",
    "commitMessage": "feat(two-sum): add javascript solution [Easy]",
    "fileContent": "...",
    "problemMetadata": { "id": "two-sum", "difficulty": "Easy", "topics": ["Arrays", "Hash Map"] }
  }
  ```
- **Security Notice**: Practise never prompts for GitHub passwords or stores OAuth client secrets in browser code.

### 5.3 AI Assistant Service (`aiService.js`)
- Supports **Google Gemini** (`gemini-1.5-flash`) and **OpenAI** (`gpt-4o-mini`).
- Features 4 distinct modes:
  1. **Review**: Analyzes code quality, bugs, edge cases, and time/space complexity.
  2. **Progressive Hints**: Delivers 3 incremental hint levels without giving away the full solution.
  3. **Generate Tests**: Produces 5 tricky test cases including boundary and stress inputs.
  4. **Explain Code**: Explains the algorithmic mental model and invariants step by step.
- API keys are stored masked in the user's browser `localStorage` and never transmitted to untrusted endpoints.

---

## 6. Verification & Test Workflow

1. **Global Navigation & Command Palette**:
   - Press `⌘K` or `Ctrl+K` to trigger the instant problem switcher modal.
   - Navigate with keyboard arrows and press `Enter` to open any problem.
2. **Coding Workspace**:
   - Navigate to `/workspace/two-sum`.
   - Switch languages between JavaScript, Python, C++, and Java; verify starter templates load.
   - Type custom code; notice the draft status pill displays `Saved`. Switch languages and switch back; verify code draft is preserved.
   - Click **Run**; inspect execution response and diagnostics in the collapsible bottom console.
   - Click **Editorial** tab to inspect the intuition, time/space complexity, and algorithm steps.
   - Switch to **Personal Notes** tab; enter notes and verify persistence.
3. **Problem Directory**:
   - Filter by Company (e.g. `Google`), Difficulty (`Medium`), or Topic (`Arrays`).
   - Click the bookmark icon; verify the Bookmarks page counter updates in the sidebar.
   - Click problem status badge to cycle between `Todo`, `In Progress`, and `Solved`.
4. **Mock Interview**:
   - Go to `/mock-interviews`, select a 45-minute round and start.
   - Verify countdown timer ticks and persists across component rerenders.
   - Run tests, check off completed problems, and finish session to view the performance recap.
5. **Revision Planner**:
   - Schedule a revision reminder with a target date and focus note.
   - Verify categorization into Due Today, Upcoming, or Completed.
6. **Data Export & Settings**:
   - Go to `/settings`, change theme to Light and back to Dark.
   - Export JSON backup; open the downloaded file to verify schema and exclusion of API keys.
   - Test application state reset with the confirmation modal.
