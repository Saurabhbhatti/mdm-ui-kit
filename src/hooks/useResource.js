import { ENTITY_KEYS } from '../config/constants.js';
import { useEntityData } from './useMasterData.js';

export function useResource() {
  return useEntityData(ENTITY_KEYS.resources);
}
