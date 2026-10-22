import Collection from './Collection';
import { useMovieLibrary } from '../state/MovieLibraryContext';

export default function WatchLater() {
  const { watchLater } = useMovieLibrary();
  return (
    <Collection
      title="Watch Later"
      movies={watchLater}
      emptyTitle="Nothing queued"
      emptyText="Tap the bookmark on any movie to save it for later."
    />
  );
}
