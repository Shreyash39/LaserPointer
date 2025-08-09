# Overview

This is a laser pointer/drawing tool web application that allows users to annotate and highlight content on web pages. The application features a React frontend with an interactive canvas for drawing various shapes (freehand, circles, underlines, arrows) overlaid on demo web content. It uses a full-stack architecture with Express.js backend, PostgreSQL database with Drizzle ORM, and shadcn/ui components for the user interface.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design system
- **State Management**: React hooks for local state, TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Drawing System**: Custom HTML5 Canvas implementation with touch and mouse event handling

## Component Structure
- **Modular UI Components**: Pre-built shadcn/ui components (buttons, dialogs, forms, etc.)
- **Custom Drawing Components**: 
  - `DrawingCanvas`: Handles canvas rendering and user interactions
  - `FloatingToolbar`: Provides drawing tools, color selection, and controls
  - `StatusIndicator`: Shows laser mode status
- **Layout**: Demo content with overlay drawing capabilities

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Interface**: Abstracted storage layer with in-memory implementation for development
- **API Design**: RESTful endpoints with `/api` prefix
- **Error Handling**: Centralized error middleware with structured error responses

## Data Layer
- **ORM**: Drizzle with PostgreSQL dialect for schema management and queries
- **Schema**: User management system with username/password authentication
- **Migrations**: Automated schema migrations via drizzle-kit
- **Validation**: Zod schemas for runtime type validation and API contract enforcement

## Drawing System Design
- **Tool Types**: Freehand drawing, circle annotations, underline highlighting, arrow pointing
- **State Management**: Custom `useDrawing` hook managing drawing state, tool selection, and canvas operations
- **Event Handling**: Unified mouse and touch event system for cross-device compatibility
- **Canvas Operations**: Real-time drawing with undo/redo functionality and clear canvas options

## Development Workflow
- **Build System**: Vite for frontend bundling with hot module replacement
- **Development**: Concurrent frontend/backend development with proxy setup
- **TypeScript**: Strict type checking across client, server, and shared modules
- **Path Aliases**: Organized imports with `@/` for client, `@shared/` for shared utilities

# External Dependencies

## Database & ORM
- **PostgreSQL**: Primary database (configured for Neon Database serverless)
- **Drizzle ORM**: Type-safe database client with schema migrations
- **connect-pg-simple**: PostgreSQL session store integration

## Frontend Libraries
- **React Ecosystem**: React, React DOM, React Query for data fetching
- **UI Framework**: Radix UI primitives with shadcn/ui component system
- **Styling**: Tailwind CSS with CSS variables for theming
- **Icons**: Lucide React for consistent iconography
- **Routing**: Wouter for lightweight routing solution

## Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Code Quality**: ESBuild for production bundling
- **Replit Integration**: Vite plugins for Replit development environment
- **Form Handling**: React Hook Form with Hookform resolvers for validation

## Canvas & Drawing
- **HTML5 Canvas**: Native browser drawing capabilities
- **Touch Events**: Cross-platform touch and mouse event handling
- **Animation**: CSS transitions and transforms for smooth interactions

## Utility Libraries
- **Date Handling**: date-fns for date manipulation
- **Class Management**: clsx and class-variance-authority for dynamic styling
- **Validation**: Zod for schema validation and type inference
- **UUID Generation**: Built-in crypto module for unique identifiers