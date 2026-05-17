# Session Architecture — Implementation Guide

## Overview

AI Saathi's session system transforms the flat chat experience into a structured 3-phase therapy workflow:

```
/session/prep → /session/active → /session/summary/:id
```

## Architecture

### State Management

`SessionContext` (src/context/SessionContext.tsx) manages:
- **Arc progress**: Session number (1–24), week count (1–12)
- **Weekly budget**: 3 sessions/week, hard lockout when exhausted
- **Active session**: Goal, mood, start time, session ID
- **Last session**: Summary and date for the prep screen

Access via `useSession()` hook from any component.

### Route Structure

| Route | Page | Purpose |
|-------|------|---------|
| `/home` | Home.tsx | Dashboard with SessionBudgetWidget |
| `/session/prep` | SessionPrep.tsx | Pre-session intention setting |
| `/session/active` | SessionActive.tsx | Therapy conversation with timer |
| `/session/summary/:id` | SessionSummary.tsx | Post-session VAD + insights |
| `/chat` | *(redirect)* | → /session/prep (backwards compat) |
| `/history` | SessionHistory.tsx | Session timeline |
| `/history/trends` | HistoryTrends.tsx | 3-month VAD trend graph |
| `/history/:id` | SessionTranscript.tsx | Full transcript view |

### Component Map

```
src/components/session/
├── SessionBudgetWidget.tsx   → Dashboard widget (weekly counter + CTA)
├── SessionChatArea.tsx       → Chat wrapper with session header + timer
├── SessionNudge.tsx          → Time-based soft nudge banners
├── VADMiniChart.tsx           → Reusable mini VAD line chart
└── VADTrendGraph.tsx          → Full-size 3-month trend graph
```

### Session Flow

1. User lands on `/home` → sees `SessionBudgetWidget` with remaining sessions
2. Clicks "Start Session" → navigates to `/session/prep`
3. Sets mood + intention → clicks "Start Session" → `startSession()` creates ID
4. Navigates to `/session/active` with session context
5. Chat proceeds using existing `useChat` hook + `SessionChatArea` wrapper
6. Timer tracks elapsed time; nudges appear at 45/60/90 minutes
7. User clicks "End Session" → navigates to `/session/summary/:id`
8. Summary shows VAD chart, insights, homework, CTAs back to dashboard

### Weekly Budget Logic

- 3 sessions per week (constant: `SESSIONS_PER_WEEK`)
- Hard lockout when 0 remaining (cannot start new session)
- Crisis override always available (`/escalation`)
- Sessions reset every Monday (calculated via `daysUntilReset`)

### Design System Compliance

All components use:
- `--saathi-*` CSS variables for colors
- `.saathi-card`, `.saathi-btn-coral`, `.saathi-btn-outline` classes
- `.saathi-textarea`, `.saathi-input` for form elements
- Framer Motion with `initial={{ opacity: 0, y: 20 }}` stagger pattern
- `var(--font-app)` (Inter), `var(--font-serif)` (Instrument Serif)

### VAD Color Coding

| Dimension | Color Variable | Hex |
|-----------|---------------|-----|
| Valence (Mood) | `--saathi-coral` | #E8643A |
| Arousal (Energy) | `--saathi-moderate` | #EF9F27 |
| Dominance (Control) | `--saathi-calm` | #1D9E75 |

---

## Clinical Edge Cases (Implemented)

### 1. Mid-Session Persistence (Browser Crash Recovery)

**File:** `src/context/SessionContext.tsx`

Active session state (`sessionId`, `startTime`, `goal`, `mood`, `sessionNumber`, `sessionsUsedThisWeek`) is persisted to `localStorage` under the key `saathi_active_session`.

- **On mount**: Provider reads localStorage and rehydrates state if a valid session is found.
- **Staleness guard**: Sessions older than 4 hours are auto-discarded (likely abandoned).
- **On end**: `endSession()` calls `clearPersistedSession()` to remove the localStorage entry.
- **Result**: Browser crash, tab close, or Wi-Fi drop does NOT erase a clinical hour.

### 2. Crisis Shortcut (Gate 7 → /escalation)

**File:** `src/pages/SessionActive.tsx`

A `useEffect` watches `chatState.emotionalState`. When the backend perception layer sets it to `"high_distress"` (Gate 7 Crisis):

1. `crisisTriggeredRef` prevents double-fire
2. `endSession()` is called to clean up context + localStorage
3. `navigate("/escalation", { replace: true })` force-routes immediately
4. `/session/summary` is **completely bypassed** — safety overrides closure

The existing `useChat.escalateToSupport()` also fires from within the chat hook, but `SessionActive` adds a second safety net that ensures context cleanup and route replacement.

### 3. Intention Injection (Skip Small Talk)

**File:** `src/hooks/useChat.ts`

The opening message priority chain is now:

```
1. Crisis return → "I'm here for you."
2. Intention set → "I see you want to work on [X] today..." (SKIPS generic opener)
3. Returning user → "Last time we talked about..."
4. Default → "How would you like to begin?"
```

The `intention` field flows from:
- `SessionPrep.tsx` → sets it in `location.state.intention`
- `SessionActive.tsx` → passes it through to useChat via `location.state`
- `useChat.ts` → reads `state?.intention` and generates focused opening message

This allows the LLM to skip "How are you?" and dive directly into: *"I see you want to work on your anxiety about the performance review — let's explore that together."*
