import { isBrowser } from '../utils/storage.js';
import { STORAGE_KEY } from '../config/constants.js';

function readRawBundle() {
  if (!isBrowser()) {
    return null;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeRawBundle(bundle) {
  if (!isBrowser()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
}

export const localStorageAdapter = {
  get() {
    return readRawBundle();
  },
  set(bundle) {
    writeRawBundle(bundle);
    return bundle;
  },
  update(type, id, nextValues) {
    const bundle = readRawBundle() || {};
    const records = Array.isArray(bundle[type]) ? bundle[type] : [];
    bundle[type] = records.map((record) => (record.id === id ? { ...record, ...nextValues } : record));
    writeRawBundle(bundle);
    return bundle[type];
  },
  delete(type, id) {
    const bundle = readRawBundle() || {};
    const records = Array.isArray(bundle[type]) ? bundle[type] : [];
    bundle[type] = records.filter((record) => record.id !== id);
    writeRawBundle(bundle);
    return bundle[type];
  }
};

export function createMemoryStorageAdapter(initialBundle = {}) {
  let state = initialBundle;

  return {
    get() {
      return state;
    },
    set(bundle) {
      state = bundle;
      return state;
    },
    update(type, id, nextValues) {
      const records = Array.isArray(state[type]) ? state[type] : [];
      state = {
        ...state,
        [type]: records.map((record) => (record.id === id ? { ...record, ...nextValues } : record))
      };
      return state[type];
    },
    delete(type, id) {
      const records = Array.isArray(state[type]) ? state[type] : [];
      state = {
        ...state,
        [type]: records.filter((record) => record.id !== id)
      };
      return state[type];
    }
  };
}
