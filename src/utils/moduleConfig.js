import { resolveFieldOptions } from './validation.js';

function normalizeField(field = {}) {
  return {
    ...field,
    name: field.name || field.apiKey || field.key || field.accessor,
    apiKey: field.apiKey || field.name || field.key || field.accessor || null
  };
}

function normalizeColumn(column = {}) {
  return {
    ...column,
    key: column.key || column.apiKey || column.accessor || column.name || null,
    apiKey: column.apiKey || column.key || column.accessor || column.name || null
  };
}

export function resolveModuleConfig(configOrFactory, context = {}) {
  const rawConfig = typeof configOrFactory === 'function' ? configOrFactory(context) : configOrFactory;
  if (!rawConfig) {
    return null;
  }

  const related = context.related || {};

  const fields = (rawConfig.fields || []).map((field) => {
    const normalizedField = normalizeField(field);

    return {
      ...normalizedField,
      options: resolveFieldOptions(normalizedField, {
        ...context,
        related,
        field: normalizedField
      })
    };
  });

  const columns = (rawConfig.columns || []).map((column) => {
    const normalizedColumn = normalizeColumn(column);

    return {
      ...normalizedColumn,
      valueGetter:
        typeof column.valueGetter === 'function'
          ? column.valueGetter
          : column.resolveValue
            ? (row) => column.resolveValue({ row, related, context })
            : column.valueGetter,
      render:
        typeof column.render === 'function'
          ? column.render
          : column.resolveValue
            ? (row) => column.resolveValue({ row, related, context })
            : undefined
    };
  });

  return {
    ...rawConfig,
    fields,
    columns
  };
}

export function getModulePermissions(config = {}) {
  return {
    create: true,
    edit: true,
    delete: true,
    export: true,
    import: true,
    ...(config.permissions || {})
  };
}
