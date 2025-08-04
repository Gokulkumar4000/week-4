# Overview

This is an HR Leave Management Portal built as a full-stack web application. The system allows employees to submit leave requests and HR personnel to review, approve, or reject them. The application features role-based access control with separate dashboards for employees and HR staff, real-time data management, and a modern responsive UI built with React and shadcn/ui components.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS custom properties for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for client-side routing
- **Authentication Context**: React Context API for user session management

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Database ORM**: Drizzle ORM with PostgreSQL dialect
- **Development Storage**: In-memory storage class for development/testing
- **API Design**: RESTful API with JSON responses
- **Middleware**: Custom logging middleware for API request tracking
- **Build System**: ESBuild for production bundling

## Authentication & Authorization
- **Authentication Provider**: Firebase Auth with email/password authentication
- **Database**: Firebase Firestore for real-time data storage and retrieval
- **Role-Based Access**: Two user roles (employee, hr) with separate dashboards
- **Protected Routes**: Route guards based on authentication status and user roles
- **Session Management**: Firebase handles session persistence and token management

## Data Architecture
- **Schema Management**: Zod schemas for validation in shared directory
- **Database**: Firebase Firestore collections (users, leaveRequests)
- **Type Safety**: TypeScript interfaces generated from Zod schemas
- **Data Models**: User and LeaveRequest entities with proper relationships
- **Real-time Updates**: Firestore provides real-time data synchronization

## UI/UX Design Patterns
- **Component System**: Modular shadcn/ui components with consistent styling
- **Design System**: CSS custom properties for theming with light/dark mode support
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: Radix UI primitives provide built-in accessibility features

# External Dependencies

## Database & ORM
- **Neon Database**: Serverless PostgreSQL database (@neondatabase/serverless)
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect (drizzle-orm)
- **Database Migrations**: Drizzle Kit for schema management

## Authentication & Backend Services
- **Firebase**: Authentication and Firestore database services
- **Express.js**: Web application framework for Node.js
- **Session Management**: connect-pg-simple for PostgreSQL session storage

## Frontend Libraries
- **React Ecosystem**: React 18 with TypeScript and Vite
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Data Fetching**: TanStack Query for server state management
- **Form Handling**: React Hook Form with Hookform resolvers
- **Styling**: Tailwind CSS with class-variance-authority for component variants

## Development Tools
- **Build Tools**: Vite for development and Esbuild for production builds
- **Type Checking**: TypeScript with strict mode enabled
- **Linting & Formatting**: Configured for modern React development
- **Replit Integration**: Vite plugins for Replit development environment