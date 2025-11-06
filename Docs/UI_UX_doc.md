# UI/UX Documentation

## Design System

### Color Palette

#### Light Theme
- **Primary Background:** `#FFFFFF` (white)
- **Secondary Background:** `#F9FAFB` (gray-50)
- **Primary Text:** `#111827` (gray-900)
- **Secondary Text:** `#6B7280` (gray-500)
- **Accent Color:** `#3B82F6` (blue-500)
- **Accent Hover:** `#2563EB` (blue-600)
- **Border Color:** `#E5E7EB` (gray-200)
- **Success Color:** `#10B981` (green-500)
- **Error Color:** `#EF4444` (red-500)
- **Warning Color:** `#F59E0B` (amber-500)

#### Dark Theme
- **Primary Background:** `#111827` (gray-900)
- **Secondary Background:** `#1F2937` (gray-800)
- **Primary Text:** `#F9FAFB` (gray-50)
- **Secondary Text:** `#9CA3AF` (gray-400)
- **Accent Color:** `#60A5FA` (blue-400)
- **Accent Hover:** `#3B82F6` (blue-500)
- **Border Color:** `#374151` (gray-700)
- **Success Color:** `#34D399` (green-400)
- **Error Color:** `#F87171` (red-400)
- **Warning Color:** `#FBBF24` (amber-400)

### Typography

#### Font Families
- **Primary Font:** System font stack (`-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`)
- **Monospace:** `'Courier New', Courier, monospace` (for code/technical content)

#### Font Sizes
- **Hero/Title:** `text-4xl` (2.25rem / 36px) - Main page titles
- **Heading 1:** `text-3xl` (1.875rem / 30px) - Section headers
- **Heading 2:** `text-2xl` (1.5rem / 24px) - Subsection headers
- **Heading 3:** `text-xl` (1.25rem / 20px) - Card titles
- **Body:** `text-base` (1rem / 16px) - Default body text
- **Small:** `text-sm` (0.875rem / 14px) - Secondary text, metadata
- **Tiny:** `text-xs` (0.75rem / 12px) - Labels, timestamps

#### Font Weights
- **Bold:** `font-bold` (700) - Headings, important text
- **Semibold:** `font-semibold` (600) - Subheadings
- **Medium:** `font-medium` (500) - Emphasis
- **Regular:** `font-normal` (400) - Body text
- **Light:** `font-light` (300) - Secondary text

### Spacing System

Using Tailwind's spacing scale (4px base unit):
- **xs:** `0.5` (2px)
- **sm:** `1` (4px)
- **md:** `2` (8px)
- **lg:** `4` (16px)
- **xl:** `6` (24px)
- **2xl:** `8` (32px)
- **3xl:** `12` (48px)
- **4xl:** `16` (64px)

### Border Radius

- **None:** `rounded-none` (0px)
- **Small:** `rounded-sm` (2px)
- **Default:** `rounded` (4px)
- **Medium:** `rounded-md` (6px)
- **Large:** `rounded-lg` (8px)
- **XL:** `rounded-xl` (12px)
- **Full:** `rounded-full` (9999px)

### Shadows

- **Small:** `shadow-sm` - Subtle elevation
- **Default:** `shadow` - Standard card elevation
- **Medium:** `shadow-md` - Modal, dropdown elevation
- **Large:** `shadow-lg` - Prominent elements
- **XL:** `shadow-xl` - High elevation elements

### Breakpoints (Responsive Design)

- **Mobile:** `< 640px` (default)
- **Tablet:** `≥ 640px` (sm)
- **Desktop:** `≥ 1024px` (lg)
- **Large Desktop:** `≥ 1280px` (xl)

## UI Component Guidelines

### Buttons

#### Primary Button
- Background: Accent color
- Text: White
- Padding: `px-6 py-3`
- Border radius: `rounded-lg`
- Font weight: `font-semibold`
- Hover: Darker shade, slight scale transform
- Disabled: Reduced opacity (50%), no interaction

#### Secondary Button
- Background: Transparent with border
- Border: Accent color
- Text: Accent color
- Hover: Background fill with accent color, text becomes white

#### Ghost Button
- Background: Transparent
- Text: Primary text color
- Hover: Background becomes secondary background color

#### Learning Style Buttons
- Large, prominent buttons for Visual 🎥, Listener 🎧, Reader 📖
- Icon + text label
- Selected state: Accent background with white text
- Unselected: Border with transparent background
- Size: `py-4 px-6` minimum

### Cards

#### Resource Card
- Background: Secondary background color
- Border: Border color (1px solid)
- Border radius: `rounded-xl`
- Padding: `p-6`
- Shadow: Default shadow
- Hover: Slight scale (1.02), shadow increase
- Content:
  - Thumbnail image (top, rounded corners)
  - Title (heading 3, bold)
  - Source badge (YouTube/Spotify/Article)
  - Reason text (secondary text, italic)
  - Action buttons (favorite, view details)

#### Card Layout
- Grid layout: 1 column on mobile, 2 columns on tablet, 3 columns on desktop
- Gap: `gap-6` between cards
- Responsive padding on container

