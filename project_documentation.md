# Beginner's Guide to MindEase: Project Documentation

Welcome to **MindEase**! If you are new to the project or to web development in general, this guide is designed to explain exactly what this application is, how the pieces fit together from scratch, and how the user travels through the app.

---

## 1. Project Overview

**MindEase** is an AI-powered mental health support web application. Users can log in, answer a few onboarding questions about how they feel, and then chat with a virtual AI companion named **Saathi**. 

### The Technology Stack (What we built this with)
* **Frontend Framework:** React 18, utilizing Vite for high-speed local development and building.
* **Language:** TypeScript (adds structured rules to JavaScript to catch errors early).
* **Styling:** Tailwind CSS (utility classes) combined with a custom "Claymorphism" and flat card design system.
* **Animations:** Framer Motion (used for smooth page transitions, petals falling, and UI popups).
* **Backend & Database:** Supabase (handles our user logins, Google Authentication, and database storage for profiles).

---

## 2. The User Flow (How someone uses the app)

Understanding how a user moves through the app makes it much easier to understand the code. Here is the step-by-step journey of a user:

### Step 1: The Landing Page (`/`)
When a user first visits the site, they are greeted by a beautiful, animated landing page. This page explains the benefits of the app, shows testimonials, and features a falling petal animation. 
* **Component:** `Index.tsx` gathers all parts from `LandingPage.tsx`.

### Step 2: Authentication (`/auth`)
If the user decides to join, they click "Start Free Session" and are taken to the Auth screen. 
* They can choose to sign up using an **Email/Password** or click **Continue with Google**.
* Under the hood, this communicates with **Supabase Authentication**. Upon success, a trigger in our database automatically creates a user profile for them.

### Step 3: Onboarding (`/onboarding`)
Before a brand new user talks to the AI, we need context. 
* They are shown a series of beautiful cards asking how their day was, what is sitting heavy on their mind, and what their name is. 
* **Component:** `Onboarding.tsx` manages this step-by-step card flow. 

### Step 4: The Chat Interface (`/chat`)
This is the core of the app. Users text back and forth with "Saathi". 
* As the user types, the application has a special **LED Mood Indicator** that changes color based on what the user says (e.g., green for calm, red for distress).
* **Component:** `Chat.tsx` and the `useChat.ts` hook manage all the messaging logic.

### Step 5: Crisis Escalation (`/escalation`)
MindEase is designed to keep users safe. If a user types trigger words in the chat like *"panic"* or *"can't breathe"*, the app immediately intercepts the message and redirects them to a full-screen **Crisis Escalation** page. Here, they are provided with real emergency hotlines to call.

---

## 3. How the Features Actually Work (Under the Hood)

If you are looking at the code and wondering how things function, here are the main engines driving the app:

### The Chat Engine (`src/hooks/useChat.ts`)
Instead of connecting to an expensive real live AI right away during development, the chat currently uses a smart "mock" (fake) system inside custom React Hooks. 
1. When a user sends a message, `useChat.ts` intercepts it.
2. It pauses for 1.5 seconds and shows a "typing..." indicator to feel human.
3. It checks the user's message for specific keywords.
4. It sets the user's emotional state (which changes the LED colors in the app) and sends a pre-determined empathetic response back to the screen.

### Authentication & Profile Fetching (`src/components/auth/AuthProvider.tsx`)
Because many pages (like Chat and Home) are restricted to logged-in users only, we wrap our app in an `AuthProvider`.
1. When the app loads, `AuthProvider` asks Supabase securely: *"Is anyone logged in?"*
2. If yes, it fetches their `user_profile` (their name, notification settings, etc.) from the database in the background.
3. If a user tries to visit `/chat` without being logged in, our `<ProtectedRoute>` component catches them and safely redirects them back to the `/auth` page.

### The Appearance & Styling
The application relies heavily on two aesthetic styles:
1. **Claymorphism:** Used on the public landing page. Look in `src/index.css` for classes like `.clay-card` and `.clay-button` which use complex inner and outer shadows to look like 3D soft clay.
2. **Clean Minimalist Interfaces:** Inside the private app (Chat, Home), the app switches to a very clean, flat white card system to reduce visual clutter for mental wellness.

---

## 4. File Structure Breakdown

When you open the `src/` folder, here is where you should look to find things:

```text
src/
├── components/           # Reusable UI building blocks
│   ├── auth/             # Login protection and Context providers
│   ├── chat/             # Chat bubbles, sidebars, text inputs
│   ├── layout/           # Shared page wrappers (like the Main Layout)
│   ├── onboarding/       # The individual question cards for onboarding
│   └── ui/               # Generic UI items like Buttons, Animations, Toasts
│
├── hooks/                # Custom React logic (the "brains" of the components)
│   ├── useChat.ts        # Handles sending/receiving messages and crisis triggers
│   └── useProfileSettings.ts # Handles saving data to the database
│
├── lib/                  # Utilities and third-party setups
│   └── supabaseClient.ts # Where the app connects to the Supabase database
│
└── pages/                # The actual screens the user navigates between (13 pages total)
    ├── About.tsx         # /about
    ├── Auth.tsx          # /auth
    ├── Chat.tsx          # /chat
    ├── CrisisEscalation.tsx # /escalation (Emergency redirect)
    ├── Help.tsx          # /help
    ├── Home.tsx          # /home (User dashboard)
    ├── Index.tsx         # / (Landing page wrapper)
    ├── LandingPage.tsx   # Included in Index
    ├── LedTest.tsx       # /led-test (Testing tool)
    ├── NotFound.tsx      # 404 Error page
    ├── Onboarding.tsx    # /onboarding
    ├── Profile.tsx       # /profile
    └── SessionHistory.tsx # /history
```

---

## 5. Quick Developer Start Guide

If you want to run this code on your own machine:

1. **Install Dependencies:** Run `npm install` in the terminal to download all the required packages like React and Tailwind.
2. **Environment Variables:** Create a `.env` file in the root directory. You need to supply `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY` to connect to the database. (Refer to `database_documentation.md` for details).
3. **Start the Server:** Run `npm run dev`.
4. **View the App:** Open your browser to the `localhost` link provided in the terminal. As you make code changes and save the files, Vite will instantly update the browser.
