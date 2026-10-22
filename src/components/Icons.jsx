const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: 'false',
};

export const HomeIcon = (p) => (
  <svg {...base} {...p}><path d="M3 11.5 12 4l9 7.5" /><path d="M5 10v10h14V10" /></svg>
);
export const HeartIcon = ({ filled, ...p }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}>
    <path d="M12 20s-7-4.4-9-9.2C1.7 7.6 3.6 5 6.5 5c1.9 0 3.4 1 4.2 2.4h.6C12.1 6 13.6 5 15.5 5 18.4 5 20.3 7.6 21 10.8 19 15.600 12 20 12 20Z" />
  </svg>
);
export const BookmarkIcon = ({ filled, ...p }) => (
  <svg {...base} {...p} fill={filled ? 'currentColor' : 'none'}><path d="M6 3h12v18l-6-4-6 4Z" /></svg>
);
export const PlusIcon = (p) => (
  <svg {...base} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const SearchIcon = (p) => (
  <svg {...base} {...p}><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
);
export const CloseIcon = (p) => (
  <svg {...base} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const StarIcon = (p) => (
  <svg {...base} width={14} height={14} {...p} fill="currentColor" stroke="none">
    <path d="m12 2.5 2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.300 6.100 20.500l1.200-6.500L2.500 9.400l6.600-.9Z" />
  </svg>
);
export const FilmIcon = (p) => (
  <svg {...base} {...p}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4" />
  </svg>
);
export const UserIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="8" r="4" /><path d="M4 21c1-4 4.500-6 8-6s7 2 8 6" /></svg>
);
export const PlayIcon = (p) => (
  <svg {...base} {...p} fill="currentColor" stroke="none"><path d="M8 5v14l11-7Z" /></svg>
);
export const AlertIcon = (p) => (
  <svg {...base} width={28} height={28} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7.500v5M12 16.500v.01" /></svg>
);
