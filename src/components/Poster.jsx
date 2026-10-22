import { useState } from 'react';
import { FilmIcon } from './Icons';

/** Fixed 2:3 poster with a designed placeholder for missing / broken images. */
export default function Poster({ src, title, className = '', lazy = true }) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <div className={`poster ${className}`}>
      {showImage ? (
        <img
          src={src}
          alt={`Poster for ${title}`}
          loading={lazy ? 'lazy' : 'eager'}
          decoding="async"
          onError={() => setFailed(true)}
        />
      ) : (
        <div className="poster-fallback" role="img" aria-label={`No poster available for ${title}`}>
          <FilmIcon width={32} height={32} />
          <span>{title}</span>
        </div>
      )}
    </div>
  );
}
