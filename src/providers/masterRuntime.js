import { localStorageAdapter } from '../services/storageAdapter.js';
import { adapterRegistry } from '../adapters/adapterRegistry.js';
import { createLocalStorageModuleAdapter } from '../adapters/localStorageAdapter.js';

let runtime = {
  storageAdapter: localStorageAdapter,
  adapters: adapterRegistry
};

export function setMasterRuntime(nextRuntime = {}) {
  runtime = {
    ...runtime,
    ...nextRuntime
  };
}

export function getMasterRuntime() {
  return runtime;
}

export function getStorageAdapter() {
  return runtime.storageAdapter || localStorageAdapter;
}

export function getAdapter(type) {
  return runtime.adapters?.[type] || adapterRegistry[type] || createLocalStorageModuleAdapter(type);
}
