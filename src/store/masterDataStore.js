import { create } from 'zustand';
import { getModuleTypes } from '../registry/moduleRegistry.js';
import {
  clearStoredBundle,
  createEntityRecord,
  deleteEntityRecord,
  exportStoredBundle,
  getStoredBundle,
  importStoredBundle,
  resetStoredBundle,
  updateEntityRecord
} from '../services/masterDataService.js';

const initialBundle = getStoredBundle();

function getStateRecords(state, type) {
  return state.records?.[type] || [];
}

export const useMasterDataStore = create((set, get) => ({
  records: initialBundle,
  ui: {
    activeModule: getModuleTypes()[0] || null
  },
  setActiveModule: (type) => {
    set((state) => ({
      ui: {
        ...state.ui,
        activeModule: type
      }
    }));
  },
  createRecord: (type, values) => {
    const nextRecords = createEntityRecord(type, values);
    set((state) => ({
      records: {
        ...state.records,
        [type]: nextRecords
      }
    }));
    return nextRecords[nextRecords.length - 1] || null;
  },
  setEntityRecords: (type, records) => {
    set((state) => ({
      records: {
        ...state.records,
        [type]: Array.isArray(records) ? records : []
      }
    }));
    return getStateRecords(get(), type);
  },
  updateRecord: (type, id, values) => {
    const nextRecords = updateEntityRecord(type, id, values);
    set((state) => ({
      records: {
        ...state.records,
        [type]: nextRecords
      }
    }));
    return nextRecords.find((record) => record.id === id) || null;
  },
  deleteRecord: (type, id) => {
    const nextRecords = deleteEntityRecord(type, id);
    set((state) => ({
      records: {
        ...state.records,
        [type]: nextRecords
      }
    }));
    return nextRecords;
  },
  replaceEntityRecords: (type, records) => {
    const bundle = exportStoredBundle();
    bundle[type] = Array.isArray(records) ? records : [];
    const normalized = importStoredBundle(bundle);
    set({ records: normalized });
    return normalized[type];
  },
  resetAll: () => {
    const seeded = resetStoredBundle();
    set({ records: seeded });
    return seeded;
  },
  clearAll: () => {
    const cleared = clearStoredBundle();
    set({ records: cleared });
    return cleared;
  },
  exportAll: () => exportStoredBundle(),
  exportModule: (type) => exportStoredBundle(type),
  importAll: (bundle) => {
    const normalized = importStoredBundle(bundle);
    set({ records: normalized });
    return normalized;
  },
  importModule: (type, records) => {
    const bundle = exportStoredBundle();
    bundle[type] = Array.isArray(records) ? records : [];
    const normalized = importStoredBundle(bundle);
    set({ records: normalized });
    return normalized[type];
  },
  getEntityRecords: (type) => getStateRecords(get(), type),
  getAllRecords: () => get().records
}));

export function useMasterData(type) {
  const items = useMasterDataStore((state) => getStateRecords(state, type));

  return {
    items,
    createRecord: (values) => useMasterDataStore.getState().createRecord(type, values),
    updateRecord: (id, values) => useMasterDataStore.getState().updateRecord(type, id, values),
    deleteRecord: (id) => useMasterDataStore.getState().deleteRecord(type, id),
    setEntityRecords: (records) => useMasterDataStore.getState().setEntityRecords(type, records),
    replaceEntityRecords: (records) => useMasterDataStore.getState().replaceEntityRecords(type, records),
    exportModule: () => useMasterDataStore.getState().exportModule(type),
    importModule: (records) => useMasterDataStore.getState().importModule(type, records),
    resetAll: () => useMasterDataStore.getState().resetAll(),
    clearAll: () => useMasterDataStore.getState().clearAll(),
    exportAll: () => useMasterDataStore.getState().exportAll(),
    importAll: (bundle) => useMasterDataStore.getState().importAll(bundle)
  };
}

export function useMasterDataBundle() {
  return useMasterDataStore((state) => state.records);
}

export { getModuleTypes };
