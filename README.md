<div align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white" alt="Framer Motion" />
</div>

<br/>

<div align="center">
  <h1>🌟 AI Saathi <span>Frontend Environment</span></h1>
  <p>
    <strong>A purely emotional, cinematic, and interactive intelligence system interface.</strong><br/>
    <em>"The AI that doesn't just hear you — it remembers how you feel."</em>
  </p>
</div>

---

## 📖 The Philosophy

Most chatbots process words. **AI Saathi processes humans.**  
This repository houses the frontend architecture of AI Saathi, built with an emphasis on **emotional storytelling, deep visual empathy, and high-fidelity micro-interactions.** 

We designed this UI to break the loop of traditional therapeutic AI interfaces—where you have to re-explain yourself every session—and introduced a dynamic, emotionally continuous system that reacts in real-time to the user's state.

## 🚀 Core Features

- ✨ **Cinematic Interactivity:** A visually stunning homepage that leverages **Framer Motion** and custom context-driven SVG components to create a living, breathing interface.
- 🔮 **The Emotional Orb (`BreathingOrb.tsx`):** A custom-engineered, state-driven SVG character that changes its shape, aura, and breathing patterns based on therapeutic context (Anxiety, Hope, Overwhelmed, etc.).
- 🌊 **Emotion Engine Visualization:** A real-time waveform visualization system (`EmotionWaveform.tsx`) that visually translates the AI's internal processing metrics into gorgeous fluid dynamics.
- 🎨 **Claymorphism & Glassmorphism:** Our CSS architecture deviates from standard flat design, utilizing custom **Tailwind utility extensions** for immersive, tactile UI layers.
- 📱 **Adaptive Responsiveness:** Fully fluid architecture that morphs complex scroll-driven timeline layers seamlessly into vertical stacks for mobile hardware.

---

## 🛠️ Technology Stack

| Ecosystem | Technology | Description |
| --- | --- | --- |
| **Core Framework** | [React 18](https://reactjs.org/) + [Vite](https://vitejs.dev/) | Lightning-fast HMR and optimized production builds. |
| **Language** | [TypeScript](https://www.typescriptlang.org/) | Strictly typed for bulletproof component scalability. |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) + Shadcn | Utility-first styling combined with our custom cinematic token palette. |
| **Animation** | [Framer Motion](https://www.framer.com/motion/) | Orchestrating complex enter/exit, parallax, and component morphing algorithms. |
| **Icons & Tooling** | Lucide React | Clean, scalable vector icon integration. |

---

## ⚙️ Local Development

### 1. Repository Setup
Ensure you have Node.js installed, then clone and open the project:

```bash
git clone https://github.com/Ethical-saathi/saathi_frontend.git
cd saathi_frontend
# Note: Root directory is named 'frontend_for _saathi' internally
```

### 2. Environment Variables
To authenticate with the backend and utilize database states, create a `.env` file at the root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
```
*(Note: These are explicitly excluded via `.gitignore` to protect production secrets).*

### 3. Install & Run
Boot up the development environment:

```bash
npm install
npm run dev
```
Navigate to `http://localhost:8080` (or your Vite configured port) to see the magic.

---

## 📂 Architecture Overview

- **`src/pages/`**: Higher-order route wrappers. `LandingPage.tsx` orchestrates the entire cinematic flow.
- **`src/components/landing/`**: The heart of the aesthetic. Contains all modular layers (`Hero.tsx`, `ProblemSolution.tsx`, `Architecture.tsx`, etc.).
- **`src/index.css`**: Not just standard resets. This file contains the overarching "living" gradients, layered shadows, and complex CSS custom custom cursors that define the AI Saathi brand. 

> *Designed to listen. Built to remember.*
