export { categoryAdapter } from './categoryAdapter.js';
export { createLocalStorageModuleAdapter } from './localStorageAdapter.js';
export { adapterRegistry } from './adapterRegistry.js';

export function mergeAdapterRegistry(baseAdapters = {}, overrideAdapters = {}) {
  return {
    ...(baseAdapters || {}),
    ...(overrideAdapters || {})
  };
}
