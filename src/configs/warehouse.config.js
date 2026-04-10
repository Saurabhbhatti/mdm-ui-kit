import { createBaseModuleConfig } from './baseModule.config.js';

export function warehouseConfig() {
  return createBaseModuleConfig({
    type: 'warehouse',
    entityKey: 'warehouse',
    moduleName: 'Warehouse',
    icon: 'warehouse',
    displayName: 'Warehouse Master Data',
    description: 'Centralize warehouse locations and capacity settings.',
    fileName: 'warehouse-master-data',
    defaultValues: {
      name: '',
      code: '',
      location: '',
      capacity: 0
    },
    fields: [
      { name: 'name', label: 'Name', type: 'text', validation: { required: true } },
      { name: 'code', label: 'Code', type: 'text', validation: { required: true } },
      { name: 'location', label: 'Location', type: 'text', validation: { required: true } },
      { name: 'capacity', label: 'Capacity', type: 'number', validation: { required: true, min: 0, noNegative: true } }
    ],
    columns: [
      { key: 'name', label: 'Name', sortable: true, searchable: true },
      { key: 'code', label: 'Code', sortable: true, searchable: true },
      { key: 'location', label: 'Location', searchable: true },
      { key: 'capacity', label: 'Capacity', sortable: true }
    ]
  });
}
