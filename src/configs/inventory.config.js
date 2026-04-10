import { createBaseModuleConfig } from './baseModule.config.js';

export function inventoryConfig({ bundle = {} } = {}) {
  const products = bundle.product || [];
  const warehouses = bundle.warehouse || [];
  const productOptions = products.map((product) => ({
    label: `${product.name} (${product.code})`,
    value: product.id
  }));
  const warehouseOptions = warehouses.map((warehouse) => ({
    label: `${warehouse.name} (${warehouse.code})`,
    value: warehouse.id
  }));

  return createBaseModuleConfig({
    type: 'inventory',
    entityKey: 'inventory',
    moduleName: 'Inventory',
    icon: 'inventory',
    displayName: 'Inventory Master Data',
    description: 'Track quantities and reorder levels per warehouse.',
    fileName: 'inventory-master-data',
    defaultValues: {
      productId: '',
      warehouseId: '',
      quantity: 0,
      reorderLevel: 0
    },
    fields: [
      {
        name: 'productId',
        label: 'Product',
        type: 'dropdown',
        validation: { required: true },
        options: productOptions
      },
      {
        name: 'warehouseId',
        label: 'Warehouse',
        type: 'dropdown',
        validation: { required: true },
        options: warehouseOptions
      },
      { name: 'quantity', label: 'Quantity', type: 'number', validation: { required: true, min: 0, noNegative: true } },
      { name: 'reorderLevel', label: 'Reorder Level', type: 'number', validation: { required: true, min: 0, noNegative: true } }
    ],
    columns: [
      {
        key: 'productId',
        label: 'Product',
        searchable: true,
        resolveValue: ({ row }) => {
          const product = products.find((item) => item.id === row.productId);
          return product ? `${product.name} (${product.code})` : row.productId || '-';
        }
      },
      {
        key: 'warehouseId',
        label: 'Warehouse',
        searchable: true,
        resolveValue: ({ row }) => {
          const warehouse = warehouses.find((item) => item.id === row.warehouseId);
          return warehouse ? `${warehouse.name} (${warehouse.code})` : row.warehouseId || '-';
        }
      },
      { key: 'quantity', label: 'Quantity', sortable: true },
      { key: 'reorderLevel', label: 'Reorder Level', sortable: true }
    ]
  });
}
