import { STORAGE_KEY } from '../config/constants.js';

export function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

export function readJSON(key, fallback = null) {
  if (!isBrowser()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function writeJSON(key, value) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.removeItem(key);
}

export function readStorageBundle(fallback = {}) {
  return readJSON(STORAGE_KEY, fallback);
}

export function writeStorageBundle(bundle) {
  writeJSON(STORAGE_KEY, bundle);
}
