import Collection from './Collection';
import { useMovieLibrary } from '../state/MovieLibraryContext';

export default function Favorites() {
  const { favorites } = useMovieLibrary();
  return (
    <Collection
      title="Favorites"
      movies={favorites}
      emptyTitle="No favorites yet"
      emptyText="Tap the heart on any movie to keep it here."
    />
  );
}
