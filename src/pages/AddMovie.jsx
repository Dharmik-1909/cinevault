import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMovieLibrary } from '../state/MovieLibraryContext';
import { isHttpUrl } from '../utils/formatters';

const EMPTY = { title: '', year: '', description: '', posterUrl: '', genre: '', rating: '' };
const MAX_YEAR = new Date().getFullYear() + 5;

function validate(v) {
  const e = {};
  if (!v.title.trim()) e.title = 'Enter a title.';
  else if (v.title.trim().length > 150) e.title = 'Use 150 characters or fewer.';
  if (v.year !== '') {
    const y = Number(v.year);
    if (!Number.isInteger(y) || y < 1888 || y > MAX_YEAR) e.year = `Enter a year between 1888 and ${MAX_YEAR}.`;
  }
  if (v.description.length > 1000) e.description = 'Use 1,000 characters or fewer.';
  if (v.posterUrl.trim() && !isHttpUrl(v.posterUrl.trim())) e.posterUrl = 'Enter a full link starting with http:// or https://';
  if (v.genre.length > 40) e.genre = 'Use 40 characters or fewer.';
  if (v.rating !== '') {
    const r = Number(v.rating);
    if (!Number.isFinite(r) || r < 0 || r > 10) e.rating = 'Enter a rating from 0 to 10.';
  }
  return e;
}

function Field({ id, label, required, error, hint, children }) {
  return (
    <div className={`field ${error ? 'has-error' : ''}`}>
      <label htmlFor={id}>
        {label} {required ? <span className="req">(required)</span> : <span className="opt">(optional)</span>}
      </label>
      {children}
      {hint && !error && <p className="hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default function AddMovie() {
  const { addCustomMovie } = useMovieLibrary();
  const navigate = useNavigate();
  const [values, setValues] = useState(EMPTY);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const errors = validate(values);
  const shown = (name) => (submitted || touched[name] ? errors[name] : undefined);
  const set = (name) => (e) => setValues((v) => ({ ...v, [name]: e.target.value }));
  const blur = (name) => () => setTouched((t) => ({ ...t, [name]: true }));
  const props = (name, hint) => ({
    id: name,
    value: values[name],
    onChange: set(name),
    onBlur: blur(name),
    'aria-invalid': Boolean(shown(name)),
    'aria-describedby': shown(name) ? `${name}-error` : hint ? `${name}-hint` : undefined,
  });

  const onSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    if (Object.keys(errors).length > 0) {
      const first = Object.keys(errors)[0];
      document.getElementById(first)?.focus();
      return;
    }
    const entry = addCustomMovie(values);
    navigate(`/movie/${entry.id}`);
  };

  return (
    <section className="form-page">
      <h1 className="page-title">Add a movie</h1>
      <p className="muted">
        Keep a title that isn’t in the TMDb catalogue. Custom movies are saved in this browser only.
      </p>

      <form onSubmit={onSubmit} noValidate className="form">
        <Field id="title" label="Title" required error={shown('title')}>
          <input type="text" maxLength={200} autoComplete="off" {...props('title')} />
        </Field>

        <div className="field-row">
          <Field id="year" label="Release year" error={shown('year')}>
            <input type="number" inputMode="numeric" placeholder="e.g. 1999" {...props('year')} />
          </Field>
          <Field id="rating" label="Rating (0–10)" error={shown('rating')}>
            <input type="number" inputMode="decimal" step="0.1" min="0" max="10" {...props('rating')} />
          </Field>
        </div>

        <Field id="genre" label="Genre" error={shown('genre')}>
          <input type="text" placeholder="e.g. Science fiction" {...props('genre')} />
        </Field>

        <Field id="posterUrl" label="Poster link" error={shown('posterUrl')} hint="Link to an image. If it can’t load, a placeholder is shown.">
          <input type="url" placeholder="https://" {...props('posterUrl', true)} />
        </Field>

        <Field id="description" label="Description" error={shown('description')}>
          <textarea rows={5} {...props('description')} />
        </Field>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">Save movie</button>
          <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
        </div>
      </form>
    </section>
  );
}
