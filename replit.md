# Overview

This is a full-stack food delivery application for a restaurant called "Pizza Time" based in Sukhumi. The application provides an online ordering system for pizza, sushi, rolls, salads, and combo sets with cart functionality and order management. It features a modern React frontend with a Node.js/Express backend, utilizing PostgreSQL for data persistence and Drizzle ORM for database operations.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript and Vite for development/build tooling
- **UI Framework**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack React Query for server state and custom hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation schemas
- **Styling**: Custom CSS variables for theming with Montserrat and Open Sans fonts

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with endpoints for menu items, cart operations, and order management
- **Error Handling**: Centralized middleware for consistent error responses
- **Development**: Hot reload with Vite integration for seamless full-stack development

## Data Storage
- **Database**: PostgreSQL with connection pooling
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema**: Shared TypeScript schemas between frontend and backend using Zod
- **Migrations**: Drizzle Kit for database schema management
- **Fallback**: In-memory storage implementation for development/testing

## Authentication & Session Management
- **Session Tracking**: Browser localStorage for cart session persistence
- **No Authentication**: Simple session-based cart tracking without user accounts
- **Cart Persistence**: Session-based cart items with automatic cleanup

## External Dependencies
- **Database Hosting**: Neon Database (serverless PostgreSQL)
- **Image Hosting**: Unsplash for menu item images
- **Communication**: WhatsApp integration for customer orders and support
- **UI Components**: Radix UI primitives for accessible components
- **Development Tools**: Replit-specific integrations for cloud development environment

## Key Design Decisions

**Monorepo Structure**: Single repository with client/, server/, and shared/ directories for easy development and deployment.

**Shared Schema**: Common TypeScript types and Zod schemas in shared/ directory ensure type safety across frontend and backend.

**Progressive Enhancement**: Application works with basic functionality and enhances with JavaScript for better UX.

**Mobile-First Design**: Responsive design with mobile considerations throughout the component hierarchy.

**Session-Based Cart**: No user registration required - cart persists via browser storage with server-side validation.

**External Order Processing**: Orders ultimately processed through WhatsApp for personal touch and reliability.