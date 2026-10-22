# CineVault — Your Personal Cinema

A dark, cinematic movie library built with **React + Vite**. Discover films from the
[TMDb](https://www.themoviedb.org/) catalogue, search by title, view details, and keep your own
**Favorites** and **Watch Later** lists. You can also add custom movies that aren't in TMDb.

CineVault does not stream or host movies. Movie data and artwork come from TMDb.

> This product uses the TMDB API but is not endorsed or certified by TMDB.

## Features

- Home with hero, **Trending**, **Popular**, **Top rated** and **Now playing** shelves
- Debounced title search with clear button, no-results state and "Load more"
- Movie details: backdrop, poster, genres, runtime, rating, overview, cast, trailer link (YouTube)
- Favorites and Watch Later (add/remove from cards, hero and detail page; persisted)
- Add Movie form with inline validation; custom entries show on Home and in search
- Loading skeletons, error + retry, rate-limit/network messages, missing-artwork placeholders
- Responsive layout: sidebar on desktop, bottom navigation on mobile
- Keyboard focus styles, skip link, semantic headings, labelled controls, reduced-motion support

## Setup

Requires Node.js 18+.

```bash
npm install
cp .env.example .env.local     # then add your token (see below)
npm run dev
```

### Get TMDb credentials

1. Create an account: https://www.themoviedb.org/signup
2. Request API access: https://www.themoviedb.org/settings/api
3. Copy your **API Key** (32 characters) or the **API Read Access Token**.
4. Put one of them in `.env.local`:

```
VITE_TMDB_API_KEY=your_key_here
# or: VITE_TMDB_READ_ACCESS_TOKEN=your_token_here
```

5. Restart `npm run dev`.

**Never commit `.env.local`** (it is in `.gitignore`).

> ⚠️ Any `VITE_` variable is bundled into the browser code and visible to users. That is acceptable only
> for a local learning demo. For a production app, keep the token server-side and proxy TMDb requests
> through a backend or serverless function.

Without a token the app still runs: Home shows setup instructions, and Add Movie, Favorites,
Watch Later and Profile all work.

## Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build |

## Project structure

```
src/
  api/          tmdbClient.js (base URL, auth, errors), movies.js (endpoints)
  components/   AppHeader, Navigation, MovieCard, MovieGrid, SearchBar, Hero, Poster, States, Toast …
  hooks/        useAsync.js
  pages/        Home, MovieDetails, Favorites, WatchLater, AddMovie, Login, Profile, Collection
  state/        MovieLibraryContext.jsx (collections, custom movies, profile)
  styles/       tokens.css (design tokens), global.css
  utils/        storage.js (all localStorage access), formatters.js
```

Notes on the API layer: movie details, credits and videos are fetched in a single request using
TMDb's `append_to_response=credits,videos`, which is equivalent to the three separate endpoints.

## Local storage limitations

Favorites, Watch Later, custom movies and the demo profile are stored in your browser's
`localStorage`:

- They are specific to this browser and device and do **not** sync.
- Users can view and edit them; they are **not secure**.
- Clearing site data removes them. Malformed data is ignored safely.

The **Sign in** screen is a **demo only**: it saves a display name locally. There are no passwords and no
real accounts. Real multi-user accounts would need a backend with authentication and a database.

## TMDb attribution

The footer includes TMDb's required notice. Before publishing, re-check TMDb's current attribution
and logo rules (https://www.themoviedb.org/about/logos-attribution) and add the official TMDb logo
next to the notice.

## Fitting this into the existing repository

This is a self-contained project. To use it with
[Alpesh-2007/MovieLibraryApp](https://github.com/Alpesh-2007/MovieLibraryApp), copy `src/`, `index.html`,
`.env.example` and `.gitignore` over your project (or merge component by component), and make sure
`react-router-dom` is installed.
