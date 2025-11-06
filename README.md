# 🧠 LearnFlow

> *"Discover the best podcasts, videos, and articles to learn anything — personalized to your learning style."*

LearnFlow is an AI-powered learning resource curation platform that uses **Cloudflare Workers AI (Llama 3.3)** to intelligently rank and recommend educational content from YouTube, Spotify, and NewsData.io based on your preferred learning style.

## 🎯 Overview

The Internet is overflowing with educational content, but finding high-quality, relevant resources is time-consuming. LearnFlow solves this by:

- **Searching** multiple content sources simultaneously (YouTube videos, Spotify podcasts, articles)
- **AI-powered ranking** using Llama 3.3 to identify the most valuable resources
- **Personalized recommendations** tailored to your learning style (Visual 🎥, Listener 🎧, or Reader 📖)
- **Explainable AI** - each recommendation includes a brief explanation of why it was recommended

## ✨ Features

### Core Features
- 🔍 **Topic Search** - Search any subject you want to learn about
- 🎨 **Learning Style Selection** - Choose between Visual, Listener, or Reader preferences
- 🤖 **AI-Powered Curation** - Intelligent ranking using Cloudflare Workers AI (Llama 3.3)
- 💡 **Explainable Recommendations** - Each resource includes "Why this was recommended"
- ⭐ **Favorites** - Save resources to localStorage for later access
- 📱 **Responsive Design** - Works seamlessly on mobile and desktop

### Technical Features
- ⚡ **Edge Computing** - Powered by Cloudflare Workers for global performance
- 🚀 **Serverless Architecture** - Fully serverless with Cloudflare Pages + Workers
- 🔒 **Type-Safe** - Built with TypeScript for better developer experience
- 🎨 **Modern UI** - Built with Next.js 14, Tailwind CSS, and responsive design

## 🏗️ Architecture

```
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

**Deployment:**
- Frontend → **Cloudflare Pages**
- Backend → **Cloudflare Workers**
- Memory/State → **Cloudflare KV** (optional, for trending topics)

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** (App Router) - React framework with SSR
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **CSS Transitions** - Native animations

### Backend
- **Cloudflare Workers** - Serverless edge functions
- **TypeScript** - Type-safe backend code
- **Wrangler 3** - Development and deployment CLI

### AI & APIs
- **Cloudflare Workers AI** - Llama 3.3 8B Instruct model
- **YouTube Data API v3** - Video content
- **Spotify Web API** - Podcast content
- **NewsData.io API** - Article content

### Storage
- **LocalStorage** - Client-side favorites persistence
- **Cloudflare KV** - Optional server-side state (trending topics)

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** 18.x or later
- **npm** or **yarn** package manager
- **Cloudflare account** with Workers AI enabled
- **API Keys** for:
  - YouTube Data API v3
  - Spotify Web API (Client ID and Secret)
  - NewsData.io API

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/cf_ai_learnflow.git
cd cf_ai_learnflow
```

### 2. Install Dependencies

#### Frontend
```bash
npm install
# or
yarn install
```

#### Backend (Worker)
```bash
cd worker
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

#### Frontend (`.env.local`)
```env
NEXT_PUBLIC_WORKER_URL=https://your-worker.your-subdomain.workers.dev
```

#### Backend (Worker - `wrangler.toml` or Cloudflare Dashboard)
```toml
[vars]
YOUTUBE_API_KEY=your_youtube_api_key
SPOTIFY_CLIENT_ID=your_spotify_client_id
SPOTIFY_CLIENT_SECRET=your_spotify_client_secret
NEWSDATA_API_KEY=your_newsdata_api_key
```

Or set them in Cloudflare Dashboard:
1. Go to Workers & Pages → Your Worker → Settings → Variables
2. Add each variable as a secret

### 4. Get API Keys

#### YouTube Data API v3
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable YouTube Data API v3
4. Create credentials (API Key)
5. Copy the API key

#### Spotify Web API
1. Go to [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)
2. Create a new app
3. Copy Client ID and Client Secret
4. Note: You'll use Client Credentials flow for authentication

#### NewsData.io API
1. Go to [NewsData.io](https://newsdata.io/)
2. Sign up for a free account
3. Get your API key from the dashboard

### 5. Configure Cloudflare

#### Enable Workers AI
1. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Go to Workers & Pages → AI
3. Enable Workers AI for your account
4. Note your Account ID (needed for `wrangler.toml`)

#### Update `wrangler.toml`
```toml
name = "learnflow-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

