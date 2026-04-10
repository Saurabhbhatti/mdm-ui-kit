import { createBaseModuleConfig } from './baseModule.config.js';

export function resourceConfig({ bundle = {} } = {}) {
  const workstations = bundle.workstation || [];
  const workstationOptions = workstations.map((workstation) => ({
    label: `${workstation.name} (${workstation.code})`,
    value: workstation.id
  }));

  return createBaseModuleConfig({
    type: 'resource',
    entityKey: 'resource',
    moduleName: 'Resource',
    icon: 'resource',
    displayName: 'Resource Master Data',
    description: 'Manage machine, human, and tooling resources through config.',
    fileName: 'resource-master-data',
    defaultValues: {
      name: '',
      code: '',
      type: '',
      workstationId: ''
    },
    fields: [
      { name: 'name', label: 'Name', type: 'text', validation: { required: true } },
      { name: 'code', label: 'Code', type: 'text', validation: { required: true } },
      {
        name: 'type',
        label: 'Type',
        type: 'dropdown',
        validation: { required: true },
        options: [
          { label: 'Machine', value: 'Machine' },
          { label: 'Human', value: 'Human' },
          { label: 'Tool', value: 'Tool' },
          { label: 'Fixture', value: 'Fixture' },
          { label: 'Consumable', value: 'Consumable' }
        ]
      },
      {
        name: 'workstationId',
        label: 'Workstation',
        type: 'dropdown',
        validation: { required: true },
        options: workstationOptions
      }
    ],
    columns: [
      { key: 'name', label: 'Name', sortable: true, searchable: true },
      { key: 'code', label: 'Code', sortable: true, searchable: true },
      { key: 'type', label: 'Type', sortable: true, searchable: true },
      {
        key: 'workstationId',
        label: 'Workstation',
        searchable: true,
        resolveValue: ({ row }) => {
          const workstation = workstations.find((item) => item.id === row.workstationId);
          return workstation ? `${workstation.name} (${workstation.code})` : row.workstationId || '-';
        }
      }
    ]
  });
}
