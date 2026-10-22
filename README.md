CINEVAULT - YOUR PERSONAL CINEMA
================================

A dark, cinematic movie library built with React + Vite. Discover films from
TMDb (https://www.themoviedb.org/), search by title, view details, and keep your
own Favorites and Watch Later lists under your own account. You can also add
custom movies that are not in TMDb.

CineVault does not stream or host movies. Movie data and artwork come from TMDb.

This product uses the TMDB API but is not endorsed or certified by TMDB.


SCREENSHOTS (folder: images/)
-----------------------------
images/image1.png  - Home page (hero, search, discovery shelves)
images/image2.png  - Movie details page (poster, genres, overview, cast, trailer)
images/image3.png  - Favorites page (your saved movies)
images/image4.png  - Sign in page (email and password login)


FEATURES
--------
- Home with hero, Trending, Popular, Top rated and Now playing shelves
- Debounced title search with clear button, no-results state and "Load more"
- Movie details: backdrop, poster, genres, runtime, rating, overview, cast,
  YouTube trailer link
- Email + password sign in, register and sign out (salted password hashes,
  7-day session, 30-second lockout after 5 wrong attempts)
- Favorites and Watch Later saved per account
- Add Movie form with inline validation; custom movies show on Home and in search
- Loading skeletons, error + retry messages, missing-poster placeholders
- Responsive layout: sidebar on desktop, bottom navigation on mobile
- Keyboard focus styles, skip link, labelled controls, reduced-motion support


SETUP
-----
Requires Node.js 18 or newer.

1. Open a terminal in the project folder (the one with package.json).
2. Run:   npm install
3. Create a file named .env.local next to package.json containing ONE line:

       VITE_TMDB_API_KEY=your_key_here

   (or VITE_TMDB_READ_ACCESS_TOKEN=your_token_here if you use the long token)
4. Run:   npm run dev
5. Open the link shown in the terminal (usually http://localhost:5173).

Get TMDb credentials:
  - Sign up:        https://www.themoviedb.org/signup
  - API settings:   https://www.themoviedb.org/settings/api

Never commit .env.local to GitHub (it is already listed in .gitignore).
Any VITE_ variable is visible in the browser, so this setup is for local demos
only. For production, keep the key on a server and proxy TMDb requests.


USING THE APP
-------------
- Browsing and search work without signing in.
- Saving a movie, or opening Favorites, Watch Later or Add Movie, asks you to
  sign in first.
- Create an account at /register, or sign in at /login.
- Sign out from the Profile page.


SCRIPTS
-------
npm run dev       Start the development server
npm run build     Production build into dist/
npm run preview   Preview the production build


PROJECT STRUCTURE
-----------------
images/         README screenshots (image1.png to image4.png)
src/
  api/          tmdbClient.js, movies.js
  components/   AppHeader, Navigation, MovieCard, MovieGrid, SearchBar, Hero,
                Poster, States, Toast, RequireAuth
  hooks/        useAsync.js
  pages/        Home, MovieDetails, Favorites, WatchLater, AddMovie,
                Login (also register), Profile
  state/        MovieLibraryContext.jsx
  styles/       tokens.css, global.css
  utils/        storage.js, auth.js, formatters.js


STORAGE AND SECURITY LIMITS
---------------------------
Accounts, Favorites, Watch Later and custom movies are stored in the browser's
localStorage:
- They belong to this browser and device only and do not sync.
- Anyone with access to the browser can view or edit them, so this is not
  server-grade security.
- Passwords are stored only as salted PBKDF2-SHA-256 hashes, never as plain text.
- Clearing site data removes everything.

Real multi-user accounts need a backend with authentication and a database.


TMDB ATTRIBUTION
----------------
The footer includes TMDb's required notice. Before publishing, check TMDb's
current attribution and logo rules at
https://www.themoviedb.org/about/logos-attribution and add the official TMDb logo.