account_id = "your-cloudflare-account-id"

[ai]
binding = "AI"
```

### 6. Run Development Servers

#### Frontend
```bash
npm run dev
# or
yarn dev
```
Open [http://localhost:3000](http://localhost:3000)

#### Backend (Worker)
```bash
cd worker
npm run dev
# or
wrangler dev
```

## 📁 Project Structure

```
cf_ai_learnflow/
├── Docs/                      # Project documentation
│   ├── Implementation.md      # Implementation plan
│   ├── project_structure.md   # Project structure details
│   └── UI_UX_doc.md           # UI/UX guidelines
├── src/                       # Frontend source (Next.js)
│   ├── app/                   # App Router pages
│   ├── components/            # React components
│   ├── lib/                   # Utilities and helpers
│   └── hooks/                 # Custom React hooks
├── worker/                    # Cloudflare Worker backend
│   ├── src/
│   │   ├── index.ts           # Worker entry point
│   │   ├── api/               # API integration functions
│   │   └── ai/                # AI prompt templates
│   └── wrangler.toml          # Worker configuration
├── public/                    # Static assets
├── .env.example              # Example environment variables
├── README.md                 # This file
└── PROMPTS.md                # AI prompts documentation
```

For detailed structure, see [`Docs/project_structure.md`](./Docs/project_structure.md)

## 🚢 Deployment

### Deploy Frontend to Cloudflare Pages

1. **Via GitHub Integration (Recommended)**
   - Push your code to GitHub
   - Go to Cloudflare Dashboard → Workers & Pages → Create Application
   - Select Pages → Connect to Git
   - Select your repository
   - Build settings:
     - Framework preset: Next.js
     - Build command: `npm run build`
     - Build output directory: `.next`

2. **Via Wrangler CLI**
   ```bash
   npm run build
   npx wrangler pages deploy .next
   ```

### Deploy Backend Worker

```bash
cd worker
npm run deploy
# or
wrangler publish
```

### Set Environment Variables

1. Go to Cloudflare Dashboard → Workers & Pages → Your Worker
2. Settings → Variables and Secrets
3. Add all required API keys as secrets

## 🧪 Development

### Available Scripts

#### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

#### Backend (Worker)
- `npm run dev` - Start local development server
- `npm run deploy` - Deploy to Cloudflare
- `npm run type-check` - Type check TypeScript

### Development Workflow

1. **Start both servers** (frontend and worker)
2. **Make changes** to frontend or worker code
3. **Test locally** before deploying
4. **Deploy worker** first, then frontend
5. **Update frontend** env variable with worker URL if needed

### Testing

- Manual testing with various topics
- Test all three learning styles
- Verify favorites persistence
- Test error scenarios
- Cross-browser testing (Chrome, Firefox, Safari)

## 📚 Documentation

- [Implementation Plan](./Docs/Implementation.md) - Detailed implementation stages
- [Project Structure](./Docs/project_structure.md) - File organization
- [UI/UX Documentation](./Docs/UI_UX_doc.md) - Design system and guidelines
- [PROMPTS.md](./PROMPTS.md) - AI prompts used for ranking

## 🔗 Resources

### Official Documentation
- [Next.js 14 Docs](https://nextjs.org/docs)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Cloudflare Workers AI](https://developers.cloudflare.com/workers-ai/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)

### API Documentation
- [YouTube Data API v3](https://developers.google.com/youtube/v3/docs)
- [Spotify Web API](https://developer.spotify.com/documentation/web-api)
- [NewsData.io API](https://newsdata.io/docs)

## 🎯 Success Criteria

- ✅ Deployed demo on Cloudflare Pages + Workers
- ✅ 5+ working recommendations per search
- ✅ Functional favorites persistence via localStorage
- ✅ README & PROMPTS files clear and complete
- ✅ All API integrations working correctly
- ✅ Responsive design works on mobile and desktop

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is created for the Cloudflare AI application submission.

## 🙏 Acknowledgments

- Built for Cloudflare's AI application challenge
- Uses Cloudflare Workers AI with Meta's Llama 3.3 model
- Powered by Cloudflare's edge network

## 📬 Contact

For questions or issues, please open an issue on GitHub.

---

**Built with ❤️ using Cloudflare Workers AI**