### Input Fields

#### Search Input
- Large, prominent input field
- Border: `border-2` with accent color on focus
- Border radius: `rounded-lg`
- Padding: `px-4 py-3`
- Font size: `text-lg`
- Placeholder: Light gray text
- Focus state: Ring effect with accent color

#### Filter Input
- Smaller, secondary input
- Border: Standard border color
- Border radius: `rounded-md`
- Padding: `px-3 py-2`

### Modal/Dialog

#### Modal Overlay
- Background: Black with 50% opacity
- Full screen coverage
- Backdrop blur: Optional

#### Modal Content
- Background: Primary background color
- Border radius: `rounded-2xl`
- Max width: `max-w-2xl` for content modals
- Padding: `p-8`
- Shadow: Large shadow
- Close button: Top right, X icon

### Loading States

#### Skeleton Loaders
- Animated shimmer effect
- Match content structure (cards, text lines)
- Use secondary background color
- Border radius matches final content

#### Spinner
- Circular spinner with accent color
- Center aligned
- Size: `w-8 h-8` for inline, `w-12 h-12` for full page

### Empty States

#### No Results
- Icon or illustration
- Heading: "No results found"
- Subtext: "Try a different search term"
- Suggested actions or search tips

#### No Favorites
- Icon or illustration
- Heading: "No favorites yet"
- Subtext: "Start exploring and save your favorite resources"
- Link to search page

### Badges/Tags

#### Source Badge
- Small, rounded badge
- Color coding:
  - YouTube: Red (`#FF0000`)
  - Spotify: Green (`#1DB954`)
  - Article: Blue (accent color)
- Text: White, uppercase, small font

#### Type Badge
- Indicates resource type (Video/Podcast/Article)
- Secondary background color
- Primary text color
- Small font size

## Component Library Organization

### Base Components (`/components/ui`)
- **Button**: Reusable button with variants (primary, secondary, ghost)
- **Card**: Base card component with consistent styling
- **Input**: Text input with validation states
- **Modal**: Modal/dialog component with overlay
- **Select**: Dropdown select component
- **Badge**: Badge/tag component for labels

### Feature Components

#### Search Components (`/components/search`)
- **SearchInput**: Large search input with icon
- **LearningStyleSelector**: Three-button selector with icons

#### Resource Components (`/components/resources`)
- **ResourceCard**: Individual resource display card
- **ResourceList**: Grid/list container for resources
- **ResourceModal**: Detailed resource view modal
- **ResourceFilters**: Sorting and filtering controls

#### Favorites Components (`/components/favorites`)
- **FavoritesList**: List of saved resources

#### Layout Components (`/components/layout`)
- **Header**: App header with navigation and theme toggle
- **Footer**: App footer (optional)
- **ThemeToggle**: Dark/light mode switcher

## User Experience Flow

### Main Search Flow

```
[Landing Page]
    ↓
[User enters topic]
    ↓
[User selects learning style]
    ↓
[User clicks "Search" button]
    ↓
[Loading state displays]
    ↓
[Results displayed in grid]
    ↓
[User can interact with cards]
    ├─→ [Click card → View details modal]
    ├─→ [Favorite button → Save to localStorage]
    └─→ [Filter/Sort → Update results]
```

### Favorites Flow

```
[User clicks "Favorites" in navigation]
    ↓
[Favorites page loads from localStorage]
    ↓
[Display saved resources]
    ↓
[User can interact with favorites]
    ├─→ [Click card → View details]
    ├─→ [Remove favorite → Update localStorage]
    └─→ [Click "Back to Search" → Return to search]
```

### Resource Detail Flow

```
[User clicks on resource card]
    ↓
[Modal opens with fade-in animation]
    ↓
[Display full resource details]
    ├─ Title
    ├─ Summary
    ├─ Why recommended (reason)
    ├─ Source and date
    └─ External link button
    ↓
[User can interact]
    ├─→ [Click "Open Link" → New tab with resource]
    ├─→ [Click "Favorite" → Toggle favorite status]
    ├─→ [Click outside or X → Close modal]
    └─→ [Escape key → Close modal]
```

## Responsive Design Requirements

### Mobile (< 640px)
- Single column layout for resource cards
- Full-width search input
- Stacked learning style buttons (vertical)
- Bottom navigation or hamburger menu
- Modal: Full screen or near-full screen
- Touch-friendly button sizes (min 44px height)

### Tablet (640px - 1024px)
- Two-column grid for resource cards
- Horizontal learning style buttons
- Side-by-side filters
- Modal: Centered with max-width

### Desktop (≥ 1024px)
- Three-column grid for resource cards
- Horizontal learning style buttons
- Sidebar or top navigation
- Modal: Centered with max-width `2xl`

