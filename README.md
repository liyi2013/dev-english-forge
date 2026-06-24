# DevEnglish Forge

**DevEnglish** is an AI-powered technical English and interview practice platform for Chinese software engineers. This is a **frontend-only mock prototype** built with Vite + React + TypeScript.

## Project Purpose

Chinese software engineers often struggle with technical English in interviews and workplace communication. DevEnglish helps them practice:

- **Technical English** — explaining APIs, databases, caching, and system design in English
- **Interview English** — self-introduction, STAR project stories, technical Q&A
- **Workplace English** — standups, code review comments, emails, meetings
- **AI Mock Interviews** — simulated voice interviews with structured feedback reports
- **Review & Spaced Repetition** — weak point tracking, vocabulary saving, sentence patterns

## Mock-Only Frontend Scope

This is a **complete frontend prototype** with mock data and local state only:

- ❌ No real backend API
- ❌ No database
- ❌ No authentication
- ❌ No payment or membership
- ❌ No AI API integration

All "AI" features (interview scoring, live analysis, feedback) are simulated with pre-defined mock data.

## Main Routes

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Today's focus, plan, weak skills, recommendations |
| `/learning` | Learning Center | Three learning paths with modules |
| `/technical-english` | Technical English | Topic list with progress and explain goals |
| `/technical-english/:topicSlug` | Topic Detail | Read, Vocabulary, Sentence, Speak, Interview tabs |
| `/interview-english` | Interview English | Scenarios, STAR pattern, question banks |
| `/workplace-english` | Workplace English | Scenarios, useful phrases, mini-drills |
| `/ai-interview` | AI Interview Lobby | Mode selection, configuration |
| `/ai-interview/room` | Interview Room | Mock questions, recording, live analysis |
| `/ai-interview/report` | Interview Report | Scores, deep dive, recommended learning |
| `/review` | Review Center | Wrong answers, vocabulary, sentences, reports |
| `/profile` | Profile | Skill profile, preferences, activity |
| `/search` | Search | Search across topics, vocabulary, questions, reports |

## i18n Strategy

- Default locale: **zh-CN** (Chinese first)
- Fallback: **en-US**
- UI navigation, labels, buttons, empty states → fully translated
- Technical content (reading passages, ideal answers, sentence patterns) → kept in English
- Vocabulary terms → bilingual (English definition + Chinese explanation)
- Locale persisted in `localStorage`
- Language switcher available in TopHeader and Profile

### Translation files

- `src/i18n/locales/zh-CN.ts` — Chinese translations
- `src/i18n/locales/en-US.ts` — English translations
- `src/i18n/index.ts` — i18n runtime with locale change listeners

## Mock Data Structure

All mock data is centralized in `src/data/`:

| File | Content |
|---|---|
| `mockTopics.ts` | 6 technical topics with full content (RESTful API, Redis Cache, Database, RabbitMQ, Docker, CI/CD) |
| `mockLearningPaths.ts` | 3 learning paths with modules |
| `mockDashboard.ts` | Dashboard data (focus, plan, weak skills, streak, level) |
| `mockInterviewSessions.ts` | Interview questions by mode |
| `mockReports.ts` | Completed interview reports with scores and analysis |
| `mockReviewItems.ts` | Wrong answers, weak points |
| `mockVocabulary.ts` | General technical vocabulary |
| `mockProfile.ts` | User profile, skills, activities |

## LocalStorage Persistence

Handled by `src/lib/mockStorage.ts`:

- `locale` — selected UI language
- `vocab` — saved vocabulary items
- `sentences` — saved sentence patterns
- `completed` — completed lesson slugs
- `review_queue` — review queue items
- `interview_config` — last interview configuration
- `interview_progress` — in-progress interview answers
- `reports` — completed report metadata

## TypeScript Types

All types are centralized in `src/types/`:

- `learning.ts` — LearningTopic, VocabularyItem, SentencePattern, SpeakingPrompt, InterviewQuestion, LearningPath
- `interview.ts` — InterviewSession, InterviewReport, InterviewConfig, InterviewQuestionItem
- `review.ts` — ReviewItem, WeakPoint
- `profile.ts` — UserProfile, SkillProfile, CoreSkill, DomainSkill, ActivityItem

## How to Run Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Key Components

Reusable components are located in `src/components/common/`:

- `TopicCard` — topic display card with progress
- `ScoreBreakdown` — score list with progress bars
- `AnswerGapPanel` — interview answer gap analysis
- `RecommendedLearningCard` — recommended learning link card
- `WeakPointCard` — weak point display card
- `EmptyState` — empty state with icon, title, action
- `LanguageSwitcher` — locale toggle button
- `SaveButton` — save/unsaved toggle button

## Notes for Future Vue3 + ASP.NET Core Migration

The project is organized to make migration straightforward:

1. **Types** in `src/types/` → can be directly converted to TypeScript interfaces for Vue
2. **Mock data** in `src/data/` → replace with API calls to ASP.NET Core endpoints
3. **i18n** in `src/i18n/` → Vue i18n compatible structure
4. **Routing** mirrors the page structure — each page maps to a Vue route
5. **Components** follow a pattern of small, reusable UI pieces
6. **No framework-specific magic** — plain React hooks and components
7. **State management** uses React Query (TanStack Query) — replaceable with Pinia/Vue Query
8. **CSS variables** in `index.css` make theming reusable across frameworks

### Migration Order

1. Set up ASP.NET Core backend with RESTful API
2. Replace mock data with API calls (one module at a time)
3. Migrate Types to shared TypeScript package
4. Migrate i18n translations (same key structure)
5. Rebuild UI components in Vue with same CSS variables

## Tech Stack

- Vite 5 + React 18 + TypeScript
- Tailwind CSS 3 + shadcn/ui
- React Router v6
- TanStack React Query
- Vitest + Testing Library
