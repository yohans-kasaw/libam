# Libam Project - Agent Guidelines

This document provides essential information for autonomous agents working on the Libam repository. Adhere to these standards to ensure consistency and quality.

## Project Overview
Libam is a full-stack application consisting of a React frontend and a Go backend.
- **Root Directory**: `/home/yohansh/projects/libam`
- **Frontend**: `./web`
- **Backend**: `./backend`

---

## 1. Commands

### Web (Frontend)
Run these commands from the `./web` directory.
- **Build**: `bun run build` (runs `tsc -b && vite build`)
- **Lint**: `bun run lint` (runs `eslint .`)
- **Dev**: `bun run dev`
- **Test**: No test framework currently configured. Use `npm run build` to verify types.

## 2. Code Style & Guidelines

### Web (TypeScript / React)
- **Framework**: React 19, Vite, TanStack Router, TanStack Query.
- **Styling**: Tailwind CSS 4, shadcn
- **State Management**: Zustand (Global), React State (Local).
- **API Client**: Ky (configured in `src/api/client.tsx`).

#### Guidelines:
- **Components**: Functional components only. Use `export const ComponentName = () => { ... }`.
- **Props**: Define props using `interface`. Use descriptive names.
- **Naming**: 
  - Components/Files: PascalCase (e.g., `DiscoveryCard.tsx`).
  - Hooks: `use` prefix (e.g., `useAuthStore.ts`).
  - Variables/Functions: camelCase.
  - if variable is staring fetched value from api, have the name of the variable exactly like the api response field name
- **Types**: Prefer `interface` over `type` for objects. Export types from `src/types/` if reused.
- **Animations**: Use `motion/react` (Framer Motion).


---
## 3. Directory Structure

### Web
- `src/api/`: API client and endpoint definitions.
- `src/components/`: Reusable UI components. `ui/` contains Radix/Tailwind primitives.
- `src/routes/`: TanStack Router file-based routes.
- `src/store/`: Zustand stores.
- `src/hooks/`: Custom React hooks.
- `src/types/`: TypeScript definitions.

--

## 4. State Management & Data Fetching (Web)
- **Zustand**: Used for auth (`authStore.ts`) and theme (`themeStore.ts`). Use `persist` middleware for data that should survive reloads.
- **TanStack Query**: Use for all server-side data fetching and mutations. 
- **Ky**: Use the pre-configured `api` client from `@/api/client` which handles base URL and auth headers.

## 5. Routing (Web)
- Uses **TanStack Router**. 
- Route files are located in `src/routes/`. 
- Use `createFileRoute` for defining routes.
- Use `Link` from `@tanstack/react-router` for navigation.

## 6. CSS & Styling
- Pure **Tailwind CSS 4**. 

---

## 7. Development Workflow
1. Analyze existing patterns in the specific subdirectory before starting.
2. For Web: Ensure `bun run build` passes to verify TypeScript safety.
4. Always update documentation if architectural changes are made.
