import { categoryConfig } from '../configs/category.config.js';
import { productConfig } from '../configs/product.config.js';
import { workstationConfig } from '../configs/workstation.config.js';
import { resourceConfig } from '../configs/resource.config.js';
import { warehouseConfig } from '../configs/warehouse.config.js';
import { inventoryConfig } from '../configs/inventory.config.js';

export const moduleRegistry = {
  product: productConfig,
  category: categoryConfig,
  workstation: workstationConfig,
  resource: resourceConfig,
  warehouse: warehouseConfig,
  inventory: inventoryConfig
};

export function registerModule(type, configFactory) {
  moduleRegistry[type] = configFactory;
}

export function getModuleConfig(type, context = {}) {
  const factory = moduleRegistry[type];
  if (!factory) {
    return null;
  }

  return typeof factory === 'function' ? factory(context) : factory;
}

export function getModuleTypes() {
  return Object.keys(moduleRegistry);
}
