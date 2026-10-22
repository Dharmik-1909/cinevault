// Browser-only account system.
//
// HONEST LIMITS: there is no server. Accounts live in this browser's localStorage,
// so anyone with access to this browser/device can read or edit them. Passwords are
// never stored in plain text (salted PBKDF2-SHA-256 hashes only), but this is NOT a
// replacement for real server-side authentication.

import { load, remove, save } from './storage';

const USERS_KEY = 'cinevault.users';
const SESSION_KEY = 'cinevault.session';
const ATTEMPTS_KEY = 'cinevault.loginAttempts';
const ITERATIONS = 100000;
const SESSION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const MAX_ATTEMPTS = 5;
const LOCK_MS = 30 * 1000;

// Pre-created account. Only a salted hash is stored here, never the password itself.
const SEED_USERS = [
  {
    id: 'u-seed-mahi',
    email: 'mahidesai2102@gmail.com',
    displayName: 'Mahi',
    salt: 'SM8sla+zmDnof5plj3MNrQ==',
    hash: 'JoH6apds8Gr1mQoy+ZyhmBmpDjANdcMQyqW9i+3YWWU=',
    iterations: ITERATIONS,
    createdAt: '2026-10-22T00:00:00.000Z',
  },
];

const toB64 = (bytes) => btoa(String.fromCharCode(...new Uint8Array(bytes)));
const fromB64 = (b64) => Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

async function hashPassword(password, saltB64, iterations) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', salt: fromB64(saltB64), iterations, hash: 'SHA-256' },
    key,
    256
  );
  return toB64(bits);
}

function safeEqual(a, b) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const normEmail = (email) => String(email || '').trim().toLowerCase();
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);

function getUsers() {
  return load(USERS_KEY, [], (v) => Array.isArray(v) && v.every((u) => u && u.email && u.hash && u.salt));
}

function ensureSeedUsers() {
  const users = getUsers();
  let changed = false;
  SEED_USERS.forEach((seed) => {
    if (!users.some((u) => u.email === seed.email)) {
      users.push(seed);
      changed = true;
    }
  });
  if (changed) save(USERS_KEY, users);
  return users;
}

const publicUser = (u) => ({ id: u.id, email: u.email, displayName: u.displayName });

function startSession(user) {
  save(SESSION_KEY, { userId: user.id, expiresAt: Date.now() + SESSION_MS });
}

/** Synchronous: who is signed in right now (null if nobody / expired). */
export function getSessionUser() {
  const s = load(SESSION_KEY, null, (v) => v && typeof v.userId === 'string' && typeof v.expiresAt === 'number');
  if (!s) return null;
  if (s.expiresAt < Date.now()) {
    remove(SESSION_KEY);
    return null;
  }
  const user = getUsers().find((u) => u.id === s.userId);
  return user ? publicUser(user) : null;
}

function lockRemainingMs() {
  const a = load(ATTEMPTS_KEY, { count: 0, until: 0 });
  return Math.max(0, (a.until || 0) - Date.now());
}

function recordFailure() {
  const a = load(ATTEMPTS_KEY, { count: 0, until: 0 });
  const count = (a.count || 0) + 1;
  save(ATTEMPTS_KEY, count >= MAX_ATTEMPTS ? { count: 0, until: Date.now() + LOCK_MS } : { count, until: 0 });
}

export async function loginUser(emailInput, password) {
  const email = normEmail(emailInput);
  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email address.' };
  if (!password) return { ok: false, error: 'Enter your password.' };

  const wait = lockRemainingMs();
  if (wait > 0) return { ok: false, error: `Too many attempts. Try again in ${Math.ceil(wait / 1000)} seconds.` };

  const user = ensureSeedUsers().find((u) => u.email === email);
  const attempt = await hashPassword(password, user ? user.salt : SEED_USERS[0].salt, user ? user.iterations : ITERATIONS);

  if (!user || !safeEqual(attempt, user.hash)) {
    recordFailure();
    return { ok: false, error: 'Incorrect email or password.' };
  }
  remove(ATTEMPTS_KEY);
  startSession(user);
  return { ok: true, user: publicUser(user) };
}

export async function registerUser({ displayName, email: emailInput, password }) {
  const email = normEmail(emailInput);
  const name = String(displayName || '').trim();
  if (!name) return { ok: false, error: 'Enter your name.' };
  if (!isEmail(email)) return { ok: false, error: 'Enter a valid email address.' };
  if (!password || password.length < 6) return { ok: false, error: 'Use a password with at least 6 characters.' };

  const users = ensureSeedUsers();
  if (users.some((u) => u.email === email)) return { ok: false, error: 'An account with this email already exists. Sign in instead.' };

  const salt = toB64(crypto.getRandomValues(new Uint8Array(16)));
  const user = {
    id: `u-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`,
    email,
    displayName: name.slice(0, 40),
    salt,
    hash: await hashPassword(password, salt, ITERATIONS),
    iterations: ITERATIONS,
    createdAt: new Date().toISOString(),
  };
  save(USERS_KEY, [...users, user]);
  startSession(user);
  return { ok: true, user: publicUser(user) };
}

export function logoutUser() {
  remove(SESSION_KEY);
}
