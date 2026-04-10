import { STORAGE_KEY } from '../config/constants.js';
import { isBrowser } from '../utils/storage.js';
import { mapToAPI, mapToUI } from '../utils/configHelpers.js';

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `mdm-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function readBundle() {
  if (!isBrowser()) {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeBundle(bundle) {
  if (!isBrowser()) {
    return bundle;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bundle));
  return bundle;
}

function readRecords(type) {
  const bundle = readBundle();
  return Array.isArray(bundle?.[type]) ? bundle[type] : [];
}

function writeRecords(type, records) {
  const bundle = readBundle();
  bundle[type] = Array.isArray(records) ? records : [];
  writeBundle(bundle);
  return bundle[type];
}

function normalizeStoredRecord(record = {}, previous = null) {
  const now = new Date().toISOString();
  return {
    ...(previous || {}),
    ...clone(record),
    id: record.id || previous?.id || createId(),
    createdAt: previous?.createdAt || record.createdAt || now,
    updatedAt: now
  };
}

function resolveConfig(context = {}) {
  return {
    ...(context.config || {}),
    dataMapper: context.dataMapper || context.config?.dataMapper || null
  };
}

function toModuleEnvelope(type, records) {
  return {
    type,
    records: clone(records)
  };
}

const adapterCache = new Map();

export function createLocalStorageModuleAdapter(type) {
  if (adapterCache.has(type)) {
    return adapterCache.get(type);
  }

  const adapter = {
    async getList(context = {}) {
      return mapToUI(readRecords(type), resolveConfig(context), context);
    },

    async getById(id, context = {}) {
      const config = resolveConfig(context);
      const record = readRecords(type).find((item) => item?.id === id);
      return record ? mapToUI(record, config, context) : null;
    },

    async create(data, context = {}) {
      const config = resolveConfig(context);
      const records = readRecords(type);
      const nextRecord = normalizeStoredRecord(mapToAPI(data, config, context));
      writeRecords(type, [...records, nextRecord]);
      return mapToUI(nextRecord, config, context);
    },

    async update(id, data, context = {}) {
      const config = resolveConfig(context);
      const records = readRecords(type);
      const index = records.findIndex((item) => item?.id === id);

      if (index < 0) {
        return null;
      }

      const nextRecord = normalizeStoredRecord(
        {
          ...records[index],
          ...mapToAPI(data, config, context),
          id: records[index].id,
          createdAt: records[index].createdAt
        },
        records[index]
      );

      records[index] = nextRecord;
      writeRecords(type, records);
      return mapToUI(nextRecord, config, context);
    },

    async delete(id) {
      const records = readRecords(type).filter((item) => item?.id !== id);
      writeRecords(type, records);
      return records;
    },

    async import(payload, context = {}) {
      const config = resolveConfig(context);
      const incoming = Array.isArray(payload) ? payload : payload?.records || [];
      const records = incoming.map((record) => normalizeStoredRecord(mapToAPI(record, config, context)));
      writeRecords(type, records);
      return records.map((record) => mapToUI(record, config, context));
    },

    async export(context = {}) {
      const records = mapToUI(readRecords(type), resolveConfig(context), context);
      return toModuleEnvelope(type, records);
    }
  };

  adapterCache.set(type, adapter);
  return adapter;
}
