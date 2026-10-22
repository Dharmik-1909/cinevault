import { NavLink } from 'react-router-dom';
import { BookmarkIcon, FilmIcon, HeartIcon, HomeIcon, PlusIcon } from './Icons';

const links = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/favorites', label: 'Favorites', icon: HeartIcon },
  { to: '/watch-later', label: 'Watch Later', icon: BookmarkIcon },
  { to: '/add', label: 'Add Movie', icon: PlusIcon },
];

export function Brand() {
  return (
    <NavLink to="/" className="brand" aria-label="CineVault home">
      <span className="brand-mark"><FilmIcon width={18} height={18} /></span>
      CineVault
    </NavLink>
  );
}

/** Sidebar on desktop, bottom bar on mobile (layout handled in CSS). */
export default function Navigation() {
  return (
    <nav className="nav" aria-label="Primary">
      <div className="nav-brand"><Brand /></div>
      <ul>
        {links.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
              <Icon width={20} height={20} />
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <p className="nav-tagline">Your personal cinema</p>
    </nav>
  );
}
