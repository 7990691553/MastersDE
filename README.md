# MastersDE 🇩🇪

AI-powered MS admission predictor for German universities — built for Indian students.

## Live Demo
🌐 https://masters-de.vercel.app/

## What it does
- Matches your profile against 35 real German universities
- Groups results into Safe, Target and Ambitious tiers
- AI-powered profile gap analysis using LLaMA 3.3 70B
- University-specific advice for Indian applicants
- Ask anything chatbot about Germany MS admissions
- Download PDF report with deadlines and application links

## Tech Stack
- **Frontend:** React + Vite + React Router + Axios + jsPDF
- **Backend:** Python + FastAPI + Uvicorn
- **AI:** LLaMA 3.3 70B via Groq API (free)
- **Deployment:** Vercel (frontend) + Render (backend)

## Run Locally

**Backend:**
```bash
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Project Structure
```
mastersde/
├── frontend/          # React app
│   └── src/
│       ├── pages/
│       │   ├── Home.jsx      # Profile form
│       │   └── Results.jsx   # University matches + AI
│       └── App.jsx
├── backend/           # FastAPI app
│   ├── main.py        # API endpoints
│   ├── scorer.py      # Scoring algorithm
│   ├── ai_advisor.py  # Groq AI integration
│   └── universities.json  # 35 German universities
└── README.md
```

## Built by
Keshav Pancholi — beginner developer, built from scratch in 1 week.
