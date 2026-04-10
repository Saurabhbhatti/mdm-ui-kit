import { createBaseModuleConfig } from './baseModule.config.js';

export function categoryConfig() {
  return createBaseModuleConfig({
    type: 'category',
    entityKey: 'category',
    moduleName: 'Category',
    icon: 'category',
    displayName: 'Category Master Data',
    description: 'Manage material and product categories from a reusable config-driven module.',
    fileName: 'category-master-data',
    defaultValues: {
      name: '',
      code: '',
      description: ''
    },
    fields: [
      { name: 'name', label: 'Name', type: 'text', validation: { required: true } },
      { name: 'code', label: 'Code', type: 'text', validation: { required: true } },
      { name: 'description', label: 'Description', type: 'text' }
    ],
    columns: [
      { key: 'name', label: 'Name', sortable: true, searchable: true },
      { key: 'code', label: 'Code', sortable: true, searchable: true },
      { key: 'description', label: 'Description', searchable: true }
    ]
  });
}
