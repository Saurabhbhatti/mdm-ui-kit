import { ENTITY_KEYS } from '../config/constants.js';
import { useEntityData } from './useMasterData.js';

export function useWarehouse() {
  return useEntityData(ENTITY_KEYS.warehouses);
}
