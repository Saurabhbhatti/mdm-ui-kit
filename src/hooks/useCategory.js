import { ENTITY_KEYS } from '../config/constants.js';
import { useEntityData } from './useMasterData.js';

export function useCategory() {
  return useEntityData(ENTITY_KEYS.categories);
}
