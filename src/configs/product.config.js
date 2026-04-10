import { createBaseModuleConfig } from './baseModule.config.js';

export function productConfig({ bundle = {} } = {}) {
  const categories = bundle.category || [];
  const categoryOptions = categories.map((category) => ({
    label: `${category.name} (${category.code})`,
    value: category.id
  }));

  return createBaseModuleConfig({
    type: 'product',
    entityKey: 'product',
    moduleName: 'Product',
    icon: 'product',
    displayName: 'Product Master Data',
    description: 'Capture product definitions, category mapping, and stock controls.',
    fileName: 'product-master-data',
    defaultValues: {
      name: '',
      code: '',
      categoryId: '',
      unit: '',
      minStock: 0
    },
    fields: [
      { name: 'name', label: 'Name', type: 'text', validation: { required: true } },
      { name: 'code', label: 'Code', type: 'text', validation: { required: true } },
      {
        name: 'categoryId',
        label: 'Category',
        type: 'dropdown',
        validation: { required: true },
        options: () => categoryOptions
      },
      { name: 'unit', label: 'Unit', type: 'text', validation: { required: true } },
      { name: 'minStock', label: 'Minimum Stock', type: 'number', validation: { required: true, min: 0, noNegative: true } }
    ],
    columns: [
      { key: 'name', label: 'Name', sortable: true, searchable: true },
      { key: 'code', label: 'Code', sortable: true, searchable: true },
      {
        key: 'categoryId',
        label: 'Category',
        searchable: true,
        resolveValue: ({ row }) => {
          const category = categories.find((item) => item.id === row.categoryId);
          return category ? `${category.name} (${category.code})` : row.categoryId || '-';
        }
      },
      { key: 'unit', label: 'Unit', sortable: true, searchable: true },
      { key: 'minStock', label: 'Minimum Stock', sortable: true }
    ]
  });
}
