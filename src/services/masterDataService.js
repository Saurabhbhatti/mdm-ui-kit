import { getModuleConfig, getModuleTypes } from '../registry/moduleRegistry.js';
import { getStorageAdapter } from '../providers/masterRuntime.js';
import { moduleSeeds } from '../configs/moduleSeeds.js';

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `mdm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function normalizeRecord(record = {}) {
  const now = new Date().toISOString();
  return {
    id: record.id || createId(),
    createdAt: record.createdAt || now,
    updatedAt: record.updatedAt || record.createdAt || now,
    ...record
  };
}

export function getEmptyBundle() {
  return getModuleTypes().reduce((accumulator, type) => {
    accumulator[type] = [];
    return accumulator;
  }, {});
}

export function normalizeBundle(bundle = {}) {
  return getModuleTypes().reduce((accumulator, type) => {
    const records = Array.isArray(bundle[type]) ? bundle[type] : [];
    accumulator[type] = records.map((record) => normalizeRecord(record));
    return accumulator;
  }, {});
}

export function getDefaultBundle() {
  return normalizeBundle(moduleSeeds);
}

export function getStoredBundle() {
  const adapter = getStorageAdapter();
  const bundle = adapter.get?.();
  return normalizeBundle(bundle ?? moduleSeeds);
}

export function saveStoredBundle(bundle) {
  const normalized = normalizeBundle(bundle);
  const adapter = getStorageAdapter();
  adapter.set?.(normalized);
  return normalized;
}

export function getEntityRecords(type) {
  const bundle = getStoredBundle();
  return clone(bundle[type] || []);
}

export function saveEntityRecords(type, records) {
  const bundle = getStoredBundle();
  bundle[type] = clone(records);
  return saveStoredBundle(bundle);
}

export function createEntityRecord(type, values) {
  const bundle = getStoredBundle();
  const record = normalizeRecord(values);
  bundle[type] = [...(bundle[type] || []), record];
  saveStoredBundle(bundle);
  return bundle[type];
}

export function updateEntityRecord(type, id, values) {
  const bundle = getStoredBundle();
  const now = new Date().toISOString();
  bundle[type] = (bundle[type] || []).map((record) =>
    record.id === id ? { ...record, ...values, id: record.id, updatedAt: now } : record
  );
  saveStoredBundle(bundle);
  return bundle[type];
}

export function deleteEntityRecord(type, id) {
  const adapter = getStorageAdapter();
  const nextRecords = adapter.delete?.(type, id);
  if (nextRecords) {
    return nextRecords;
  }

  const bundle = getStoredBundle();
  bundle[type] = (bundle[type] || []).filter((record) => record.id !== id);
  saveStoredBundle(bundle);
  return bundle[type];
}

export function exportStoredBundle(type = null) {
  const bundle = getStoredBundle();
  if (type) {
    return {
      type,
      records: clone(bundle[type] || [])
    };
  }

  return bundle;
}

export function importStoredBundle(payload) {
  const bundle = normalizeImportedBundle(payload);
  return saveStoredBundle(bundle);
}

export function normalizeImportedBundle(payload) {
  if (Array.isArray(payload)) {
    throw new Error('Import payload must be an object keyed by module type, or an envelope with type and records.');
  }

  if (payload && typeof payload === 'object' && payload.type && Array.isArray(payload.records)) {
    const type = payload.type;
    if (!getModuleConfig(type)) {
      throw new Error(`Unknown module type: ${type}`);
    }

    return {
      ...getEmptyBundle(),
      [type]: payload.records.map((record) => normalizeRecord(record))
    };
  }

  const normalized = getEmptyBundle();

  getModuleTypes().forEach((type) => {
    const records = Array.isArray(payload?.[type]) ? payload[type] : [];
    normalized[type] = records.map((record) => normalizeRecord(record));
  });

  return normalized;
}

export function resetStoredBundle() {
  return saveStoredBundle(moduleSeeds);
}

export function clearStoredBundle() {
  return saveStoredBundle(getEmptyBundle());
}

export function exportModuleRecords(type) {
  return exportStoredBundle(type);
}

export function importModuleRecords(type, records) {
  const existing = getStoredBundle();
  existing[type] = Array.isArray(records) ? records.map((record) => normalizeRecord(record)) : [];
  return saveStoredBundle(existing);
}
