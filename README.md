# 📊 Amazon AI BI Copilot — Executive Analytics & Natural Language Engine

> **Next-Generation Business Intelligence Platform built for Executive Decision Makers & Business Designers.**

![Amazon BI Copilot Banner](https://img.shields.io/badge/Amazon-BI_Copilot_Pro-FF9900?style=for-the-badge&logo=amazon&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Gemini AI](https://img.shields.io/badge/Gemini_AI-4285F4?style=for-the-badge&logo=google&logoColor=white)

---

## 🌟 Key Features

### ⚡ 1. Ultra-Fast Heuristic Engine & LRU Query Cache (0ms Latency)
- **Instant Heuristic Matcher**: Standard BI requests (*top categories, regional sales, monthly trends, payment splits, ratings, pricing discounts*) resolve instantly with **0ms network delay**.
- **LRU Query Caching**: In-memory query caching eliminates redundant API roundtrips for repeated queries.

### 💾 2. Guaranteed Persistent Query History
- **Persistent Disk Fallback (`history_store.json`)**: History is saved directly to disk and synchronized across sessions, refreshes, and server restarts — even when MongoDB is offline.
- **Bi-directional State Sync**: Syncs seamlessly between local state, `localStorage`, and backend endpoints.

### 🎨 3. Modern Business Designer Suite
- **🖼️ High-Res PNG Export**: One-click PNG image download for pitch decks, mockups, and executive slide presentations.
- **📊 Interactive Chart Type Switcher**: Toggle dynamically between Bar, Line, Area, Pie, Donut, Scatter, and Data Table view.
- **📥 CSV Data Export**: Instant download of underlying chart aggregation datasets.
- **📑 Live Data Preview**: Interactive tab in the sidebar to inspect active dataset sample rows.

### 🏷️ 4. Official Amazon Smile Branding & Executive KPIs
- Styled with authentic Amazon corporate branding (`#131921` Charcoal Navy, `#FF9900` Amazon Prime Amber, `#00A8E1` Amazon Cyan).
- Real-time Executive KPI Banner displaying **Total Revenue**, **Average Order Value**, **Total Transactions**, and **Active Dataset Schema**.

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16+)
- Python 3.9+
- Google Gemini API Key

---

### 1. Backend Setup (FastAPI)

```bash
cd BACKEND

# Install dependencies
pip install fastapi uvicorn pandas google-genai motor python-dotenv pydantic

# Create .env file
echo "GEMINI_API_KEY=your_gemini_api_key_here" > .env

# Run backend server
python -m uvicorn server:app --host 127.0.0.1 --port 8000 --reload
```

Backend will run on: `http://127.0.0.1:8000`

---

### 2. Frontend Setup (React)

```bash
cd FRONTEND

# Install dependencies
npm install

# Start development server
npm start
```

Frontend application will open at: `http://localhost:3000`

---

## 📂 Project Structure

```
gfg-project-for-hackathon/
├── BACKEND/
│   ├── server.py              # FastAPI main server & persistent history endpoints
│   ├── llm_agent.py           # 0ms Heuristic query parser & Gemini LLM agent
│   ├── data_loader.py         # Pandas dataset loader & schema normalizer
│   ├── query_parser.py        # Aggregation & filter execution engine
│   ├── chart_generator.py     # Plotly chart data formatter
│   ├── insights_engine.py     # Executive business takeaway generator
│   ├── models.py              # Pydantic data schemas
│   ├── history_store.json     # Persistent query history store
│   └── dataset/
│       └── Amazon Sales.csv   # Default active dataset
│
└── FRONTEND/
    ├── src/
    │   ├── PAGES/
    │   │   └── Dashboard.js    # Executive BI main dashboard page
    │   ├── COMPONENTS/
    │   │   ├── AmazonLogo.js   # Authentic Amazon Smile SVG logo
    │   │   ├── ChartRenderer.js# Plotly chart container with PNG export
    │   │   ├── QueryHistory.js # Sidebar history, schema & live data tab
    │   │   ├── ChatInput.js    # Amazon Amber floating search bar
    │   │   ├── ExamplePrompts.js# Executive prompt scenario cards
    │   │   ├── SchemaInspector.js# Field explorer & column chips
    │   │   └── DatasetUploader.js# Custom CSV dataset uploader modal
    │   └── index.css          # Tailwind CSS styling & glassmorphism
    └── package.json
```

---

## 🧪 Example Queries to Try

| Query Type | Prompt | Expected Result |
| :--- | :--- | :--- |
| **Regional Sales** | `"Show total revenue by region"` | Bar chart breakdown across Middle East, North America, Asia, Europe |
| **Top Categories** | `"Top 5 product categories by sales"` | Ranked sales volume bar chart |
| **Monthly Trend** | `"Show monthly revenue trend"` | Smooth spline line trajectory across timeline |
| **Payment Share** | `"Payment method distribution"` | Donut chart split across payment options |
| **Domain Guard** | `"What is the weather in London?"` | ⚠️ Invalid Question domain warning card |

---

## 📜 License
Developed for Hackathon 2026. Free to use under the MIT License.
