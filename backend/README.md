# Admind AI Backend
### AI Performance Marketing Agent — Node.js + Express + Claude AI

---

## Quick Start (Local)

```bash
# 1. Install dependencies
npm install

# 2. Create your .env file
cp .env.example .env
# → Open .env and add your ANTHROPIC_API_KEY

# 3. Start the server
npm run dev

# 4. Test it's working
curl http://localhost:3001/api/health
# Should return: {"status":"ok","anthropicConfigured":true}
```

---

## Deploy to Railway (Production)

```bash
# 1. Push to GitHub
git init && git add . && git commit -m "Admind AI backend"
git remote add origin https://github.com/YOUR_NAME/nagent-backend.git
git push -u origin main

# 2. Go to railway.app → New Project → Deploy from GitHub
# 3. Select your repo
# 4. Add environment variables in Railway dashboard:
#    ANTHROPIC_API_KEY = sk-ant-...
#    FRONTEND_URL      = https://your-app.lovable.app
#    PORT              = 3001

# 5. Railway gives you a URL like:
#    https://nagent-backend-production.up.railway.app
```

---

## Connect to Lovable Frontend

**Step 1 — Add environment variable in Lovable**
In your Lovable project settings → Environment Variables:
```
VITE_API_URL = https://nagent-backend-production.up.railway.app
```

**Step 2 — Copy the frontend integration files**
Copy these two files from `frontend-integration/` folder into your Lovable project:
- `api.js`        → `src/services/api.js`
- `AppContext.jsx` → `src/context/AppContext.jsx`

**Step 3 — Wrap your app in AppProvider**
In your `src/main.jsx`:
```jsx
import { AppProvider } from "@/context/AppContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppProvider>
      <App />
    </AppProvider>
  </React.StrictMode>
);
```

**Step 4 — Use in your pages**
```jsx
import { useApp } from "@/context/AppContext";

function UploadPage() {
  const { handleUpload, isLoading } = useApp();

  const onFileSelect = async (file) => {
    await handleUpload(file); // runs all 6 agents
    navigate("/dashboard");   // redirect after success
  };
}

function DashboardPage() {
  const { analytics, hasRealData } = useApp();
  const portfolio = analytics?.portfolio || mockData; // fallback to mock
}

function ChatPage() {
  const { handleChat, chatHistory } = useApp();

  const send = async (message) => {
    await handleChat(message); // chatHistory updates automatically
  };
}

function ReportsPage() {
  const { handleGenerateReport, reports } = useApp();
}
```

---

## API Reference

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET    | `/api/health` | Health check | — |
| POST   | `/api/upload` | Upload CSV → full pipeline | `multipart/form-data` field: `file` |
| POST   | `/api/upload/analyze` | Re-run AI on existing data | `{ campaigns: [] }` |
| POST   | `/api/analytics/compute` | KPIs only, no LLM | `{ campaigns: [] }` |
| POST   | `/api/insights/generate` | Fresh AI insights | `{ analytics: {} }` |
| POST   | `/api/chat` | Chat with AI agent | `{ message, conversationHistory, campaignContext }` |
| POST   | `/api/reports/generate` | Generate PDF | `{ analytics, insights, optimization, reportType }` |
| GET    | `/api/reports/download/:filename` | Download PDF | — |
| GET    | `/api/reports/list` | List all reports | — |

---

## CSV Format

Your CSV must have these columns (names are flexible — common variations are handled):

| Column | Required | Example |
|--------|----------|---------|
| campaign_name | Yes | "Summer Skincare Launch" |
| spend | Yes | 85000 |
| impressions | Yes | 2650000 |
| clicks | Yes | 84800 |
| conversions | Yes | 342 |
| revenue | Recommended | 365100 |
| platform | Optional | Meta / Google / Amazon |
| creative_format | Optional | Video / Image / Carousel |
| audience | Optional | Lookalike 2% |

Use `sample_campaigns.csv` to test first.

---

## Agent Pipeline

```
CSV Upload (POST /api/upload)
        │
        ▼
[1] Ingestion Agent     Parse & validate CSV → clean campaign records
        │
        ▼
[2] Analytics Agent     Compute ROAS, CTR, CAC, CVR, CPM, CPC → portfolio KPIs
        │
        ▼
[3] Insight Agent       Claude → 8-10 categorised marketing insights
        │
        ▼
[4] Optimization Agent  Claude → budget reallocation + audience + bid strategy
        │
        ▼
[5] Creative Agent      Claude → ad copy suggestions + A/B test ideas
        │
        ▼
[6] Reporting Agent     PDFKit → branded PDF report
        │
        ▼
    Response JSON       Everything returned to frontend in one call
```

---

## File Structure

```
nagent-backend/
├── server.js                      Entry point
├── package.json
├── .env.example
├── sample_campaigns.csv           Test data
│
├── agents/
│   ├── orchestrator.js            Coordinates all agents
│   ├── ingestionAgent.js          CSV parsing & validation
│   ├── analyticsAgent.js          KPI computation (no LLM)
│   ├── insightAgent.js            Claude-powered insights
│   ├── optimizationAgent.js       Claude-powered recommendations
│   ├── creativeAgent.js           Claude-powered ad copy
│   └── reportingAgent.js          PDF generation
│
├── routes/
│   ├── upload.js                  POST /api/upload
│   ├── analytics.js               POST /api/analytics/compute
│   ├── insights.js                POST /api/insights/generate
│   ├── chat.js                    POST /api/chat
│   └── reports.js                 POST/GET /api/reports/*
│
├── frontend-integration/
│   ├── api.js                     → copy to src/services/api.js
│   └── AppContext.jsx             → copy to src/context/AppContext.jsx
│
├── uploads/                       Temp file storage (auto-created)
└── reports/                       Generated PDFs (auto-created)
```

---

## Troubleshooting

**CORS error in browser:**
Add your Lovable URL to `FRONTEND_URL` in Railway environment variables and redeploy.

**"Anthropic API key invalid":**
Check that `ANTHROPIC_API_KEY` starts with `sk-ant-` and has no extra spaces.

**Pipeline takes too long:**
Normal processing time is 15–25 seconds (3 LLM calls in sequence). This is expected.

**CSV columns not recognised:**
Check that your CSV has the required columns. Use `sample_campaigns.csv` as reference.

**PDF download not working:**
Make sure `reports/` directory exists (it's auto-created on first run).
