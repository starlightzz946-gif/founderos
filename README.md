# FounderOS — AI Co-Founder with Live Market Intelligence

FounderOS is an AI-powered Founder Operating System designed for startup validation, strategic planning, and execution.

It equips early-stage founders with an end-to-end advisory engine to:
- **Analyze startup ideas** across viability, market timing, and defensibility
- **Evaluate founder–idea fit** by aligning founder backgrounds with venture requirements
- **Assess startup viability** and market demand
- **Analyze competitors** and incumbent market dynamics
- **Identify SWOT factors** (strengths, weaknesses, opportunities, and threats)
- **Identify founder skill gaps** and operational blind spots
- **Recommend targeted learning resources** to bridge capability gaps
- **Plan an MVP** including technical architectures, database schemas, and user flows
- **Create revenue strategies** from early monetization to scale
- **Build 30/60/90-day execution roadmaps** with tactical weekly milestones
- **Interact with an AI mentor/investor assistant** for continuous strategic advisory

---

## Hackathon Disclosure

### SerpApi India Hackathon 2026

> **"FounderOS was an existing project before the hackathon. For the SerpApi India Hackathon 2026, the project was extended with a live, evidence-grounded Market Intelligence system powered by SerpApi."**

While FounderOS previously relied on foundation model parametric knowledge for venture assessments, the SerpApi integration introduces real-time web grounding. This ensures that every competitor matrix, customer pain point signal, pricing observation, and industry trend is anchored in current web evidence.

---

## Hackathon Innovation

