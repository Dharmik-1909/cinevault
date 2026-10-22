// Central persistence layer. All localStorage access in the app goes through here.
// localStorage is browser-specific, user-editable, and NOT secure or synced.
// If storage is unavailable (private mode, quota), we fall back to memory.

const memory = new Map();

function getStore() {
  try {
    const probe = '__cinevault_probe__';
    window.localStorage.setItem(probe, '1');
    window.localStorage.removeItem(probe);
    return window.localStorage;
  } catch {
    return null;
  }
}

// Each signed-in account gets its own lists, e.g. cinevault.u.<userId>.favorites
export const userKey = (userId, name) => `cinevault.u.${userId}.${name}`;

/** Read JSON; return `fallback` when missing, corrupted, or rejected by `validate`. */
export function load(key, fallback, validate = () => true) {
  try {
    const store = getStore();
    const raw = store ? store.getItem(key) : memory.get(key);
    if (raw == null) return fallback;
    const parsed = JSON.parse(raw);
    return validate(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, value) {
  try {
    const raw = JSON.stringify(value);
    const store = getStore();
    if (store) store.setItem(key, raw);
    else memory.set(key, raw);
    return true;
  } catch {
    return false;
  }
}

export function remove(key) {
  try {
    const store = getStore();
    if (store) store.removeItem(key);
    memory.delete(key);
  } catch {
    /* ignore */
  }
}

/** Keep only well-formed list items and drop duplicates by id. */
export function sanitizeList(value) {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value.filter((item) => {
    if (!item || typeof item !== 'object') return false;
    const ok =
      (typeof item.id === 'number' || typeof item.id === 'string') &&
      typeof item.title === 'string' &&
      item.title.trim() !== '';
    if (!ok) return false;
    const key = String(item.id);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
