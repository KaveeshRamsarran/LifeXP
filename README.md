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

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/lifexp.git
git push -u origin main
```

### Step 2: Deploy Backend (Railway - Recommended)

1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your LifeXP repository
4. Click **"Add Service"** → **"Database"** → **"PostgreSQL"**
5. Click on your main service, go to **Settings**:
   - Set **Root Directory**: `apps/api`
   - Set **Build Command**: `npm install && npx prisma generate && npm run build`
   - Set **Start Command**: `npm run start`
6. Go to **Variables** tab and add:
   - `DATABASE_URL`: Click on PostgreSQL service → Variables → Copy `DATABASE_URL`
   - `JWT_SECRET`: Generate a random string (e.g., `openssl rand -base64 32`)
   - `FRONTEND_URL`: `https://your-app.vercel.app` (add after Vercel deploy)
   - `NODE_ENV`: `production`
7. Go to **Settings** → **Networking** → **Generate Domain**
8. Copy your Railway URL (e.g., `https://lifexp-api.up.railway.app`)

**Run Database Migration:**
- In Railway, go to your service → **Settings** → **Deploy** → Add deploy command:
  ```bash
  npx prisma migrate deploy && npm run seed
  ```

### Step 3: Deploy Frontend (Vercel)

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New"** → **"Project"**
3. Import your LifeXP repository
4. Configure the project:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js (auto-detected)
5. Add **Environment Variable**:
   - `NEXT_PUBLIC_API_URL`: `https://your-railway-url.up.railway.app/api/v1`
6. Click **Deploy**

### Step 4: Update CORS

After both are deployed, update Railway's `FRONTEND_URL` variable with your Vercel URL.

### Alternative: Render

**Backend:**
1. Create a Web Service on [render.com](https://render.com)
2. Set Root Directory: `apps/api`
3. Build Command: `npm install && npx prisma generate && npm run build`
4. Start Command: `npm start`
5. Add Env Vars: `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`, `NODE_ENV=production`

**Database:**
- Create a PostgreSQL database on Render
- Copy the connection string to `DATABASE_URL`

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
