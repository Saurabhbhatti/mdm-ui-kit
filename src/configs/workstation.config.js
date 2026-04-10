import { createBaseModuleConfig } from './baseModule.config.js';

export function workstationConfig() {
  return createBaseModuleConfig({
    type: 'workstation',
    entityKey: 'workstation',
    moduleName: 'Workstation',
    icon: 'workstation',
    displayName: 'Workstation Master Data',
    description: 'Maintain workstation capacity, location, and identification details.',
    fileName: 'workstation-master-data',
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
