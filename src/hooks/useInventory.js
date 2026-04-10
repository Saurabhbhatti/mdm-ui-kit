import { ENTITY_KEYS } from '../config/constants.js';
import { useEntityData } from './useMasterData.js';

export function useInventory() {
  return useEntityData(ENTITY_KEYS.inventories);
}
