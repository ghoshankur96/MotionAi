# AI-Powered Meeting-to-Action Automation Bot

An automated meeting intelligence and task management system built with n8n, OpenAI/Gemini AI, Telegram Bot API, Google Sheets, and Trello. Transforms raw transcripts and `.txt` documents into trackable action items, enforces implicit ownership and deadline detection, prevents duplicates via deterministic hashing, updates clarified tasks, and broadcasts structured summaries to Telegram groups.

## User Review & Critical Decisions

> [!IMPORTANT]
> All three architectural choices have been confirmed and incorporated into the design:
> 1. **Dual Task Synchronization**: Both Google Sheets (9 required columns) and Trello (Kanban cards with label badges) are synchronized simultaneously in real time.
> 2. **Hybrid AI Engine**: Real server-side inference powered by Gemini 2.5 Flash via Express backend proxy, paired with a deterministic rule-based meeting analyst engine for guaranteed offline testing and evaluation.
> 3. **Conversational Clarification Loop**: Telegram chat replies (e.g., *"Priya's deadline is next Wednesday"*) match existing stable task hashes (`MTG-TASK-HASH`) to update records in place without creating duplicate rows or cards.

---

## 1. Overview & Core Concept

- **What It Does**: Listens for meeting conversation transcripts via Telegram (text paste or `.txt` file upload), validates inputs, passes sanitized transcripts to an AI analysis prompt, parses structured JSON, extracts action items with implicit ownership and deadline tracking, creates/updates tasks in Google Sheets and Trello, identifies missing information, and delivers a formatted Markdown summary (`📋 MEETING SUMMARY`, `✅ ASSIGNED TASKS`, `⚠️ INCOMPLETE TASKS`, `❓ CLARIFICATION REQUIRED`, `📌 NEXT ACTION`) to the team Telegram group.
- **Target Audience**: Engineering leads, Scrum Masters, product managers, and automation engineers seeking zero-copy meeting task handoffs.
- **Key Value**: Eliminates manual copying between meeting notes, Telegram, Google Sheets, and Trello while guaranteeing zero lost action items and zero duplicate entries.

---

## 2. User Experience & Visual Design

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Utilitarian developer & automation workbench adhering to the SaaS & Dashboard visual constitution (dark slate `#020617` canvas, clean 1px hairline borders `#1e293b`, high-contrast typography, zero-pill metadata discipline, and single-elevation cards).
  - *Color Palette & Accent Budget*:
    - 60% Canvas: Neutral Deep Slate (`#020617` and `#0f172a`).
    - 30% Structural Surfaces: Subtle card borders (`#1e293b`), elevated toolbars (`#0f172a/80`), tabular grids.
    - 10% Accent Intent: Electric Indigo (`#6366f1`) for active CTAs and executing pipeline nodes; Emerald (`#10b981`) for Assigned status; Amber (`#f59e0b`) for Missing Deadline; Rose (`#f43f5e`) for Incomplete / Missing Owner.
  - *Typography & Hierarchy*:
    - Display & Titles: `Plus Jakarta Sans` (weights 600–700) with balanced line wraps.
    - Body Prose: `Plus Jakarta Sans` (13px–15px, 1.55 line height).
    - Code & Data Telemetry: Strict monospace tabular numerals (`JetBrains Mono`, `tabular-nums`) across all Task IDs, dates, and execution metrics.
  - *Top Bar Contract*: Strict 3-zone layout:
    - Zone 1: Wordmark `MeetingToAction` with quiet `n8n · GPT-4o` descriptor.
    - Zone 2: Single-line navigation links (`Live Simulator`, `n8n Workflow`, `Google Sheets`, `Trello Board`, `Audit Logs`, `Setup Guide`).
    - Zone 3: Primary action button `Export n8n JSON`.

- **Key User Flows**:
  1. **Direct Transcript Ingestion**: User pastes meeting text or uploads a `.txt` file into the private Telegram bot interface.
  2. **Automated Pipeline Execution**: Visual n8n workflow canvas displays step-by-step node execution pulses from Telegram Trigger through Google Sheets/Trello upserts.
  3. **Verification & Summary Broadcast**: Team Telegram Group automatically receives the structured Markdown summary with assigned vs. incomplete task sections.
  4. **Conversational Clarification**: User types a follow-up clarification message in Telegram (e.g., *"David will take project documentation with deadline Nov 18"*); the workflow detects the target task via stable hash and updates both Google Sheets and Trello without duplicate records.
  5. **1-Click n8n Production Export**: User copies or downloads the valid, ready-to-import `n8n-meeting-workflow.json` with all credentials, environment variable bindings, and node scripts.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Deterministic Stable Task Hashing**
  - *Approach*: Task ID is generated via `Slug(MeetingTitle) + '-' + Slug(TaskTitle) + '-' + Hash4(MeetingTitle + TaskTitle)`.
  - *Why*: Guarantees idempotency. Re-running the exact same transcript or clarifying an unassigned task resolves to the identical Task ID, converting an insert into an update.
  - *Trade-Off*: Minor wording variations in manual clarification require fuzzy keyword matching against known task descriptions or assigned owners.

