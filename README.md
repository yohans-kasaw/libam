# Libam

Libam is a modern, full-stack social discovery and dating application designed to help users connect through an intuitive and engaging interface. It combines a high-performance Go backend with a reactive, smooth frontend to deliver a seamless user experience.

## Project Idea

Libam aims to simplify social connection. The application features a "Discovery Feed" where users can browse potential matches through a swiping interface, and a "Matches" section to view and interact with successful connections. 

Key features planned or implemented include:
- **User Authentication:** Secure signup and login flow.
- **Discovery Mode:** Swipe-based interface to find new people.
- **Matching System:** Mutual likes create matches.
- **Rich Profiles:** Users can showcase themselves with photos and bios.

## Tech Stack

### Frontend (`./web`)
Built for performance and developer experience using the latest React ecosystem tools.
- **Framework:** [React 19](https://react.dev/) with [Vite](https://vitejs.dev/)
- **Routing:** [TanStack Router](https://tanstack.com/router) (File-based routing)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) (Global state) & [TanStack Query](https://tanstack.com/query) (Server state)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/) primitives
- **HTTP Client:** [Ky](https://github.com/sindresorhus/ky)

### Backend (`./backend`)
A robust and scalable REST API service.
- **Language:** [Go](https://go.dev/) (1.25+)
- **Framework:** [Gin](https://github.com/gin-gonic/gin)
- **Database:** PostgreSQL with [GORM](https://gorm.io/)
- **Authentication:** JWT (JSON Web Tokens)
- **Migrations:** [Goose](https://github.com/pressly/goose)
- **Logging:** [Tint](https://github.com/lmittmann/tint)

## How to Run

### Prerequisites
- [Go](https://go.dev/dl/) 1.25+
- [Bun](https://bun.sh/) (for frontend package management)
- [PostgreSQL](https://www.postgresql.org/) database

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Copy the example environment file and configure your database credentials:
   ```bash
   cp .env.example .env
   ```
3. Run database migrations:
   ```bash
   go run main.go migrate
   ```
4. Start the server:
   ```bash
   go run main.go
   ```
   The API will be available at `http://localhost:8080` (or the port specified in `.env`).

### 2. Frontend Setup
1. Navigate to the web directory:
   ```bash
   cd web
   ```
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```
   The application will be accessible at `http://localhost:5173`.

## Roadmap

The project is currently in active development. Below is the ideal roadmap for upcoming features and improvements.

- [x] **Core Infrastructure**
    - [x] Project setup (Monorepo structure)
    - [x] Database connection & ORM setup
    - [x] Authentication (Signup/Login/JWT)

- [ ] **User Profile Management**
    - [ ] Backend: Profile CRUD endpoints (Bio, Photos, Interests)
    - [ ] Frontend: Profile editing page & Photo upload

- [ ] **Discovery Engine**
    - [ ] Backend: Algorithm to serve relevant user profiles (excluding already seen/matched)
    - [ ] Frontend: Connect `DiscoveryFeed` to real API data
    - [ ] Frontend: Implement Swipe Left/Right actions with API integration

- [ ] **Matching & Interactions**
    - [ ] Backend: Logic for "Likes" and creating "Matches"
    - [ ] Frontend: Real-time "It's a Match" notifications
    - [ ] Frontend: Functional `Matches` list (replace mock data)

- [ ] **Messaging**
    - [ ] Backend: WebSocket implementation for real-time chat
    - [ ] Frontend: Chat interface for matched users

- [ ] **DevOps & Polish**
    - [ ] Docker Compose setup for easy local development
    - [ ] CI/CD Pipelines
    - [ ] Comprehensive Unit & Integration Tests