### Large Desktop (≥ 1280px)
- Maintain three-column grid (don't expand too wide)
- Max-width container for optimal reading width
- Consistent spacing and padding

## Accessibility Standards

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows visual flow
- Focus indicators visible (ring with accent color)
- Escape key closes modals
- Enter/Space activates buttons

### Screen Reader Support
- Semantic HTML elements (`<nav>`, `<main>`, `<article>`)
- ARIA labels for icon-only buttons
- ARIA live regions for loading states
- Alt text for images (thumbnails)
- Descriptive link text (not just "click here")

### Color Contrast
- Text contrast ratio: Minimum 4.5:1 for normal text, 3:1 for large text
- Interactive elements: Clear visual distinction
- Don't rely solely on color for information (use icons + text)

### Focus Management
- Focus trap in modals
- Return focus to trigger after modal closes
- Focus visible on all interactive elements

## Animation Guidelines

### Framer Motion Usage

#### Page Transitions
- Fade in: `fadeIn` animation (opacity 0 → 1, duration 300ms)
- Slide in: `slideIn` animation (transform + opacity)

#### Card Animations
- Stagger: Cards appear with slight delay between each
- Hover: Scale (1.02) + shadow increase
- Click: Brief scale down (0.98) for tactile feedback

#### Modal Animations
- Backdrop: Fade in (opacity 0 → 1)
- Content: Scale + fade (scale 0.95 → 1, opacity 0 → 1)
- Duration: 200-300ms for snappy feel

#### Loading States
- Skeleton shimmer: Continuous animation
- Spinner: Rotating animation

### Animation Principles
- Keep animations subtle and purposeful
- Respect `prefers-reduced-motion` media query
- Use easing functions for natural feel (`ease-out` for reveals, `ease-in-out` for transitions)
- Avoid excessive motion (no more than 3-4 animations per interaction)

## User Journey Maps

### First-Time User Journey
1. **Landing**: Clean, simple interface with clear search input
2. **Discovery**: Try a search on an interesting topic
3. **Learning Style**: Understand what learning styles mean (tooltips or brief explanation)
4. **Results**: See curated recommendations with explanations
5. **Interaction**: Click on a resource to see details
6. **Favorites**: Discover favorites feature through UI hints
7. **Return**: Use favorites to access saved content later

### Returning User Journey
1. **Return**: Quick access to search or favorites
2. **New Search**: Explore new topics
3. **Favorites**: Review saved resources
4. **Details**: Access previously saved resources quickly

### Power User Journey
1. **Quick Search**: Use keyboard shortcuts (if implemented)
2. **Filtering**: Use advanced filters to narrow results
3. **Multiple Searches**: Explore related topics
4. **Organization**: Manage favorites effectively

## Style Guide

### Iconography
- Use emoji for learning style indicators (🎥 🎧 📖)
- Use SVG icons for UI actions (favorite, close, search)
- Consistent icon size: `w-5 h-5` for inline, `w-6 h-6` for buttons

### Imagery
- Thumbnails: Maintain aspect ratio (16:9 for videos)
- Fallback: Placeholder image or gradient if thumbnail unavailable
- Lazy loading: Load images as they enter viewport

### Copy/Tone
- Friendly and encouraging
- Clear and concise
- Educational but not condescending
- Action-oriented button text

### Error Messages
- User-friendly language (avoid technical jargon)
- Suggest solutions or next steps
- Visual distinction (error color, icon)
- Non-blocking when possible

## Design Tool Integration

### Recommended Tools
- **Figma**: For design mockups and component library
- **Tailwind CSS IntelliSense**: For VS Code autocomplete
- **Framer Motion DevTools**: For animation debugging

### Design Tokens
- Export Tailwind config as design tokens
- Maintain consistency between design and code
- Use CSS variables for theme switching

## Branding Guidelines

### Logo
- Simple, clean logo (if applicable)
- Place in header/navigation
- Responsive sizing

### Color Usage
- Accent color: Primary actions, links, highlights
- Success: Confirmation messages, completed states
- Error: Error messages, destructive actions
- Warning: Cautionary messages

### Typography Hierarchy
- Clear visual hierarchy through size and weight
- Consistent spacing between elements
- Readable line heights (1.5-1.6 for body text)

## Performance Considerations

### Image Optimization
- Use Next.js `Image` component
- Lazy load images
- WebP format where supported
- Appropriate sizes for thumbnails

### Animation Performance
- Use CSS transforms (not position changes)
- GPU-accelerated properties
- Limit simultaneous animations
- Test on lower-end devices

### Loading States
- Show loading indicators immediately
- Progressive loading where possible
- Skeleton screens for better perceived performance

## Testing Requirements

### Visual Testing
- Test on multiple screen sizes
- Test both light and dark themes
- Verify color contrast ratios
- Check animation smoothness

### Interaction Testing
- Test all clickable elements
- Verify keyboard navigation
- Test modal interactions
- Verify favorites functionality

### Browser Testing
- Chrome/Edge (Chromium)
- Firefox
- Safari (iOS and macOS)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

### Potential UI Improvements
- Search suggestions/autocomplete
- Recent searches history
- Advanced filtering options
- Resource previews (hover cards)
- Share functionality
- Export favorites
- Print-friendly view

### Accessibility Enhancements
- High contrast mode
- Font size controls
- Keyboard shortcuts documentation
- Voice navigation support

