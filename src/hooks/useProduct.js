import { ENTITY_KEYS } from '../config/constants.js';
import { useEntityData } from './useMasterData.js';

export function useProduct() {
  return useEntityData(ENTITY_KEYS.products);
}
