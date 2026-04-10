import { useMasterDataStore } from '../store/masterDataStore.js';

export function useMasterStore(selector) {
  return useMasterDataStore(selector);
}
