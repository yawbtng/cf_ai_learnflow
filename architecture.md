┌─────────────────────────────────────────────────────────────────────────────┐
│                         LEARNFLOW ARCHITECTURE                              │
│                    (Cloudflare-Native Stack)                                │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER / BROWSER                                  │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Next.js Frontend (React + Tailwind CSS)                            │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  /search page                                                 │  │  │
│  │  │  • Topic input field                                          │  │  │
│  │  │  • Learning style selection (🎥 Visual, 🎧 Listener, 📖 Reader)│  │  │
│  │  │  • Resource cards display                                     │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  /favorites page (localStorage)                              │  │  │
│  │  │  • Saved resources                                            │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                              ↓ HTTP POST                                    │
│                    { topic, learningStyle }                                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ HTTPS
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CLOUDFLARE PAGES                                     │
│  • Global CDN (300+ data centers)                                           │
│  • Automatic deployments from GitHub                                        │
│  • Edge-optimized Next.js hosting                                          │
│  • Static + SSR support                                                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ API Request
                                    │ POST /api/search
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│                      CLOUDFLARE WORKERS                                     │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Worker Runtime (V8 Engine)                                           │  │
│  │  ┌──────────────────────────────────────────────────────────────┐  │  │
│  │  │  API Endpoint Handler                                        │  │  │
│  │  │  • Receives: { topic, learningStyle }                        │  │  │
│  │  │  • Validates input                                           │  │  │
│  │  │  • Coordinates parallel API calls                            │  │  │
│  │  └──────────────────────────────────────────────────────────────┘  │  │
│  │                              │                                      │  │
│  │                    ┌─────────┴─────────┐                           │  │
│  │                    │                   │                           │  │
│  │        ┌───────────▼──────┐  ┌────────▼──────────┐                │  │
│  │        │  API Fetchers    │  │  Data Normalizer   │                │  │
│  │        │  (Parallel)      │  │  • Merge responses │                │  │
│  │        └───────────┬──────┘  │  • Standardize JSON│                │  │
│  │                    │         └────────┬───────────┘                │  │
│  │        ┌───────────┼──────────┐       │                            │  │
│  │        │           │          │       │                            │  │
│  │  ┌─────▼───┐ ┌────▼────┐ ┌───▼────┐  │                            │  │
│  │  │ YouTube │ │ Spotify │ │NewsData│  │                            │  │
│  │  │  API    │ │   API   │ │  API   │  │                            │  │
│  │  └─────────┘ └─────────┘ └────────┘  │                            │  │
│  │        │           │          │       │                            │  │
│  │        └───────────┼──────────┘       │                            │  │
│  │                    │                  │                            │  │
│  │        ┌───────────▼──────────────────▼──────────┐                │  │
│  │        │  Normalized Resource Array               │                │  │
│  │        │  [{title, url, type, description, ...}]  │                │  │
│  │        └───────────┬──────────────────────────────┘                │  │
│  │                    │                                              │  │
│  │        ┌───────────▼──────────────────────────────┐               │  │
│  │        │  Workers AI Integration                  │               │  │
│  │        │  • Build prompt with topic + style       │               │  │
│  │        │  • Send to Llama 3.3 for ranking         │               │  │
│  │        └───────────┬──────────────────────────────┘               │  │
│  └────────────────────┼──────────────────────────────────────────────┘  │
│                       │                                                   │
└───────────────────────┼───────────────────────────────────────────────────┘
                        │
                        │ AI.run() binding
                        │
┌───────────────────────▼───────────────────────────────────────────────────┐
│                    CLOUDFLARE WORKERS AI                                   │
│  ┌─────────────────────────────────────────────────────────────────────┐ │
│  │  Llama 3.3 8B Instruct Model                                         │ │
│  │  • Runs on Cloudflare's edge GPUs                                    │ │
│  │  • Low-latency inference (< 100ms)                                   │ │
│  │  • Input: Prompt + resource array                                    │ │
│  │  • Output: Ranked resources with explanations                         │ │
│  │  • Returns: Top N recommendations with "why" reasons                 │ │
│  └─────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
                        │
                        │ Ranked JSON Response
                        │
┌───────────────────────▼───────────────────────────────────────────────────┐
│                      CLOUDFLARE WORKERS                                    │
│  ┌─────────────────────────────────────────────────────────────────────┐  │
│  │  Response Formatter                                                  │  │
│  │  • Formats AI response as JSON                                       │  │
│  │  • Adds CORS headers                                                 │  │
│  │  • Error handling                                                    │  │
│  └─────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
                        │
                        │ JSON Response
                        │ [{title, url, type, reason, summary, ...}]
                        │
┌───────────────────────▼───────────────────────────────────────────────────┐
│                    CLOUDFLARE PAGES (Frontend)                             │
│  • Renders resource cards                                                 │
│  • Displays AI explanations                                               │
│  • Saves favorites to localStorage                                        │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         EXTERNAL SERVICES                                   │
│                                                                             │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        │
│  │  YouTube Data    │  │  Spotify Web API │  │  NewsData.io API │        │
│  │  API v3          │  │                  │  │                  │        │
│  │                  │  │                  │  │                  │        │
│  │  • Videos        │  │  • Podcasts      │  │  • Articles      │        │
│  │  • Thumbnails    │  │  • Episodes      │  │  • News          │        │
│  │  • Descriptions  │  │  • Metadata      │  │  • Summaries     │        │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘        │
│                                                                             │
│  API Keys stored in: Cloudflare Workers Environment Variables              │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         STORAGE LAYER                                       │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Browser localStorage (Client-side)                                   │  │
│  │  • Favorites/bookmarks                                                │  │
│  │  • User preferences                                                   │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
│                                                                             │
│  ┌──────────────────────────────────────────────────────────────────────┐  │
│  │  Cloudflare KV (Optional - Future)                                    │  │
│  │  • Trending topics                                                    │  │
│  │  • Search analytics                                                   │  │
│  │  • Edge-accessible key-value store                                    │  │
│  └──────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DEPLOYMENT PIPELINE                                 │
│                                                                             │
│  ┌──────────┐         ┌──────────────────┐         ┌──────────────────┐ │
│  │  GitHub  │ ──────► │  Cloudflare Pages │         │ Cloudflare Workers│ │
│  │  Repo    │  Push   │  Auto-deploy      │         │  Wrangler deploy  │ │
│  │          │         │  Frontend         │         │  Backend          │ │
│  └──────────┘         └──────────────────┘         └──────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                         DATA FLOW SUMMARY                                    │
│                                                                             │
│  1. User enters topic + selects learning style                             │
│  2. Frontend sends POST to Cloudflare Worker                               │
│  3. Worker fetches from YouTube, Spotify, NewsData.io (parallel)           │
│  4. Worker normalizes and merges responses                                 │
│  5. Worker sends to Workers AI (Llama 3.3) for ranking                     │
│  6. AI returns ranked resources with explanations                          │
│  7. Worker formats and returns JSON to frontend                            │
│  8. Frontend renders resource cards                                        │
│  9. User can favorite items (stored in localStorage)                       │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