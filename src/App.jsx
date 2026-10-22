import { Route, Routes } from 'react-router-dom';
import AppHeader from './components/AppHeader';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import { EmptyState } from './components/States';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import WatchLater from './pages/WatchLater';
import AddMovie from './pages/AddMovie';
import Login from './pages/Login';
import Profile from './pages/Profile';
import RequireAuth from './components/RequireAuth';

export default function App() {
  return (
    <div className="shell">
      <a href="#main" className="skip-link">Skip to content</a>
      <Navigation />
      <div className="content">
        <AppHeader />
        <main id="main" tabIndex={-1}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetails />} />
            <Route path="/favorites" element={<RequireAuth><Favorites /></RequireAuth>} />
            <Route path="/watch-later" element={<RequireAuth><WatchLater /></RequireAuth>} />
            <Route path="/add" element={<RequireAuth><AddMovie /></RequireAuth>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Login mode="register" />} />
            <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
            <Route path="*" element={<EmptyState title="Page not found" text="That page doesn’t exist." actionLabel="Go home" />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </div>
  );
}
