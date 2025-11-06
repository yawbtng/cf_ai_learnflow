# 🧠 Product Requirements Document (PRD)

## Product Name  
**LearnFlow** — *“Discover the best podcasts, videos, and articles to learn anything — personalized to your learning style.”*

---

## 🎯 Problem Statement  
The Internet is overflowing with educational content — videos, podcasts, articles — but users waste time filtering poor-quality or irrelevant resources.  
Learners need a single tool that instantly curates **trusted, multimodal, explainable** learning materials for any topic, tailored to their preferred learning style (visual 🎥, auditory 🎧, or reader 📖).

---

## 💡 Solution Overview  
**LearnFlow** uses **Cloudflare Workers AI (Llama 3.3)** to reason over search results from APIs like **YouTube, Spotify, and NewsData.io**, filters the most valuable ones, and provides a short “why this was recommended” explanation.  

Users can:
- Search any topic  
- Choose a learning style  
- Browse AI-ranked recommendations (video, podcast, article)  
- Sort, search, and favorite resources (persisted via localStorage)  

---

## 🌐 Key Features

| Feature | Description |
|----------|--------------|
| **Topic Search** | Enter a subject you want to learn about. |
| **Learning Style Selection** | Choose between 🎥 Visual, 🎧 Listener, 📖 Reader. |
| **AI-Powered Curation** | Worker fetches from YouTube, Spotify, and NewsData.io → passes to Llama 3.3 for ranking + explanations. |
| **Explainable Recommendations** | Each resource card includes “Why this was recommended.” |
| **Filtering & Sorting** | Sort by date, rating, or AI relevance; keyword filter. |
| **Favorites / Bookmarks** | Save items to localStorage; view in a separate page. |
| **Optional Trending Topics** | Use Cloudflare KV to store and display popular search topics. |

---

## 🧱 Architecture Overview

```plaintext
Frontend (Next.js + Tailwind)
│
├── /search → topic + style input
├── /favorites → localStorage bookmarks
│
└── Cloudflare Worker (Backend API)
     ├── Fetch YouTube videos
     ├── Fetch Spotify podcasts
     ├── Fetch NewsData.io articles
     ├── Merge + normalize JSON
     ├── Send to Workers AI (Llama 3.3) for reasoning
     └── Return top N recommendations
```

**Deployment Flow**
- Frontend → **Cloudflare Pages**
- Backend → **Cloudflare Workers**
- Memory/Analytics → **Cloudflare KV** (optional)

---

## ⚙️ Tech Stack

| Layer | Technology | Purpose |
|--------|-------------|----------|
| **Frontend** | **Next.js 14** (App Router) | SPA with API routes + SSR |
| **Styling** | **Tailwind CSS + Framer Motion** | Clean responsive UI with subtle animations |
| **Backend / Logic** | **Cloudflare Workers + Wrangler 3** | Lightweight serverless API coordination |
| **AI Model** | **Workers AI → Llama 3.3 8B Instruct** | Ranking, summarization, and reasoning |
| **Data APIs** | YouTube Data API v3, Spotify Web API, NewsData.io API | Source discovery |
| **State Persistence** | LocalStorage (client) + Cloudflare KV (optional) | Favorites, analytics |
| **Auth** | None (public) | Simpler demo flow |
| **Version Control** | GitHub (`cf_ai_learnflow`) | Required for submission |
| **Hosting** | Cloudflare Pages + Workers | Fully Cloudflare-native stack |

---

## 🔗 External APIs

| API | Purpose | Endpoint Example |
|------|----------|------------------|
| **YouTube Data API v3** | Fetch videos | `https://www.googleapis.com/youtube/v3/search?q={topic}&type=video&part=snippet&maxResults=5&key={API_KEY}` |
| **Spotify Web API** | Fetch podcast shows / episodes | `https://api.spotify.com/v1/search?q={topic}&type=show,episode&limit=5` |
| **NewsData.io API** | Fetch articles | `https://newsdata.io/api/1/news?apikey={API_KEY}&q={topic}&language=en` |
| **Cloudflare Workers AI** | Rank + summarize | `POST https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/ai/run/@cf/meta/llama-3.3-8b-instruct` |

---

## 🧩 Data Flow

