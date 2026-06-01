# Kairo OS System Architecture

## Overview
Kairo OS is an enterprise-grade, real-time operating system built for high-performance executive workflows. It leverages a modern React server components architecture infused with real-time sync capabilities, role-based access control, and a scalable database schema.

## Core Technology Stack
- **Framework**: Next.js 16.2.6 (App Router)
- **UI Library**: React 19, Tailwind CSS v4, Framer Motion
- **State Management**: TanStack Query (React Query)
- **Backend & Database**: Supabase (PostgreSQL, Auth, Storage, Realtime)
- **Validation**: Zod v4

## Directory Structure
- `src/app/` - Next.js App Router definitions and top-level pages.
- `src/components/` - UI elements divided into domains (`admin`, `auth`, `shared`, `ui`, etc.).
- `src/actions/` - Server Actions defining mutation boundaries for CRM, finance, AI, projects, etc.
- `src/services/` - Business logic layer that orchestrates data persistence, notifications, and logic.
- `src/repositories/` - Data access layer directly communicating with Supabase and Mock DB.
- `src/providers/` - React Context providers (`AuthProvider`, `RealtimeProvider`, `QueryProvider`).
- `src/schemas/` - Zod schemas for input validation.
- `src/lib/` - Utilities for logger, Supabase clients, and global environment state.

## Architecture Patterns
### 1. Server Actions Architecture
Data mutations flow strictly via Next.js Server Actions (`use server`):
`Client Action` → `Zod Validation` → `Business Logic Service` → `Repository Layer` → `Supabase/LocalDb`
Each step is audited and logged centrally via the `logger.ts` and `AuditService`.

### 2. Repository Pattern
9 core repositories abstract database interactions. This allows the system to seamlessly toggle between "Mock Mode" (local state) and "Production Mode" (Supabase PostgreSQL) without altering business logic.

### 3. Authentication & Security
- The `src/proxy.ts` middleware intercepts incoming requests and guards protected routes.
- The `AuthProvider` handles client-side session hydration via localStorage.
- The `requireServerAuth()` and `requireOperatorAuth()` actions restrict server-side mutations.
- Row-Level Security (RLS) is fully enforced inside Supabase, granting access only to authorized client/operator roles.

### 4. Real-time Engine
`RealtimeProvider` connects to Supabase WebSocket channels using CDC (Change Data Capture) to broadcast updates. `useRealtimeSync` ties this to TanStack Query for instantaneous UI updates without heavy refetching loops.

### 5. Storage Infrastructure
7 distinct private buckets are deployed with strict access policies: `kairo-docs`, `kairo-media`, `kairo-avatars`, `kairo-vault`, `kairo-client-uploads`, `kairo-backups`, `kairo-temp`. Access is granted purely via short-lived signed URLs.
