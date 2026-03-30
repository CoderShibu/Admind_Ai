# ⚡ Admind AI — Performance Marketing Intelligence

<div align="center">

![Admind AI](https://img.shields.io/badge/Admind_AI-Performance_Intelligence-00D4FF?style=for-the-badge&logo=lightning&logoColor=white)

[![Node.js](https://img.shields.io/badge/Node.js-v22-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Groq](https://img.shields.io/badge/AI-Groq_Llama_3.3-F55036?style=flat-square&logo=meta&logoColor=white)](https://groq.com)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

**AI-powered campaign analytics for D2C brands.**
Upload your CSV → Get insights in 20 seconds → Download PDF report.

[🚀 Get Started](#getting-started) · [📖 API Docs](#api-reference) · [🤖 How Agents Work](#ai-agent-pipeline) · [👨‍💻 Developer](#developer)

</div>

---

## 📌 Table of Contents

- [What is Admind AI?](#what-is-admind-ai)
- [Live Demo & Login](#live-demo--login)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [AI Agent Pipeline](#ai-agent-pipeline)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [CSV Format](#csv-format)
- [Pages Overview](#pages-overview)
- [Troubleshooting](#troubleshooting)
- [Developer](#developer)

---

## 🎯 What is Admind AI?

**Admind AI** is a full-stack AI performance marketing intelligence platform built for Direct-to-Consumer (D2C) brands. It transforms raw campaign CSV data from Meta Ads, Google Ads, and Amazon into actionable insights using a **6-agent AI pipeline** powered by Groq's ultra-fast Llama 3.3 model.

### The Problem It Solves

Marketing teams spend hours manually analyzing campaigns across multiple platforms — trying to figure out what's working, what's wasting budget, and what to do next. Admind AI automates this entire workflow in under 20 seconds.

### How It Works in 3 Steps

```
1. Upload your campaign CSV
          ↓
2. 6 AI agents analyze your data simultaneously
          ↓
3. Get insights, recommendations, ad copy + PDF report
```

---

## 🔑 Live Demo & Login

> **Default Credentials**

| Field | Value |
|-------|-------|
| Email | `admin@123` |
| Password | `adminhere` |

Or click **"Load Demo Data"** on the dashboard to instantly explore all features without uploading a file.

---

## ✨ Key Features

### 🤖 AI-Powered Intelligence
- **8-10 Marketing Insights** — Specific, numbered findings from your actual campaign data
- **Budget Reallocation Plan** — Exact Rs. amounts to move between campaigns
- **Ad Copy Generator** — 5 ready-to-use hooks, body copy, and CTAs
- **Audience Recommendations** — Which segments to expand, pause, or test
- **Bid Strategy Suggestions** — Campaign-level bidding optimization

### 📊 Analytics & Dashboard
- Real-time KPI cards — Total Spend, Avg ROAS, CTR, Conversions
- Spend vs Revenue line chart (7 / 30 / 90 day views)
- ROAS by Campaign bar chart with color-coded performance tiers
- Campaign table with sort, search, filter, and CSV export
- Platform breakdown — Meta, Google, Amazon comparison

### 💬 AI Chat Interface
- Natural language questions about your campaign data
- Context-aware responses using your real uploaded data
- Suggested question chips for quick insights
- Persistent conversation history

### 📄 PDF Report Generation
- Branded, professional PDF reports
- KPI summary, campaign table, AI insights, quick wins
- Downloadable and shareable with stakeholders

### 🎨 Landing Page
- Animated 3D floating data cards
- Typewriter effect headline
- Mouse parallax interaction
- Scroll-triggered navbar

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + TypeScript | UI Framework |
| Vite 5 | Build Tool & Dev Server |
| Tailwind CSS | Utility-first Styling |
| Recharts | Charts & Data Visualization |
| React Router DOM v6 | Client-side Routing |
| shadcn/ui | UI Component Library |
| Lucide React | Icon Library |
| Sonner | Toast Notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js v22 | JavaScript Runtime |
| Express.js | REST API Framework |
| Groq SDK | AI Model Integration |
| Multer | CSV File Upload |
| csv-parse | CSV Parsing & Validation |
| PDFKit | PDF Report Generation |
| dotenv | Environment Configuration |
| nodemon | Development Auto-restart |

### AI
| Service | Model | Purpose |
|---|---|---|
| Groq API | Llama 3.3 70B Versatile | All AI agent responses |

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    BROWSER (Frontend)                     │
│                React + TypeScript + Vite                  │
│                     localhost:8081                        │
│                                                           │
│   Landing → Login → Dashboard → Campaigns → Insights     │
│                   → Chat → Reports → Upload               │
│                                                           │
│              AppContext (Global State)                    │
│         React State + localStorage Persistence           │
│                                                           │
│                    src/services/api.ts                    │
└─────────────────────────┬────────────────────────────────┘
                          │ REST API (fetch)
                          ▼
┌──────────────────────────────────────────────────────────┐
│                  EXPRESS SERVER (Backend)                 │
│                      localhost:3001                       │
│                                                           │
│   POST /api/upload      → Full 6-agent pipeline          │
│   POST /api/chat        → AI chat with context           │
│   POST /api/insights    → Regenerate insights            │
│   POST /api/reports     → Generate PDF                   │
│   GET  /api/health      → Health check                   │
│                                                           │
│              agents/orchestrator.js                       │
└────────────┬──────────────┬──────────────────────────────┘
             │              │
             ▼              ▼
    ┌──────────────┐  ┌──────────────┐
    │   Groq API   │  │  File System │
    │ Llama 3.3 70B│  │  /reports    │
    │  (Free tier) │  │  /uploads    │
    └──────────────┘  └──────────────┘
```

---

## 🤖 AI Agent Pipeline

When a CSV is uploaded, **6 agents run in sequence**. Total time: ~15-20 seconds.

```
CSV Upload
    │
    ▼
┌─────────────────────────────────────────────────────────┐
│ [Agent 1] INGESTION AGENT                               │
│ • Parses CSV buffer from multipart upload               │
│ • Normalises 20+ column name variations                 │
│   (e.g. "Ad Spend" = "spend" = "marketing_spend")       │
│ • Validates required fields, reports warnings           │
│ • Output: clean campaign array                          │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│ [Agent 2] ANALYTICS AGENT  ← Pure JS, no LLM, instant  │
│ • Computes per-campaign: ROAS, CTR, CAC, CVR, CPM, CPC  │
│ • Classifies status: scaling / stable / review / pause  │
│ • Calculates portfolio totals and averages              │
│ • Platform breakdown: Meta vs Google vs Amazon          │
│ • Creative format breakdown: Video vs Image vs Text     │
│ • Output: enriched campaigns + portfolio KPIs           │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│ [Agent 3] INSIGHT AGENT  ← Groq Llama 3.3              │
│ • Receives full analytics context                       │
│ • Generates 8-10 specific insights with real numbers    │
│ • Categories: performance, budget, creative, audience   │
│ • Impact levels: high, medium, low                      │
│ • Output: structured insight cards array                │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│ [Agent 4] OPTIMIZATION AGENT  ← Groq Llama 3.3         │
│ • Receives analytics + insights from Agent 3            │
│ • Creates exact budget reallocation plan (same total)   │
│ • Audience segment recommendations (expand/pause/test)  │
│ • Bid strategy changes per campaign                     │
│ • 3 quick wins doable today                             │
│ • Output: full optimization plan JSON                   │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│ [Agent 5] CREATIVE AGENT  ← Groq Llama 3.3             │
│ • Analyses creative format performance from data        │
│ • Identifies winning messaging patterns                 │
│ • Generates 5 ad copy suggestions with hooks + CTAs     │
│ • Recommends 3 A/B tests to run                         │
│ • Output: creative strategy + ad copy array             │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│ [Agent 6] REPORTING AGENT  ← PDFKit                    │
│ • Compiles all agent outputs into one document          │
│ • Page 1: Header, KPI cards, platform breakdown,        │
│   full campaign table with color-coded ROAS             │
│ • Page 2: Top AI insights, quick wins, priorities       │
│ • Output: branded PDF saved to /backend/reports/        │
└──────────────────────────┬──────────────────────────────┘
                           ▼
              Full result returned to frontend
              All pages update with real data
```

---

## 📁 Project Structure

```
nagentai-insights-main/
│
├── 📁 src/                           # React Frontend (TypeScript)
│   │
│   ├── 📁 pages/
│   │   ├── LandingPage.tsx           # Home page with 3D animated hero
│   │   ├── LoginPage.tsx             # Auth (admin@123 / adminhere)
│   │   ├── DashboardPage.tsx         # KPIs, charts, campaign table
│   │   ├── CampaignsPage.tsx         # Full campaign table + filters
│   │   ├── InsightsPage.tsx          # AI insights + ad copy
│   │   ├── ChatPage.tsx              # Conversational AI interface
│   │   ├── ReportsPage.tsx           # PDF report generation
│   │   └── UploadPage.tsx            # CSV upload + progress
│   │
│   ├── 📁 components/
│   │   ├── AppSidebar.tsx            # Navigation with active states
│   │   ├── AuthGuard.tsx             # Protects authenticated routes
│   │   └── 📁 ui/                    # shadcn/ui base components
│   │
│   ├── 📁 context/
│   │   └── AppContext.tsx            # Global state + API actions
│   │                                 # Handles all data fetching
│   │                                 # localStorage persistence
│   │
│   ├── 📁 services/
│   │   └── api.ts                    # All backend API functions
│   │
│   ├── 📁 hooks/
│   │   └── use-mobile.tsx            # Mobile detection hook
│   │
│   ├── App.tsx                       # Route definitions
│   ├── main.tsx                      # App entry + AppProvider wrap
│   └── index.css                     # Global styles + animations
│
├── 📁 backend/                       # Node.js Express Backend
│   │
│   ├── server.js                     # Express app + CORS + routes
│   ├── package.json                  # Backend dependencies
│   ├── .env.example                  # Environment variable template
│   ├── sample_campaigns.csv          # 20 realistic test campaigns
│   │
│   ├── 📁 agents/
│   │   ├── orchestrator.js           # Runs all 6 agents in sequence
│   │   ├── ingestionAgent.js         # CSV parsing + validation
│   │   ├── analyticsAgent.js         # KPI computation (no LLM)
│   │   ├── insightAgent.js           # Groq insight generation
│   │   ├── optimizationAgent.js      # Groq optimization planning
│   │   ├── creativeAgent.js          # Groq ad copy generation
│   │   └── reportingAgent.js         # PDFKit report builder
│   │
│   ├── 📁 routes/
│   │   ├── upload.js                 # POST /api/upload
│   │   ├── analytics.js              # POST /api/analytics/compute
│   │   ├── insights.js               # POST /api/insights/generate
│   │   ├── chat.js                   # POST /api/chat
│   │   └── reports.js                # POST/GET /api/reports
│   │
│   ├── 📁 frontend-integration/      # Files to copy into src/
│   │   ├── api.js                    # → copy to src/services/api.ts
│   │   └── AppContext.jsx            # → copy to src/context/AppContext.tsx
│   │
│   ├── 📁 uploads/                   # Temp CSV storage (auto-created)
│   └── 📁 reports/                   # Generated PDFs (auto-created)
│
├── 📁 public/                        # Static assets
│   └── logo.png                      # App logo
│
├── .env.local                        # Frontend environment variables
├── index.html                        # HTML entry point
├── package.json                      # Frontend dependencies
├── vite.config.ts                    # Vite configuration
├── tailwind.config.ts                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
└── README.md                         # This file
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version | Link |
|---|---|---|
| Node.js | v18+ | [nodejs.org](https://nodejs.org) |
| npm | v8+ | Comes with Node.js |
| Groq API Key | Free | [console.groq.com](https://console.groq.com) |

### Step-by-Step Installation

**1. Navigate to the project folder**
```bash
cd nagentai-insights-main
```

**2. Install frontend dependencies**
```bash
npm install
```

**3. Install backend dependencies**
```bash
cd backend
npm install
cd ..
```

**4. Set up backend environment**
```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:
```env
GROQ_API_KEY=gsk_your_key_here
PORT=3001
FRONTEND_URL=http://localhost:5173
```

**5. Set up frontend environment**

Edit `.env.local` in project root:
```env
VITE_API_URL=http://localhost:3001
```

**6. Start both servers**

Open **Terminal 1** for the backend:
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Admind AI backend running on http://localhost:3001
   Groq API:     ✅ configured
   Frontend URL: http://localhost:5173
```

Open **Terminal 2** for the frontend:
```bash
npm run dev
```

You should see:
```
  VITE v5.x.x  ready in 300ms
  ➜  Local:   http://localhost:5173
```

**7. Open your browser**
```
http://localhost:5173
```

**8. Log in**
```
Email:    admin@123
Password: adminhere
```

**9. Test the AI pipeline**

Upload `backend/sample_campaigns.csv` on the Upload page and wait 15-20 seconds for the full AI analysis to complete.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable | Required | Description |
|---|---|---|
| `GROQ_API_KEY` | ✅ | Groq API key — get free at console.groq.com |
| `PORT` | ❌ | Backend port (default: 3001) |
| `FRONTEND_URL` | ❌ | Frontend URL for CORS (default: http://localhost:5173) |

### Frontend (`.env.local`)

| Variable | Required | Description |
|---|---|---|
| `VITE_API_URL` | ✅ | Backend base URL (default: http://localhost:3001) |

### Getting a Free Groq API Key

```
1. Go to: https://console.groq.com
2. Sign up (Google or email — no credit card)
3. Click "API Keys" in the left sidebar
4. Click "Create API Key"
5. Name it: "admind-ai"
6. Copy the key (starts with gsk_...)
7. Paste into backend/.env
```

> ⚠️ **Security Note:** Never commit your `.env` file to Git. It is already in `.gitignore`.

---

## 📡 API Reference

Base URL: `http://localhost:3001`

### Health Check
```http
GET /api/health
```
```json
{
  "status": "ok",
  "service": "Admind AI Backend",
  "groqConfigured": true,
  "timestamp": "2026-03-20T09:41:00Z"
}
```

---

### Upload CSV (Full Pipeline)
```http
POST /api/upload
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|---|---|---|---|
| `file` | File | ✅ | CSV campaign data file |
| `generateReport` | string | ❌ | `"true"` or `"false"` (default: `"true"`) |
| `reportType` | string | ❌ | `"weekly"` or `"monthly"` (default: `"weekly"`) |

**Response:**
```json
{
  "success": true,
  "data": {
    "ingestion": { "rowCount": 20, "warnings": [] },
    "analytics": {
      "portfolio": {
        "totalSpend": 428500,
        "totalRevenue": 1589785,
        "avgROAS": 3.71,
        "avgCTR": 4.19,
        "avgCAC": 249,
        "totalConversions": 1720
      },
      "campaigns": [...],
      "patterns": {
        "topPerformers": [...],
        "underperformers": [...],
        "platformBreakdown": [...]
      }
    },
    "insights": [
      {
        "id": "insight-1",
        "category": "performance",
        "title": "Retargeting Cart has 7.2x ROAS",
        "detail": "...",
        "impact": "high",
        "recommendation": "Increase budget by 50%"
      }
    ],
    "optimization": {
      "budgetReallocations": [...],
      "quickWins": [...],
      "weeklyPriorities": [...]
    },
    "creative": {
      "adCopySuggestions": [...],
      "testingRecommendations": [...]
    },
    "report": {
      "filename": "report-1234567890.pdf",
      "downloadUrl": "/api/reports/download/report-1234567890.pdf"
    }
  }
}
```

---

### AI Chat
```http
POST /api/chat
Content-Type: application/json
```

```json
{
  "message": "Which campaigns should I scale this week?",
  "conversationHistory": [
    { "role": "user", "content": "previous message" },
    { "role": "assistant", "content": "previous reply" }
  ],
  "campaignContext": { "portfolio": {...}, "patterns": {...} }
}
```

**Response:**
```json
{
  "success": true,
  "reply": "Based on your data, **Retargeting Cart** at 7.2x ROAS..."
}
```

---

### Regenerate Insights
```http
POST /api/insights/generate
Content-Type: application/json
```

```json
{
  "analytics": { "campaigns": [...], "portfolio": {...}, "patterns": {...} }
}
```

---

### Generate PDF Report
```http
POST /api/reports/generate
Content-Type: application/json
```

```json
{
  "analytics": {...},
  "insights": [...],
  "optimization": {...},
  "reportType": "weekly"
}
```

---

### Download PDF Report
```http
GET /api/reports/download/:filename
```

Returns the PDF file as a binary stream.

---

### List All Reports
```http
GET /api/reports/list
```

---

### Compute Analytics Only (No LLM)
```http
POST /api/analytics/compute
Content-Type: application/json
```

```json
{ "campaigns": [...] }
```

---

## 📊 CSV Format

Your CSV must include these columns. Column names are flexible — the ingestion agent handles common variations automatically.

### Required Columns

| Column | Accepted Variations | Example |
|---|---|---|
| `campaign_name` | campaign, Campaign Name | Summer Skincare Launch |
| `spend` | Ad Spend, marketing_spend, budget, cost | 85000 |
| `impressions` | impression, Impressions | 2650000 |
| `clicks` | click, Clicks | 84800 |
| `conversions` | conversion, Conversions | 342 |

### Recommended Columns

| Column | Accepted Variations | Example |
|---|---|---|
| `revenue` | Revenue Generated, revenue_generated | 365100 |
| `platform` | channel, Platform | Meta |
| `creative_format` | creative, Creative Type, creative_format | Video |
| `audience` | Audience Targeting, audience | Lookalike 2% |

### Sample CSV

```csv
campaign_name,platform,spend,impressions,clicks,conversions,revenue,audience,creative_format
Summer Skincare Launch,Meta,85000,2650000,84800,342,365100,Lookalike 2%,Video
Google Brand Search,Google,45000,535714,45000,289,274550,Keyword,Text
Amazon Sponsored,Amazon,29000,557692,29000,156,113100,Keyword,Image
Retargeting Cart,Meta,18500,385416,18500,201,133200,Custom - Cart,Image
Broad Awareness,Meta,55000,5000000,55000,43,49500,Broad,Video
```

> 📎 A complete sample file with 20 realistic campaigns is included at `backend/sample_campaigns.csv`

---

## 📱 Pages Overview

| Route | Page | Description |
|---|---|---|
| `/` | Landing Page | Animated hero with 3D floating cards |
| `/login` | Login | Auth form (admin@123 / adminhere) |
| `/dashboard` | Dashboard | KPIs, charts, top campaigns, insights preview |
| `/campaigns` | Campaigns | Full campaign table with search, filter, export |
| `/insights` | AI Insights | Insight cards, ad copy, optimization plan |
| `/chat` | Chat | AI assistant with campaign context |
| `/reports` | Reports | Generate and download PDF reports |
| `/upload` | Upload Data | CSV drag-and-drop with processing steps |

All routes except `/` and `/login` are protected by `AuthGuard`.

---

## 🔧 Troubleshooting

### "Failed to fetch" on Upload

The frontend can't reach the backend. Check:

```bash
# 1. Is backend running?
curl http://localhost:3001/api/health

# 2. Is the GROQ_API_KEY set in backend/.env?
cat backend/.env

# 3. Does FRONTEND_URL in backend/.env match your frontend port?
# If frontend is on :8081, set FRONTEND_URL=http://localhost:8081
```

---

### Port 3001 Already in Use

```bash
npx kill-port 3001
cd backend && npm run dev
```

---

### "Cannot find module 'groq-sdk'"

```bash
cd backend
npm install
```

---

### CSV Not Parsing Correctly

Make sure your CSV:
- Is saved as `.csv` format (not `.xlsx`)
- Has headers in the first row
- Includes at minimum: `campaign_name`, `spend`, `impressions`, `clicks`, `conversions`
- Uses commas as delimiters (not semicolons)

Use `backend/sample_campaigns.csv` as a reference template.

---

### Frontend on Different Port

If your frontend runs on a port other than 5173 (e.g., 8081):

In `backend/.env`:
```env
FRONTEND_URL=http://localhost:8081
```

Save the file — nodemon will auto-restart the backend.

---

### Groq API Rate Limit

Groq's free tier allows 30 requests per minute. If you hit the limit:
- Wait 60 seconds and try again
- The pipeline makes 3 Groq API calls per upload

---

## 🗂 Key Files Reference

| File | What It Does |
|---|---|
| `backend/server.js` | Express app, CORS config, route registration |
| `backend/agents/orchestrator.js` | Coordinates all 6 agents in sequence |
| `backend/agents/analyticsAgent.js` | Pure JS KPI computation — edit formulas here |
| `backend/agents/insightAgent.js` | Groq prompt for insights — edit system prompt here |
| `backend/agents/chatAgent.js` | Chat system prompt — edit AI personality here |
| `src/context/AppContext.tsx` | All React state — edit global data logic here |
| `src/services/api.ts` | All fetch calls — edit API URLs here |
| `src/pages/DashboardPage.tsx` | Dashboard charts and KPI cards |
| `src/pages/InsightsPage.tsx` | Insight cards and ad copy display |
| `src/pages/ChatPage.tsx` | Chat interface and message rendering |

---

## 🚢 Deployment

### Deploy Backend to Railway

```bash
# 1. Push backend to GitHub
cd backend
git init && git add . && git commit -m "Admind AI backend"

# 2. Go to railway.app → New Project → Deploy from GitHub
# 3. Set root directory to: /backend
# 4. Add environment variables:
#    GROQ_API_KEY = your_key
#    FRONTEND_URL = https://your-app.lovable.app
#    PORT = 3001

# Your backend URL will be something like:
# https://admind-ai-backend.up.railway.app
```

### Deploy Frontend to Vercel / Lovable

```bash
# Update .env.local with your Railway URL:
VITE_API_URL=https://admind-ai-backend.up.railway.app
```

---

## 👨‍💻 Developer

<div align="center">

**Shibasish Banerjee** 🚀

*Built with Marketing Knowledge and Fun*

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/shibasishbanerjee)
[![Gmail](https://img.shields.io/badge/Gmail-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white)](mailto:shibasish2005@gmail.com)

</div>

---

## 📄 License

```
MIT License

Copyright (c) 2026 Shibasish Banerjee

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
```

---

<div align="center">

**⚡ Admind AI** — Turn Campaign Data Into Revenue

*© 2026 Admind AI · Built with Marketing Knowledge and Fun · Shibasish Banerjee 🚀*

</div>
