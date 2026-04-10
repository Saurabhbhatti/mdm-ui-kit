import { cloneConfigValue } from './configHelpers.js';

function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function mergeDeep(base = {}, override = {}) {
  const result = { ...(base || {}) };

  Object.entries(override || {}).forEach(([key, value]) => {
    const baseValue = result[key];

    if (Array.isArray(value)) {
      result[key] = cloneConfigValue(value);
      return;
    }

    if (isPlainObject(baseValue) && isPlainObject(value)) {
      result[key] = mergeDeep(baseValue, value);
      return;
    }

    result[key] = cloneConfigValue(value);
  });

  return result;
}

function getFieldIdentity(item = {}) {
  return item?.name || item?.apiKey || item?.key || item?.accessor || null;
}

function mergeList(baseList = [], overrideList = [], getIdentity = getFieldIdentity) {
  const merged = (Array.isArray(baseList) ? baseList : []).map((item) => cloneConfigValue(item));

  (Array.isArray(overrideList) ? overrideList : []).forEach((overrideItem) => {
    const identity = getIdentity(overrideItem);
    if (!identity) {
      merged.push(cloneConfigValue(overrideItem));
      return;
    }

    const index = merged.findIndex((entry) => getIdentity(entry) === identity);

    if (overrideItem?.hidden) {
      if (index >= 0) {
        merged.splice(index, 1);
      }
      return;
    }

    if (index >= 0) {
      merged[index] = mergeDeep(merged[index], overrideItem);
      return;
    }

    merged.push(cloneConfigValue(overrideItem));
  });

  return merged.filter((item) => !item?.hidden);
}

function normalizeField(field = {}) {
  return {
    ...field,
    name: field.name || field.apiKey || field.key || field.accessor || null,
    apiKey: field.apiKey || field.name || field.key || field.accessor || null
  };
}

function normalizeColumn(column = {}) {
  const key = column.key || column.apiKey || column.accessor || column.name || null;

  return {
    ...column,
    key,
    apiKey: column.apiKey || key,
    name: column.name || key
  };
}

export function mergeConfig(baseConfig = null, overrideConfig = null) {
  if (!baseConfig && !overrideConfig) {
    return null;
  }

  if (!baseConfig) {
    const clonedOverride = cloneConfigValue(overrideConfig);
    if (clonedOverride?.fields) {
      clonedOverride.fields = mergeList([], clonedOverride.fields).map(normalizeField);
    }
    if (clonedOverride?.columns) {
      clonedOverride.columns = mergeList([], clonedOverride.columns, getFieldIdentity).map(normalizeColumn);
    }
    return clonedOverride;
  }

  if (!overrideConfig) {
    const clonedBase = cloneConfigValue(baseConfig);
    clonedBase.fields = mergeList(clonedBase.fields, []).map(normalizeField);
    clonedBase.columns = mergeList(clonedBase.columns, [], getFieldIdentity).map(normalizeColumn);
    return clonedBase;
  }

  const merged = mergeDeep(baseConfig, overrideConfig);

  merged.fields = mergeList(baseConfig.fields, overrideConfig.fields).map(normalizeField);
  merged.columns = mergeList(baseConfig.columns, overrideConfig.columns, getFieldIdentity).map(normalizeColumn);

  return merged;
}

export { mergeDeep, mergeList, normalizeColumn, normalizeField };
