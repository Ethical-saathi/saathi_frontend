# API Endpoints — Session System

These endpoints are required by the frontend session architecture.
All are currently mocked in the frontend; implement on the backend when ready.

---

## Session Management

### `GET /api/session/current`

Returns the user's current session arc state.

**Response:**
```json
{
  "session_number": 5,
  "total_sessions": 24,
  "weeks_elapsed": 3,
  "total_weeks": 12,
  "sessions_used_this_week": 1,
  "sessions_per_week": 3,
  "last_session_summary": "You talked about work pressure...",
  "last_session_date": "2026-03-16"
}
```

---

### `POST /api/session/start`

Creates a new session. Called when user clicks "Start Session" from prep screen.

**Request:**
```json
{
  "mood": "Anxious",
  "intention": "I want to talk about my anxiety at work",
  "session_number": 6
}
```

**Response:**
```json
{
  "session_id": "uuid-v4",
  "opening_context": "Based on your last session about work pressure..."
}
```

---

### `POST /api/session/end`

Finalizes a session. Called when user clicks "End Session".

**Request:**
```json
{
  "session_id": "uuid-v4",
  "duration_minutes": 35
}
```

**Response:**
```json
{
  "session_id": "uuid-v4",
  "duration": 35,
  "vad_data": [
    { "turn": 1, "valence": 0.32, "arousal": 0.71, "dominance": 0.28 },
    { "turn": 2, "valence": 0.35, "arousal": 0.65, "dominance": 0.33 }
  ],
  "insights": [
    "Your anxiety stems from uncertainty, not inability.",
    "You showed strong regulation in the second half."
  ],
  "homework": "Write down three things that went well each day."
}
```

---

### `GET /api/session/:id/summary`

Fetches the post-session summary for display on the summary page.

**Response:** Same shape as the `POST /api/session/end` response.

---

## VAD / Trends

### `GET /api/vad/trends`

Returns aggregated VAD data for the 3-month trend graph.

**Query params:** `?months=3`

**Response:**
```json
{
  "data": [
    { "session": "S1", "valence": 0.35, "arousal": 0.65, "dominance": 0.30 },
    { "session": "S2", "valence": 0.38, "arousal": 0.60, "dominance": 0.35 }
  ],
  "notices": [
    "You mention 'work stress' in 7 of 12 sessions",
    "Your mood has improved 89% since Session 1"
  ],
  "milestones": [
    { "session": 3, "text": "First breakthrough: Identified anxiety triggers" }
  ]
}
```

---

## Chat (Existing — No Changes)

### `POST /api/chat/message`

Send a user message and receive Saathi's response.
This endpoint already exists; the session system passes additional context:

**Request (enhanced):**
```json
{
  "session_id": "uuid-v4",
  "message": "I've been feeling anxious...",
  "session_context": {
    "session_number": 6,
    "session_goal": "Talk about work anxiety",
    "last_session_summary": "You explored work pressure last time..."
  }
}
```

**Response:** Unchanged from current implementation.
