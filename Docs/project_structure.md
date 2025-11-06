# Project Structure

## Root Directory

```
cf_ai_learnflow/
├── .github/                    # GitHub workflows and configurations
│   └── workflows/              # CI/CD workflows (optional)
├── .next/                      # Next.js build output (gitignored)
├── .wrangler/                  # Wrangler build cache (gitignored)
├── Docs/                       # Project documentation
│   ├── Implementation.md       # Implementation plan
│   ├── project_structure.md    # This file
│   └── UI_UX_doc.md            # UI/UX specifications
├── public/                     # Static assets
│   ├── demo.png                # Demo screenshot for README
│   └── images/                 # Image assets (if any)
├── src/                        # Frontend source code (Next.js)
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout component
│   │   ├── page.tsx            # Home/search page
│   │   ├── favorites/          # Favorites page route
│   │   │   └── page.tsx
│   │   └── api/                # API routes (if needed)
│   ├── components/             # React components
│   │   ├── ui/                 # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Select.tsx
│   │   ├── search/             # Search-related components
│   │   │   ├── SearchInput.tsx
│   │   │   └── LearningStyleSelector.tsx
│   │   ├── resources/          # Resource-related components
│   │   │   ├── ResourceCard.tsx
│   │   │   ├── ResourceList.tsx
│   │   │   ├── ResourceModal.tsx
│   │   │   └── ResourceFilters.tsx
│   │   ├── favorites/          # Favorites components
│   │   │   └── FavoritesList.tsx
│   │   └── layout/             # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ThemeToggle.tsx
│   ├── lib/                    # Utility functions and helpers
│   │   ├── api.ts              # API client functions
│   │   ├── localStorage.ts     # localStorage utilities
│   │   ├── utils.ts            # General utilities
│   │   └── types.ts            # TypeScript type definitions
│   ├── hooks/                  # Custom React hooks
│   │   ├── useSearch.ts
│   │   ├── useFavorites.ts
│   │   └── useTheme.ts
│   └── styles/                 # Global styles
│       └── globals.css         # Tailwind imports and custom styles
├── worker/                     # Cloudflare Worker source code
│   ├── src/
│   │   ├── index.ts           # Worker entry point
│   │   ├── api/                # API integration functions
│   │   │   ├── youtube.ts
│   │   │   ├── spotify.ts
│   │   │   └── newsdata.ts
│   │   ├── ai/                 # AI-related functions
│   │   │   ├── prompts.ts      # AI prompt templates
│   │   │   └── ranking.ts      # Ranking logic
│   │   ├── utils/              # Worker utilities
│   │   │   ├── normalize.ts   # Data normalization
│   │   │   └── validation.ts  # Input validation
│   │   └── types.ts            # TypeScript types for worker
│   └── wrangler.toml           # Wrangler configuration
├── .env.example                # Example environment variables
├── .env.local                  # Local environment variables (gitignored)
├── .gitignore                  # Git ignore rules
├── next.config.js              # Next.js configuration
├── package.json                # Frontend dependencies
├── package-lock.json           # Frontend dependency lock file
├── postcss.config.js           # PostCSS configuration for Tailwind
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── README.md                   # Project README
├── PROMPTS.md                  # AI prompts documentation
└── LearnFlow_PRD.md            # Product Requirements Document
```

## Detailed Structure

### `/Docs`
Contains all project documentation:
- **Implementation.md**: Complete implementation plan with stages and checkboxes
- **project_structure.md**: This file - project organization and file structure
- **UI_UX_doc.md**: Design system, component guidelines, and UX flows