```plaintext
[User Input (topic, style)]
        ↓
[Next.js Frontend POST → Cloudflare Worker]
        ↓
[Worker fetches]
 ├─ YouTube videos
 ├─ Spotify podcasts
 └─ NewsData articles
        ↓
[Merged JSON → Llama 3.3 in Workers AI]
        ↓
[AI ranks + generates reasons → returns JSON]
        ↓
[Frontend renders cards + saves favorites]
```

---

## 🧠 Example Prompt for Llama 3.3

> “You are an AI assistant curating learning materials for someone interested in *{topic}*.  
> The user prefers a *{learning_style}* learning style.  
> From the following resources (title, description, link), choose the 5 most valuable.  
> For each, provide:  
>  - title  
>  - type (video / podcast / article)  
>  - url  
>  - short reason (≤ 30 words)  
>  - 1-sentence summary.”

---

## 🗂 Example JSON Returned to Frontend

```json
[
  {
    "title": "Intro to Quantum Computing",
    "type": "video",
    "url": "https://youtube.com/watch?v=abc123",
    "reason": "Great for visual learners; concise explanations with diagrams.",
    "summary": "Explains qubits and superposition in an accessible 10-minute format.",
    "date": "2025-03-11",
    "source": "YouTube"
  }
]
```

---

## 👩‍💻 User Stories

| Role | Story | Priority |
|------|--------|-----------|
| User | As a learner, I want to enter a topic so I can get curated content instantly. | ⭐⭐⭐⭐ |
| User | As a user, I want to choose how I learn (video, audio, text). | ⭐⭐⭐⭐ |
| User | As a user, I want to see why each resource was recommended. | ⭐⭐⭐⭐ |
| User | As a user, I want to favorite items and access them later. | ⭐⭐⭐ |
| User | As a user, I want to sort and filter results easily. | ⭐⭐ |
| Admin (optional) | As a developer, I want to log trending searches in KV. | ⭐ |

---

## 🧩 Task Breakdown (by Phase)

### 🗓 Phase 1 – Setup & Foundation (1 day)
- [ ] Create `cf_ai_learnflow` GitHub repo  
- [ ] Set up Next.js template + Tailwind  
- [ ] Initialize Cloudflare Worker via Wrangler  
- [ ] Create `.env` keys for APIs  
- [ ] Create README.md + PROMPTS.md  

### 🧩 Phase 2 – Backend Integration (2–3 days)
- [ ] Implement YouTube fetch function  
- [ ] Implement Spotify fetch function  
- [ ] Implement NewsData fetch function  
- [ ] Merge and normalize results  
- [ ] Send to Workers AI for ranking + reasoning  
- [ ] Return formatted JSON to frontend  

### 🧠 Phase 3 – Frontend UI (3 days)
- [ ] Search input + learning style buttons  
- [ ] Card components (thumbnail, title, reason)  
- [ ] Modal for details (summary + open link)  
- [ ] Sorting & keyword filters  
- [ ] Favorite / Bookmark feature (localStorage)  

### 💾 Phase 4 – Memory & Analytics (Optional 2 days)
- [ ] Implement Cloudflare KV for trending topics  
- [ ] Favorites view page  

### 🎨 Phase 5 – Polish (1–2 days)
- [ ] Add Framer Motion animations  
- [ ] Dark/light theme toggle  
- [ ] Deploy to Cloudflare Pages + Worker  
- [ ] Write README instructions + demo GIF  

---

## 🚀 Deliverables for Cloudflare Submission

| File | Purpose |
|------|----------|
| `README.md` | Setup steps, tech stack, deployment guide |
| `PROMPTS.md` | AI prompts used for reasoning + summary |
| `wrangler.toml` | Worker configuration |
| `index.tsx` | Main UI entry |
| `worker.js` | Worker fetch logic + AI coordination |
| `public/demo.png` | Screenshot or demo preview |
| `package.json` | Dependencies and scripts |

---

## 📊 Success Metrics (Intern Submission)
✅ Deployed demo on Cloudflare Pages + Workers  
✅ 5+ working recommendations per search  
✅ Functional favorites persistence  
✅ README & PROMPTS files clear and complete  
✅ Repo follows prefix: `cf_ai_learnflow`

---

## 🔮 Future Extensions
- Personalized learning paths (grouped by difficulty)  
- Chrome extension integration  
- Realtime voice interface using Cloudflare Realtime API  
- User profiles & cloud sync via Durable Objects  
