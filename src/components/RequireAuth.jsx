import { Navigate, useLocation } from 'react-router-dom';
import { useMovieLibrary } from '../state/MovieLibraryContext';

/** Sends signed-out visitors to /login, then back to the page they wanted. */
export default function RequireAuth({ children }) {
  const { profile } = useMovieLibrary();
  const location = useLocation();
  if (!profile) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