### `/public`
Static assets served directly by Next.js:
- **demo.png**: Screenshot or demo GIF for README
- **images/**: Any additional image assets (logos, icons, etc.)

### `/src/app`
Next.js 14 App Router structure:
- **layout.tsx**: Root layout with providers and global styles
- **page.tsx**: Main search/home page
- **favorites/page.tsx**: Favorites page route
- **api/**: API routes (if needed for proxy or additional endpoints)

### `/src/components`
React component organization by feature:

#### `/ui`
Reusable UI primitives:
- **Button.tsx**: Styled button component with variants
- **Card.tsx**: Base card component for resources
- **Input.tsx**: Text input component
- **Modal.tsx**: Modal/dialog component
- **Select.tsx**: Dropdown select component

#### `/search`
Search-related components:
- **SearchInput.tsx**: Topic search input with validation
- **LearningStyleSelector.tsx**: Visual/Listener/Reader selection buttons

#### `/resources`
Resource display components:
- **ResourceCard.tsx**: Individual resource card with thumbnail, title, reason
- **ResourceList.tsx**: Container for resource cards with layout
- **ResourceModal.tsx**: Detailed view modal for resources
- **ResourceFilters.tsx**: Sorting and filtering controls

#### `/favorites`
Favorites-specific components:
- **FavoritesList.tsx**: List of favorited resources

#### `/layout`
Layout components:
- **Header.tsx**: App header with navigation
- **Footer.tsx**: App footer (optional)
- **ThemeToggle.tsx**: Dark/light theme switcher

### `/src/lib`
Utility functions and helpers:
- **api.ts**: Functions to call Cloudflare Worker API
- **localStorage.ts**: Favorites persistence utilities
- **utils.ts**: General helper functions (formatting, date parsing, etc.)
- **types.ts**: Shared TypeScript interfaces and types

### `/src/hooks`
Custom React hooks:
- **useSearch.ts**: Search functionality hook
- **useFavorites.ts**: Favorites management hook
- **useTheme.ts**: Theme management hook

### `/src/styles`
Global styles:
- **globals.css**: Tailwind CSS imports and custom global styles

### `/worker`
Cloudflare Worker source code:

#### `/worker/src`
Worker TypeScript source:
- **index.ts**: Main worker entry point with request handling
- **api/**: External API integration functions
  - **youtube.ts**: YouTube Data API v3 integration
  - **spotify.ts**: Spotify Web API integration
  - **newsdata.ts**: NewsData.io API integration
- **ai/**: AI-related functions
  - **prompts.ts**: Prompt templates for Llama 3.3
  - **ranking.ts**: AI ranking and reasoning logic
- **utils/**: Worker utilities
  - **normalize.ts**: Data normalization and merging
  - **validation.ts**: Input validation and sanitization
- **types.ts**: Worker-specific TypeScript types

#### `/worker/wrangler.toml`
Wrangler configuration:
- Account ID and worker name
- KV namespace bindings (if using trending topics)
- Environment variables
- Routes and zones (if custom domain)

## File Naming Conventions

### Components
- Use PascalCase: `ResourceCard.tsx`, `LearningStyleSelector.tsx`
- Component files match component name exactly

### Utilities
- Use camelCase: `api.ts`, `localStorage.ts`
- Descriptive names that indicate purpose

### Types
- Use camelCase: `types.ts`
- Export interfaces/types with PascalCase: `Resource`, `SearchResult`

### Configuration Files
- Use lowercase with hyphens: `next.config.js`, `tailwind.config.js`
- Standard naming for framework-specific configs

## Module Organization Patterns

### Component Structure
Each component should:
1. Export as default or named export
2. Include TypeScript types/interfaces
3. Be self-contained with minimal dependencies
4. Follow single responsibility principle

### API Integration Pattern
- Separate file per API: `youtube.ts`, `spotify.ts`, `newsdata.ts`
- Consistent error handling across all APIs
- Type-safe responses with TypeScript interfaces

### State Management Pattern
- Use React hooks for local state
- localStorage for persistence (favorites)
- Cloudflare KV for server-side state (trending topics)

## Configuration Files

### `package.json`
Frontend dependencies and scripts:
- Next.js, React, TypeScript
- Tailwind CSS, Framer Motion
- Development and build scripts

### `wrangler.toml`
Cloudflare Worker configuration:
- Worker name and account ID
- KV namespace bindings
- Environment variables
- Routes configuration

### `next.config.js`
Next.js configuration:
- Image domains (for YouTube thumbnails)
- Environment variables
- Output configuration for Cloudflare Pages

### `tailwind.config.js`
Tailwind CSS customization:
- Theme colors and spacing
- Custom animations
- Content paths for purging

### `tsconfig.json`
TypeScript configuration:
- Strict mode enabled
- Path aliases for cleaner imports
- Next.js and React types

## Environment Variables

### Frontend (`.env.local`)
- `NEXT_PUBLIC_WORKER_URL`: Cloudflare Worker URL
- `NEXT_PUBLIC_API_URL`: Alternative API URL (if needed)

### Worker (via `wrangler.toml` or Cloudflare Dashboard)
- `YOUTUBE_API_KEY`: YouTube Data API v3 key
- `SPOTIFY_CLIENT_ID`: Spotify API client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify API client secret
- `NEWSDATA_API_KEY`: NewsData.io API key
- `CLOUDFLARE_ACCOUNT_ID`: Cloudflare account ID (for Workers AI)

## Build and Deployment Structure

### Development Build
- Frontend: `npm run dev` (Next.js dev server)
- Worker: `wrangler dev` (local worker development)

### Production Build
- Frontend: `npm run build` → outputs to `.next/`
- Worker: `wrangler publish` → deploys to Cloudflare

### Deployment Flow
1. Frontend builds to static files
2. Cloudflare Pages deploys from `.next/` output
3. Worker deploys separately via Wrangler
4. Frontend calls Worker via configured URL

## Asset Organization

### Images
- Store in `/public/images/` for static assets
- Use Next.js `Image` component for optimization
- Support WebP format where possible

### Icons
- Use emoji or SVG icons inline
- Consider icon library (Lucide React, Heroicons) if needed

### Fonts
- Use system fonts or Next.js font optimization
- Configure in `layout.tsx` if custom fonts needed

## Documentation Placement

- **README.md**: Root level - setup, deployment, overview
- **PROMPTS.md**: Root level - all AI prompts used
- **LearnFlow_PRD.md**: Root level - original PRD reference
- **Docs/**: All detailed documentation

## Version Control Structure

### Git Ignore
- `.next/` - Next.js build output
- `.wrangler/` - Wrangler cache
- `.env.local` - Local environment variables
- `node_modules/` - Dependencies
- `.DS_Store` - macOS system files

### Branch Strategy
- `main` - Production-ready code
- `develop` - Development branch (optional)
- Feature branches for larger features

## Testing Structure (Future)

If adding tests:
```
├── __tests__/                  # Test files
│   ├── components/
│   ├── lib/
│   └── worker/
├── jest.config.js              # Jest configuration
└── .test.env                   # Test environment variables
```

## Additional Notes

- Keep components small and focused
- Use TypeScript strictly for type safety
- Follow Next.js 14 App Router patterns
- Maintain consistent code style (consider ESLint/Prettier)
- Document complex logic and API integrations
- Keep worker code lightweight and efficient
- Optimize for Cloudflare's edge network