Traditional LLM-based startup validation platforms rely almost entirely on pre-trained knowledge cutoffs. For fast-moving markets, emerging regional ecosystems, and localized technologies (such as India's UPI payments infrastructure), static model knowledge risks missing active competitors, recent regulatory changes, and authentic consumer demand patterns.

FounderOS solves this problem by conducting automated, multi-engine web research via **SerpApi** *before* running AI analysis. Real-world search evidence is retrieved, parsed, and synthesized directly into the evaluation pipeline.

### Research Architecture

```
Founder Profile + Startup Idea
              ↓
  FounderOS Research Planner
              ↓
           SerpApi
   ├── Google Search (Competitors & Alternatives)
   ├── Google News (Industry Trends & Regulatory Shifts)
   ├── Google Shopping (Product Pricing Benchmarks - when relevant)
   └── Google Maps (Local Competitors & Providers - when relevant)
              ↓
     Live Market Evidence
              ↓
       Gemini Analysis
              ↓
  FounderOS Comprehensive Startup Report
```

### Real-World Evidence Grounding

SerpApi is not used as a cosmetic endpoint or simple link fetcher. It delivers structured market evidence that directly grounds the final FounderOS report:
- **Direct Incumbent Competitors:** Discovered active products, web platforms, and mobile apps in the target space.
- **Alternative Products & Solutions:** Indirect alternatives, legacy workflows, and global equivalents.
- **Recent Industry News:** Timely industry developments, funding rounds, and regulatory shifts.
- **Customer Questions & Signals:** Real-world search inquiries and pain points extracted from Google's search graph.
- **Pricing Signals:** Live pricing benchmarks via Google Shopping when the venture involves physical or hardware products.
- **Local Competitors:** Geographic business listings via Google Maps when the venture operates as a local field service.
- **Verified Source Citations:** Full source URLs and evidence snippets linked directly within the UI.

### Context-Aware Relevance Pipeline

To ensure the analysis is not diluted by generic web pages or unrelated corporate giants, FounderOS incorporates a server-side relevance pipeline:
1. **Context Extraction:** Analyzes venture concept, target audience, core problem, geography, and business model.
2. **Focused Query Generation:** Synthesizes domain-specific queries targeting real competitors and market signals rather than broad keywords.
3. **Blacklist & Entity Filtering:** Blocks mega-platforms (e.g., Shopify, Alibaba, TikTok, Google) from being misclassified as direct startup competitors unless genuinely relevant.
4. **Article vs. Product Separation:** Distinguishes editorial publications, blog listicles, and news articles from actual software products. Articles are retained as market evidence sources, while mentioned products are extracted as competitors.
5. **Relevance Scoring:** Evaluates candidates across category keywords, problem alignment, target audience matching, and geographic relevance.
6. **Competitor & Alternative Classification:** Separates direct market incumbents from indirect alternatives and global proxies.
7. **Signal & News Prioritization:** Ranks customer inquiries and news items by semantic relevance to the founder's specific problem.
8. **Transparent Fallback:** If insufficient relevant evidence exists for a narrow niche, FounderOS explicitly notes this rather than populating the report with unrelated results.

---

## SerpApi Integration

### How SerpApi Powers FounderOS

FounderOS implements a secure, server-side data pipeline:

```
Browser Frontend
       ↓ (POST /api/analyze-idea)
Express Backend Server
       ↓ (Server-to-Server via HTTPS)
SerpApi Search Engine API
       ↓ (Structured JSON Data)
Live Market Evidence Extraction & Relevance Pipeline
       ↓ (Evidence-Grounded Prompting)
Google Gemini Model
       ↓
Structured FounderOS Report (Delivered to Frontend)
```

- **Server-Side Security:** The SerpApi API key is stored strictly on the server using the `SERPAPI_API_KEY` environment variable. It is never sent to the browser or bundled into client code.
- **Supported Engines Implemented:**
  - **Google Search (`engine: "google"`):** Identifies active direct competitors, software platforms, and related customer search questions.
  - **Google News (`engine: "google_news"`):** Retrieves recent industry coverage, policy announcements, and sector funding news.
  - **Google Shopping (`engine: "google_shopping"`):** Activates conditionally for physical and e-commerce ventures to gather merchant pricing benchmarks.
  - **Google Maps (`engine: "google_maps"`):** Activates conditionally for local and geographic service startups to identify localized competitors and ratings.

---

## Example Use Case

### "AI-Powered Budgeting Assistant for Indian College Students"

When a founder submits an idea for an **AI budgeting assistant for Indian college students** focused on daily UPI micro-expense tracking:

1. **Context Extraction:** FounderOS recognizes the domain (*Personal Finance & Budgeting*), target audience (*Indian college students & young adults*), core mechanism (*UPI micro-expenses & allowance tracking*), and geography (*India*).
2. **Focused SerpApi Searches:**
   - `best expense tracker app for students in India`
   - `student budgeting app India UPI`
   - `track daily UPI expenses app India`
   - `[News] personal finance budgeting app India UPI`
3. **Live Evidence Discovered:**
   - **Direct Competitors:** Identifies real Indian market players such as Axio (formerly Walnut), Mera Kharcha, CashBook, and built-in UPI tracking insights in major payment apps.
   - **Alternatives:** Identifies solutions like Money Lover, Expenses Manager, and BudgetBuddy.
   - **Customer Concerns:** Uncovers authentic search signals such as *"What is the best daily expenses app in India?"* and *"How to track daily expenses in phone?"*.
   - **Industry News:** Surfaces recent coverage regarding student digital pocket money apps, smart budgeting trends, and UPI transaction regulations.
4. **AI Synthesis:** Gemini receives this real-world evidence and produces a report that analyzes genuine market gaps against active competitors, rather than hypothetical assumptions.

---

## Core Features

- **Viability Lab:** Interactive submission interface for founders to define venture concepts, target user archetypes, revenue models, and problem statements.
- **Founder Profile & Archetype Calculator:** Founder capability inventory mapping strengths, weaknesses, and archetypes (Technical, Product, Growth, Operational).
- **YC Partner Intelligence Report:** Structured venture evaluations featuring SWOT analysis, market viability assessments, competitor matrices, and monetization paths.
- **Live Market Intelligence Section:** Dedicated report tab presenting live SerpApi evidence, discovered competitors, alternatives, customer inquiry signals, and verified citations.
- **Roadmap 30/60/90:** Structured execution milestones across validation, MVP launch, and initial distribution.
- **MVP Architectural Blueprint:** Concrete technical architecture, recommended technology stacks, API blueprints, and database schemas.
- **Contextual AI Mentor Chat:** Interactive conversational co-founder persona grounded in the founder's specific profile and generated venture report.
- **Founder Weekly Audit:** Operational audit module allowing founders to log weekly wins, mistakes, and bottlenecks, receiving automated strategic feedback.
- **Gamified Progression:** Founder XP and level tracking encouraging consistent validation practices.

---

## Technology Stack

The project is built on the following technologies:

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS |
| **3D Graphics & Motion** | Three.js, `@react-three/fiber`, `@react-three/drei`, Motion |
| **Backend & Routing** | Node.js, Express, `tsx` (TypeScript Execute) |
| **Live Market Research** | SerpApi (Google Search, Google News, Google Shopping, Google Maps) |
| **AI Synthesis** | Google Gemini (`@google/genai` TypeScript SDK) |
| **Data Persistence & Auth** | Firebase Authentication, Cloud Firestore |
| **Icons & UI** | Lucide React |

---

## Security

FounderOS enforces strict credential isolation:
- **Environment Isolation:** All API credentials are read from server environment variables (`process.env`).
- **Zero Client Leakage:** Neither `SERPAPI_API_KEY` nor `GEMINI_API_KEY` is exposed to the client bundle or browser runtime. All external API requests are proxied through server-side routes (`/api/analyze-idea`, `/api/chat-mentor`).
- **Repository Safety:** Local `.env` files are excluded from Git via `.gitignore`.
- **Public Template:** `.env.example` contains only empty variable declarations with documentation comments; no secrets or tokens are committed.

---

## Getting Started

### Prerequisites
- Node.js (version 18 or higher recommended)
- npm or bun

### 1. Clone the Repository
```bash
git clone <repository-url>
cd FounderOS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Populate `.env` with your personal API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
SERPAPI_API_KEY=your_serpapi_api_key_here
```
> *Note: Both keys are required for full functionality. If `SERPAPI_API_KEY` is omitted, FounderOS falls back gracefully to foundation model reasoning.*

### 4. Run Development Server
```bash
npm run dev
```
The server will start on `http://localhost:3000`.

### 5. Build for Production
```bash
npm run build
npm start
```

### 6. Code Quality Verification
```bash
npm run lint
```

---

## Project Structure

```
├── .env.example              # Template for required environment variables
├── .gitignore                # Git ignore rules (ignores .env and build output)
├── package.json              # Project scripts and dependencies
├── server.ts                 # Express backend server (API routes, Vite middleware)
├── serpapiService.ts         # Server-side SerpApi integration & relevance pipeline
├── reportSynthesizer.ts      # Structured Gemini report generation & prompts
├── vite.config.ts            # Vite build configuration
├── tsconfig.json             # TypeScript compiler settings
├── index.html                # HTML entry point
├── firebase-blueprint.json   # Firestore schema definitions
├── firestore.rules           # Security rules for Cloud Firestore
└── src/
    ├── main.tsx              # React application entry point
    ├── App.tsx               # Main application controller, state & navigation
    ├── types.ts              # TypeScript interfaces (reports, market research, profile)
    ├── index.css             # Global styles and Tailwind imports
    └── components/
        ├── LandingPage.tsx   # Product landing page and authentication entry
        ├── DashboardView.tsx # Founder metrics, tasks, and achievements
        ├── FormModules.tsx   # Founder Profile, Venture Idea, and Weekly Audit forms
        ├── ReportView.tsx    # Comprehensive Report UI & Live Market Intelligence tab
        ├── MentorChat.tsx    # Interactive AI mentor chat interface
        ├── ThreeBackground.tsx # Interactive 3D particle canvas (Three.js)
        └── DemoData.ts       # Structured fallback data for sandbox mode
```

---

## Hackathon Track

### Recommended Track: **Commerce & Market Intelligence**

FounderOS directly fits the **Commerce & Market Intelligence** track because it uses live search intelligence to analyze real-world competitor landscapes, commercial alternatives, pricing benchmarks (via Google Shopping), customer purchasing intent, and timely industry developments to help founders validate and commercialize their ventures.

---

## Demo Flow

A complete end-to-end evaluation flow demonstrates:
1. **Enter Founder Profile & Startup Idea:** Input the founder's background, venture concept, target users, problem statement, and pricing model.
2. **Initiate Analysis:** Trigger the venture evaluation process from the Viability Lab.
3. **Automated Live Research:** The server executes focused SerpApi queries across Google Search and Google News.
4. **Evidence Extraction & Scoring:** The relevance pipeline scores results, filters unrelated platforms, and separates direct competitors from alternatives.
5. **AI Synthesis:** Google Gemini receives the verified market evidence alongside the founder's hypothesis to produce a grounded report.
6. **Live Market Intelligence Presentation:** The UI displays discovered incumbents, alternative products, recent industry news, and real-world customer inquiries.
7. **Actionable Roadmap:** The founder receives concrete 30/60/90-day roadmaps, MVP technical blueprints, and ongoing advisory via the AI Mentor.

---

## AI Disclosure

### AI Tools Used

- **Google AI Studio:** Utilized as the development workspace and prototyping environment.
- **Google Gemini:** Utilized via the `@google/genai` TypeScript SDK for structured startup analysis, founder fit evaluation, and interactive co-founder advisory chat.
- **AI-Assisted Development:** Used during implementation for code drafting, debugging, architectural design, and test validation.
