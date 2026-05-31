# 🎬 WatchVault


MONGO credentials : 

virajm1714_db_user
KxHcn19a2qnndm3P

A polished personal media tracking application for anime, movies, and TV series. Built with React, TypeScript, Node.js, Express, and MongoDB Atlas.

![WatchVault](https://img.shields.io/badge/WatchVault-Personal%20Media%20Tracker-6c63ff)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue)
![React](https://img.shields.io/badge/React-18.3-61dafb)
![Node.js](https://img.shields.io/badge/Node.js-20%2B-green)

---

## ✨ Features

- **Dashboard** — Stats overview, recently added/watched entries
- **Search** — Search anime (Jikan/MAL), movies & TV (TMDB) with infinite scroll
- **Watchlist** — Grid view with filtering, sorting, search within list
- **Statistics** — Charts for type/status distribution, rating histogram
- **Detail Modal** — View full info + edit personal data inline
- **Import/Export** — JSON backup and restore with duplicate prevention
- **Dark theme** — Sleek purple-accent dark UI throughout

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, TypeScript, Tailwind CSS, TanStack Query, React Router |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB Atlas + Mongoose |
| Anime API | Jikan (MyAnimeList) — free, no key needed |
| Movie/TV API | TMDB — free API key required |

---

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** v18+ ([nodejs.org](https://nodejs.org))
- **MongoDB Atlas** account ([mongodb.com/atlas](https://www.mongodb.com/atlas))
- **TMDB API key** ([themoviedb.org/settings/api](https://www.themoviedb.org/settings/api))

---

### Step 1 — MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free account
2. Create a new **free cluster** (M0 tier)
3. In **Database Access**, create a user with read/write permissions
4. In **Network Access**, add `0.0.0.0/0` (allow from anywhere) or your IP
5. Click **Connect** → **Connect your application** → copy the connection string
6. Replace `<password>` in the connection string with your database user's password

Your URI will look like:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/watchvault?retryWrites=true&w=majority
```

---

### Step 2 — TMDB API Key

1. Create a free account at [themoviedb.org](https://www.themoviedb.org)
2. Go to **Settings → API → Create → Developer**
3. Fill the form and copy your **API Key (v3 auth)**

---

### Step 3 — Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env`:
```env
PORT=3001
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/watchvault?retryWrites=true&w=majority
TMDB_API_KEY=your_tmdb_api_key_here
NODE_ENV=development
```

```bash
# Start the backend dev server
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 WatchVault API running on http://localhost:3001
```

---

### Step 4 — Frontend Setup

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

Edit `.env`:
```env
VITE_TMDB_API_KEY=your_tmdb_api_key_here
```

```bash
# Start the frontend dev server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
watchvault/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── watchlistController.ts    # Request handlers
│   │   ├── models/
│   │   │   └── WatchlistEntry.ts         # Mongoose schema
│   │   ├── routes/
│   │   │   └── watchlist.ts              # Express routes
│   │   ├── services/
│   │   │   └── watchlistService.ts       # Business logic
│   │   └── index.ts                      # App entry point
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── cards/
    │   │   │   ├── WatchlistCard.tsx     # Card for saved entries
    │   │   │   └── SearchCard.tsx        # Card for search results
    │   │   ├── layout/
    │   │   │   └── Layout.tsx            # Sidebar + navigation
    │   │   ├── modals/
    │   │   │   ├── AddToWatchlistModal.tsx
    │   │   │   └── DetailModal.tsx
    │   │   └── ui/
    │   │       └── index.tsx             # Reusable UI components
    │   ├── hooks/
    │   │   └── index.ts                  # React Query hooks
    │   ├── pages/
    │   │   ├── Dashboard.tsx
    │   │   ├── Watchlist.tsx
    │   │   ├── Search.tsx
    │   │   └── Statistics.tsx
    │   ├── services/
    │   │   └── api.ts                    # API layer (backend + external)
    │   ├── types/
    │   │   └── index.ts                  # TypeScript types
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── .env.example
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## 🔌 Backend API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/watchlist` | Get all entries (with filters/sort/pagination) |
| GET | `/api/watchlist/stats` | Get statistics |
| GET | `/api/watchlist/export` | Export as JSON download |
| POST | `/api/watchlist/import` | Import from JSON |
| GET | `/api/watchlist/by-external` | Find by externalId + type |
| GET | `/api/watchlist/:id` | Get single entry |
| POST | `/api/watchlist` | Create entry |
| PUT | `/api/watchlist/:id` | Update entry |
| DELETE | `/api/watchlist/:id` | Delete entry |

### Query Parameters for GET /api/watchlist

| Param | Type | Description |
|-------|------|-------------|
| `search` | string | Filter by title |
| `type` | `anime\|movie\|series` | Filter by type |
| `status` | `watching\|completed\|dropped\|plan_to_watch` | Filter by status |
| `favorite` | `true\|false` | Filter favorites |
| `sortBy` | `createdAt\|watchedAt\|personalRating\|title` | Sort field |
| `sortOrder` | `asc\|desc` | Sort direction |
| `page` | number | Page number (default: 1) |
| `limit` | number | Results per page (default: 50) |

---

## 📦 MongoDB Schema

```json
{
  "_id": "ObjectId (auto)",
  "externalId": "12345",
  "type": "anime | movie | series",
  "title": "Attack on Titan",
  "imageUrl": "https://...",
  "year": 2013,
  "status": "completed | watching | dropped | plan_to_watch",
  "personalRating": 9,
  "notes": "One of my favorites",
  "favorite": true,
  "watchedAt": "2026-05-01T00:00:00.000Z",
  "createdAt": "auto",
  "updatedAt": "auto"
}
```

**Unique constraint:** `externalId + type` combination prevents duplicates.

---

## 🎨 Design Decisions

- **No authentication** — Single-user local app, keeps it simple
- **No permanent metadata storage** — External API data is fetched fresh; only personal data lives in MongoDB
- **Debounced search** — 400ms debounce prevents API flooding
- **Infinite scroll** — Smooth pagination for search results
- **Lean responses** — MongoDB `.lean()` for faster reads
- **Compound index** — Ensures no duplicate entries across types

---

## 🔧 Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` in `backend/.env`
- Ensure your IP is whitelisted in Atlas → Network Access
- Verify your Atlas user credentials

### "TMDB images not loading"
- Check `VITE_TMDB_API_KEY` in `frontend/.env`
- Ensure the key has v3 API access enabled

### "Jikan rate limit errors"
- Jikan has a 3 req/sec rate limit; this is usually fine with debouncing
- If hit, wait a few seconds and retry

### CORS errors
- Ensure backend is running on port 3001
- Frontend proxies `/api` to backend via Vite config

---

## 📝 License

Personal use. No license restrictions.
