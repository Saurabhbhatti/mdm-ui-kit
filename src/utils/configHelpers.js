function isPlainObject(value) {
  return Object.prototype.toString.call(value) === '[object Object]';
}

function cloneValue(value) {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item));
  }

  if (isPlainObject(value)) {
    return mergeDeep({}, value);
  }

  return value;
}

function mergeDeep(base = {}, override = {}) {
  const result = { ...(base || {}) };

  Object.entries(override || {}).forEach(([key, value]) => {
    const baseValue = result[key];

    if (isPlainObject(baseValue) && isPlainObject(value)) {
      result[key] = mergeDeep(baseValue, value);
      return;
    }

    result[key] = cloneValue(value);
  });

  return result;
}

function getEntryKey(entry = {}) {
  return entry?.apiKey || entry?.key || entry?.accessor || entry?.name || null;
}

function findMatchingIndex(list = [], item = {}) {
  const keys = [item?.name, item?.apiKey, item?.key, item?.accessor].filter(Boolean);

  return list.findIndex((entry) => {
    const entryKeys = [entry?.name, entry?.apiKey, entry?.key, entry?.accessor].filter(Boolean);
    return keys.some((key) => entryKeys.includes(key));
  });
}

function mergeArrayByIdentity(baseList = [], overrideList = []) {
  const result = (Array.isArray(baseList) ? baseList : []).map((item) => cloneValue(item));

  (Array.isArray(overrideList) ? overrideList : []).forEach((item) => {
    const index = findMatchingIndex(result, item);

    if (index >= 0) {
      result[index] = mergeDeep(result[index], item);
      return;
    }

    result.push(cloneValue(item));
  });

  return result;
}

function resolveApiKey(field = {}) {
  return field?.apiKey || field?.key || field?.accessor || field?.name || null;
}

function resolveUiKey(field = {}) {
  return field?.name || field?.apiKey || field?.key || field?.accessor || null;
}

function readSourceValue(source = {}, field = {}) {
  const apiKey = resolveApiKey(field);
  const uiKey = resolveUiKey(field);

  if (source == null || typeof source !== 'object') {
    return undefined;
  }

  if (apiKey && source?.[apiKey] !== undefined) {
    return source?.[apiKey];
  }

  if (uiKey && source?.[uiKey] !== undefined) {
    return source?.[uiKey];
  }

  return undefined;
}

function prepareFieldDefault(field = {}, config = {}) {
  const defaults = config?.defaultValues || {};
  const uiKey = resolveUiKey(field);
  const apiKey = resolveApiKey(field);

  if (uiKey && Object.prototype.hasOwnProperty.call(defaults, uiKey)) {
    return defaults[uiKey];
  }

  if (apiKey && Object.prototype.hasOwnProperty.call(defaults, apiKey)) {
    return defaults[apiKey];
  }

  if (Object.prototype.hasOwnProperty.call(field, 'defaultValue')) {
    return field.defaultValue;
  }

  return '';
}

export function mapToUI(data, config = {}, context = {}) {
  if (Array.isArray(data)) {
    return data.map((item) => mapToUI(item, config, context));
  }

  if (!data || typeof data !== 'object') {
    return data ?? {};
  }

  const fields = Array.isArray(config?.fields) ? config.fields : [];
  const mapped = { ...data };

  fields.forEach((field) => {
    const uiKey = resolveUiKey(field);
    if (!uiKey) {
      return;
    }

    const value = readSourceValue(data, field);
    mapped[uiKey] = value === undefined ? prepareFieldDefault(field, config) : value;
  });

  Object.entries(config?.defaultValues || {}).forEach(([key, value]) => {
    if (mapped[key] === undefined) {
      mapped[key] = cloneValue(value);
    }
  });

  if (typeof config?.dataMapper?.toUI === 'function') {
    const transformed = config.dataMapper.toUI(mapped, context);
    if (transformed && typeof transformed === 'object') {
      return transformed;
    }
  }

  return mapped;
}

export function mapToAPI(data, config = {}, context = {}) {
  if (Array.isArray(data)) {
    return data.map((item) => mapToAPI(item, config, context));
  }

  if (!data || typeof data !== 'object') {
    return data ?? {};
  }

  const fields = Array.isArray(config?.fields) ? config.fields : [];
  const mapped = { ...data };

  fields.forEach((field) => {
    const uiKey = resolveUiKey(field);
    const apiKey = resolveApiKey(field);

    if (!uiKey || !apiKey) {
      return;
    }

    const value = mapped?.[uiKey] !== undefined ? mapped?.[uiKey] : readSourceValue(data, field);
    mapped[apiKey] = value === undefined ? prepareFieldDefault(field, config) : value;

    if (apiKey !== uiKey && Object.prototype.hasOwnProperty.call(mapped, uiKey)) {
      delete mapped[uiKey];
    }
  });

  if (typeof config?.dataMapper?.toAPI === 'function') {
    const transformed = config.dataMapper.toAPI(mapped, context);
    if (transformed && typeof transformed === 'object') {
      return transformed;
    }
  }

  return mapped;
}

export function validateFields(values = {}, fields = [], context = {}, options = {}) {
  const items = Array.isArray(fields) ? fields : [];
  const errors = {};
  const targetNames = Array.isArray(options.names) ? options.names : null;

  items.forEach((field) => {
    const uiKey = resolveUiKey(field);
    if (!uiKey) {
      return;
    }

    if (targetNames && !targetNames.includes(uiKey)) {
      return;
    }

    const error = validateSingleField(values?.[uiKey], field, context);
    if (error) {
      errors[uiKey] = error;
    }
  });

  return errors;
}

export { cloneValue as cloneConfigValue, resolveApiKey, resolveUiKey };
import { validateField as validateSingleField } from './validation.js';