- **Decision 2: Dual Google Sheets + Trello Upsert Engine**
  - *Approach*: Simultaneous data sync. Google Sheets stores raw structured tabular records with all 9 mandated columns; Trello renders a visual Kanban board with status columns and color-coded labels (`missing-deadline`, `missing-owner`, `high-priority`).
  - *Why*: Allows cross-functional teams to query tabular spreadsheets or track visual drag-and-drop cards without switching tools.

- **Decision 3: Multi-Layered Validation & Graceful Telegram Error Recovery**
  - *Approach*: Dedicated validation node checks for empty transcripts, non-TXT file types, corrupted uploads, and transcripts exceeding 50,000 characters, returning immediate actionable feedback to the Telegram sender rather than failing silently.

---

## 4. Technical Architecture & Data Strategy

### System & Pipeline Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                        n8n AUTOMATION PIPELINE                         │
└────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │    1. Telegram Trigger    │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │  2. Input Type Detection  │
                      └──────┬─────────────┬──────┘
                             │ (doc)       │ (text)
                             ▼             ▼
                      ┌───────────────────────────┐
                      │ 3. Message/TXT Extraction │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │    4. Input Validation    │──(Invalid)─► [4b. Telegram Error Reply]
                      └─────────────┬─────────────┘
                                    │ (Valid)
                                    ▼
                      ┌───────────────────────────┐
                      │ 5. Transcript Processing  │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 6. OpenAI/Gemini Analysis │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │  7. JSON Parsing & Repair │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │   8. Output Validation    │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 9. Action Item Extraction │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │  10. Duplicate Detection  │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 11. Sheets & Trello Sync  │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 12. Incomplete Task Check │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 13. Meeting Summary Gen   │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 14. Telegram Group Notify │
                      └─────────────┬─────────────┘
                                    │
                                    ▼
                      ┌───────────────────────────┐
                      │ 15. Execution Audit Log   │
                      └───────────────────────────┘
```

### Data Model & Schema Contract

#### Google Sheets (9 Required Columns)
1. `Task ID` (`string`, e.g., `SPRI-FRONT-7B1A`)
2. `Meeting Title` (`string`)
3. `Task Description` (`string`)
4. `Assigned Owner` (`string`, e.g., `Rahul` or `Unassigned`)
5. `Deadline` (`string`, e.g., `Friday` or `Missing`)
6. `Priority` (`High` | `Medium` | `Low`)
7. `Task Status` (`Assigned` | `Missing Owner` | `Missing Deadline` | `Needs Clarification` | `Incomplete` | `Completed`)
8. `Missing Information` (`string[]` joined by `; `)
9. `Created Date` (`YYYY-MM-DD`)

#### Trello Board Structure
- **Lists**: `Backlog / Needs Clarification`, `In Progress`, `Review & QA`, `Completed`
- **Card Format**:
  - Title: Task description
  - Description: Meeting title, assigned owner, deadline, and clarification checklist
  - Labels: `high-priority` (red), `missing-deadline` (amber), `missing-owner` (purple), `assigned` (green)

### Implementation Roadmap

1. **State Store & Execution Engine (`src/App.tsx`)**:
   - Manage unified state for tasks, telegram chats (Bot & Group), execution logs, active tab, and running pipelines.
   - Wire backend `/api/analyze-meeting` with fallback deterministic analysis for the sample transcript (Rahul, Priya, Documentation).
2. **Trello Kanban View (`src/components/TrelloBoardView.tsx`)**:
   - Build responsive 4-column drag-and-drop visual board with card badges, member avatars, and checklist inspection.
3. **Audit Log & Trace Viewer (`src/components/ExecutionLogsView.tsx`)**:
   - High-density telemetry view showing execution IDs, latency, node-by-node in/out data, and status codes.
4. **n8n Workflow Exporter (`src/components/WorkflowExportModal.tsx`)**:
   - Code viewer with 1-click clipboard copy, `.json` file download, and `.env` template generator.
5. **Setup & Deployment Guide (`src/components/DocumentationView.tsx`)**:
   - Comprehensive documentation covering Telegram BotFather credentials, OpenAI system prompt, Google Sheets Service Account OAuth, Trello API tokens, and duplicate detection algorithms.
6. **End-to-End Verification**:
   - Run compilation and TypeScript validation (`npm run build`).
