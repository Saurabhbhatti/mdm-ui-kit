import { isBrowser } from './storage.js';

const memoryCache = new Map();
const STORAGE_PREFIX = 'mdm.cache.';

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readPersistedCache(key) {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(`${STORAGE_PREFIX}${key}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writePersistedCache(key, value) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.setItem(`${STORAGE_PREFIX}${key}`, JSON.stringify(value));
  } catch {
    // Ignore cache persistence failures.
  }
}

function clearPersistedCache(key) {
  if (!isBrowser()) {
    return;
  }

  try {
    window.localStorage.removeItem(`${STORAGE_PREFIX}${key}`);
  } catch {
    // Ignore cache persistence failures.
  }
}

export function getCache(key) {
  if (!key) {
    return null;
  }

  if (memoryCache.has(key)) {
    return clone(memoryCache.get(key));
  }

  const persisted = readPersistedCache(key);
  if (persisted !== null) {
    memoryCache.set(key, persisted);
    return clone(persisted);
  }

  return null;
}

export function setCache(key, data, { persist = true } = {}) {
  if (!key) {
    return data;
  }

  const nextValue = clone(data);
  memoryCache.set(key, nextValue);

  if (persist) {
    writePersistedCache(key, nextValue);
  }

  return clone(nextValue);
}

export function clearCache(key) {
  if (!key) {
    return;
  }

  memoryCache.delete(key);
  clearPersistedCache(key);
}

export function clearAllCache() {
  memoryCache.clear();

  if (!isBrowser()) {
    return;
  }

  try {
    const keys = Object.keys(window.localStorage);
    keys.forEach((storageKey) => {
      if (storageKey.startsWith(STORAGE_PREFIX)) {
        window.localStorage.removeItem(storageKey);
      }
    });
  } catch {
    // Ignore cache clearing failures.
  }
}
