export function createBaseModuleConfig(overrides = {}) {
  return {
    version: 1,
    permissions: {
      create: true,
      edit: true,
      delete: true,
      export: true,
      import: true
    },
    importExport: {
      scope: 'module',
      validateStructure: true
    },
    searchable: true,
    sortable: true,
    filters: [],
    pageSize: 10,
    ...overrides
  };
}
