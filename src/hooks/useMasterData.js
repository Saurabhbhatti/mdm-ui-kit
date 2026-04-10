import { useMasterData } from '../store/masterDataStore.js';

export function useEntityData(entityKey) {
  return useMasterData(entityKey);
}
