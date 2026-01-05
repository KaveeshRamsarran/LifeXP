# Life XP 

Life XP is a gamified productivity and habit tracker that turns your real-world tasks into an RPG. Earn XP, level up, gain stats (Intelligence, Strength, Discipline, Wealth), and unlock witty titles.

##  Features

- **RPG Progression**: Earn XP and level up.
- **Stats System**: Tasks are categorized into INT, STR, DIS, WLTH.
- **Habit Streaks**: Forgiving streak system with decay (miss a day, lose a bit, don't reset to 0).
- **Daily Quests**: Randomly generated quests every day.
- **Witty Titles**: Unlock titles like 'Wandering Potato' or 'Productivity Menace'.
- **Full Stack**: Next.js (App Router), Node.js/Express, PostgreSQL, Prisma.

##  Tech Stack

- **Frontend**: Next.js 14, TypeScript, TailwindCSS, Zustand.
- **Backend**: Node.js, Express, TypeScript, Zod.
- **Database**: PostgreSQL, Prisma ORM.
- **DevOps**: Docker, Docker Compose.

##  Quick Start (Docker)

The easiest way to run the entire stack is with Docker Compose.

1.  **Clone the repository**
2.  **Run Docker Compose**
    `ash
    docker-compose up --build
    ` 
3.  **Access the App**
    -   Web: [http://localhost:3000](http://localhost:3000)
    -   API: [http://localhost:3001](http://localhost:3001)

The database will be automatically seeded with a demo user:
-   **Email**: demo@lifexp.app 
-   **Password**: DemoPass123! 

##  Local Development

If you want to run services individually:

### Prerequisites
-   Node.js 20+
-   PostgreSQL

### 1. Setup Environment
Copy .env.example to .env in the root (or set vars manually).

### 2. Install Dependencies
`ash
npm install
` 

### 3. Database Setup
Ensure Postgres is running. Update DATABASE_URL in .env if needed.
`ash
# Run migrations
npm run prisma:migrate --workspace=apps/api

# Seed database
npm run seed --workspace=apps/api
` 

### 4. Run Development Servers
`ash
# Runs both API and Web concurrently
npm run dev
` 

##  Deployment

### Frontend (Vercel)
1.  Push to GitHub.
2.  Import project to Vercel.
3.  Set Root Directory to pps/web.
4.  Add Environment Variable: NEXT_PUBLIC_API_URL (your backend URL).

### Backend (Render/Railway/Fly.io)
1.  **Render**:
    -   Create a Web Service.
    -   Root Directory: pps/api.
    -   Build Command: 
pm install && npm run build.
    -   Start Command: 
pm start.
    -   Add Env Vars: DATABASE_URL, JWT_SECRET, FRONTEND_URL.
2.  **Database**:
    -   Provision a PostgreSQL database on the same provider.
    -   Get the connection string and set as DATABASE_URL.

##  Architecture

-   **Monorepo**: Managed via npm workspaces.
-   **Shared Package**: @life-xp/shared contains Zod schemas and game mechanics (XP formulas) shared between FE and BE.
-   **API**: Express server with layered architecture (Controllers -> Services -> Data Access).
-   **Web**: Next.js App Router with Client Components for interactive UI.

##  Testing

`ash
npm test
` 
Runs Jest tests for the API.

##  Security

-   **Auth**: JWT stored in HttpOnly cookies.
-   **Validation**: Zod schemas for all inputs.
-   **Headers**: Helmet for security headers.
-   **Passwords**: Bcrypt hashing.

---
Built for the 'Life XP' Challenge.
