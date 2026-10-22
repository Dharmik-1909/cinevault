import MovieGrid from '../components/MovieGrid';
import { EmptyState } from '../components/States';

export default function Collection({ title, movies, emptyTitle, emptyText }) {
  return (
    <section className="shelf">
      <h1 className="page-title">
        {title} <span className="count">{movies.length}</span>
      </h1>
      {movies.length === 0 ? (
        <EmptyState title={emptyTitle} text={emptyText} />
      ) : (
        <MovieGrid movies={movies} label={title} />
      )}
    </section>
  );
}
