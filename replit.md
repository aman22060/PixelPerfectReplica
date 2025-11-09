# Token Discovery Table Application

## Overview

This is a pixel-perfect replica of the axiom.trade/pulse token discovery table, built as a full-stack web application. The project displays cryptocurrency token data in an interactive, sortable, and filterable table with real-time price updates. It features a modern, responsive UI with support for different view densities, search functionality, and detailed token modals.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18+ with TypeScript (strict mode enabled)

- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system based on shadcn/ui "new-york" style
- **Component Library**: Radix UI primitives for accessible, unstyled components
- **Build Tool**: Vite for fast development and optimized production builds

**State Management**: Redux Toolkit for global application state
- `tableSlice`: Manages active tab, sort configurations, search query, and pinned tokens
- `uiSlice`: Handles UI preferences like table density and selected token for detail modal

**Data Fetching**: TanStack Query (React Query) for server state management
- Configured with `staleTime: Infinity` and no automatic refetching
- Custom query functions for token lists and individual token details
- Optimistic updates for real-time price changes via WebSocket

**Performance Optimizations**:
- Virtual scrolling using `@tanstack/react-virtual` for efficient rendering of large token lists
- React.memo on TokenRow components to prevent unnecessary re-renders
- Memoized sorting logic and row calculations
- Row height pre-calculation (48px compact, 64px comfortable) to prevent layout shifts

**Real-time Updates**: WebSocket connection for live price updates
- Automatic reconnection with 5-second delay on disconnect
- Updates are merged into React Query cache without full refetch
- Price flash animations (600ms duration) to indicate gains/losses

### Backend Architecture

**Framework**: Express.js with TypeScript

- **Server Setup**: Custom Vite middleware integration for HMR during development
- **API Routes**: RESTful endpoints for token data operations
- **WebSocket Server**: Built with `ws` library for real-time price broadcasting

**API Endpoints**:
- `GET /api/tokens` - List tokens with filtering, sorting, and pagination
  - Query params: `tab` (new/final/migrated), `page`, `pageSize`, `search`, `sort`
  - Returns paginated token data with total count
- `GET /api/tokens/:id` - Retrieve detailed information for a specific token
- WebSocket endpoint at `/ws` for real-time price updates

**Request Logging**: Custom middleware captures API request/response with timing information

### Data Storage

**ORM**: Drizzle ORM for type-safe database operations

**Database Schema** (PostgreSQL via Neon serverless):
- `tokens` table with fields:
  - `id` (varchar, primary key)
  - `rank` (integer) - Display position
  - `name`, `symbol`, `icon` (text) - Token identification
  - `price`, `change24h`, `change7d` (numeric with precision) - Price data
  - `volume24h`, `marketCap` (numeric) - Market metrics
  - `tags` (text array) - Categorization labels
  - `status` (enum: 'new', 'final', 'migrated') - Tab classification
  - `description`, `website`, `twitter` (optional text) - Additional details
  - `updatedAt` (timestamp) - Last modification time

**Storage Layer**: Abstracted through `IStorage` interface for testability
- Implements filtering by status, search term matching
- Multi-column sorting with configurable directions
- Pagination support with offset/limit

**Data Seeding**: Seed script generates mock cryptocurrency data for development

### External Dependencies

**UI Component Library**:
- `@radix-ui/*` - 20+ accessible component primitives (Dialog, Popover, Tooltip, Tabs, etc.)
- `shadcn/ui` - Pre-styled Radix components following the "new-york" design system
- `lucide-react` - Icon library for consistent iconography

**Database & ORM**:
- `@neondatabase/serverless` - Serverless PostgreSQL database
- `drizzle-orm` - Type-safe SQL query builder
- `drizzle-kit` - Schema migration and push tools

**State & Data**:
- `@reduxjs/toolkit` - Redux state management with modern utilities
- `@tanstack/react-query` - Async state and caching
- `@tanstack/react-virtual` - Virtual scrolling for performance

**Utilities**:
- `class-variance-authority` - Component variant management
- `clsx` + `tailwind-merge` - Conditional CSS class composition
- `date-fns` - Date formatting and manipulation
- `zod` - Runtime schema validation
- `@hookform/resolvers` - Form validation integration

**Development Tools**:
- `@replit/*` plugins - Runtime error overlay, cartographer, dev banner for Replit environment
- `ws` - WebSocket library polyfill for Neon database connections

**Fonts**: Google Fonts (preconnected in HTML)
- DM Sans - Primary UI font
- Fira Code & Geist Mono - Monospace fonts for code/numbers
- Architects Daughter - Display font