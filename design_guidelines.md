# Design Guidelines for Axiom.trade/pulse Token Discovery Table Replica

## Design Approach
**Reference-Based Design**: Pixel-perfect (≤2px difference) replica of axiom.trade/pulse using their exact visual patterns, spacing, and interaction models.

## Core Design Elements

### Typography
- Modern sans-serif font stack (system fonts for performance)
- Headers: Bold weights for table headers and section titles
- Data cells: Medium weight for numbers, regular for labels
- Micro-typography: Smaller sizes for secondary info (percentages, timestamps)
- Tabular numbers for price/volume alignment

### Layout System
**Tailwind Spacing Units**: Primary spacing set of 1, 2, 4, 6, 8, 12, 16, 24
- Table padding: p-2 to p-4 for cells
- Row heights: h-12 (compact) to h-16 (comfortable)
- Container margins: mx-4 md:mx-8 lg:mx-12
- Section spacing: py-6 to py-12

### Component Library

**Table Components**:
- Sticky header with subtle shadow on scroll
- Zebra striping for row alternation (subtle background difference)
- Hover states with elevated background and border accent
- Virtualized scrolling container (no visible scrollbar styling unless needed)

**Navigation Tabs**:
- Pill-style tabs with active state indicator
- Clean transitions between states
- URL-synced active tab highlighting

**Data Cells**:
- Price Cell: Monospace alignment, dynamic color transitions (green→transparent for gains, red→transparent for losses over 600ms)
- Change Cell: Directional arrows with matching colors, percentage formatting
- Name Cell: Token icon (24px) + symbol (bold) + name (lighter weight)
- Tags Cell: Truncated with "..." and popover on interaction
- Action Cell: Kebab menu aligned right

**Interactive Elements**:
- Tooltips: Radix Tooltip with subtle shadow, 200ms delay
- Popovers: For tag details with light card treatment
- Modals: Full-screen on mobile, centered card on desktop with backdrop blur
- Sort indicators: Chevron icons in headers with rotation animation

**Loading States**:
- Skeleton rows: Shimmer gradient animation (light to lighter sweep)
- Progressive loading: Append with fade-in animation
- Error boundary: Centered error card with retry button

### Spacing & Rhythm
- Table row vertical padding: py-3
- Cell horizontal padding: px-4
- Header to content gap: mb-6
- Tab group spacing: gap-2
- Modal padding: p-6 md:p-8

### Animations
**Minimal & Purposeful**:
- Price color transitions: 600ms ease-out fade from gain/loss color to transparent
- Row hover: 150ms ease-in background change
- Tab switching: 200ms ease slide indicator
- Modal entry: 300ms ease-out scale + fade
- Skeleton shimmer: 1.5s infinite sweep

**No Animations**:
- Data updates (except color fade)
- Table sorting
- Scroll behavior

### Responsive Breakpoints
- Mobile (320px-767px): Single column card layout, collapse less-important columns
- Tablet (768px-1023px): 6-8 visible columns, scrollable horizontal overflow
- Desktop (1024px+): Full table with all columns visible

### Accessibility
- ARIA sort indicators on sortable headers
- Focus visible states on all interactive elements
- Keyboard navigation: Tab through headers, Enter to sort, Shift+Click for multi-sort
- Focus trap in modals with Esc to close
- Screen reader announcements for real-time price updates (aria-live="polite")

### Visual Hierarchy
1. **Primary**: Token name/symbol and current price
2. **Secondary**: 24h change percentage with color coding
3. **Tertiary**: Volume, market cap, rank
4. **Quaternary**: Tags, 7d change, actions

### Key UX Patterns
- Multi-column sorting: Shift+Click to add secondary sort columns with visual indicators showing sort order
- Search: Debounced input (300ms) with clear button when active
- Density toggle: Switch between compact/comfortable row heights
- Pinning: Allow pinning favorite tokens to top (stored in Redux)
- Real-time updates: Smooth color transitions without layout shift or jarring changes
- Progressive disclosure: Tag popover shows full list, modal shows complete token details

### Performance Constraints
- Pre-set row heights to prevent CLS
- Virtualized rendering for 10k+ rows
- Memoized cells and rows
- Reserved space for dynamic values (no layout shift on price updates)
- Image optimization for token icons (24px WebP with fallback)

This design prioritizes **data density, scan-ability, and real-time feedback** while maintaining a clean, professional aesthetic matching financial trading platforms.