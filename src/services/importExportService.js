import {
  exportModuleRecords,
  exportStoredBundle,
  normalizeImportedBundle
} from './masterDataService.js';

export function serializeBundle(bundle = exportStoredBundle()) {
  return JSON.stringify(bundle, null, 2);
}

export function serializeModule(type, records = exportModuleRecords(type).records || []) {
  return JSON.stringify(
    {
      type,
      records
    },
    null,
    2
  );
}

export function validateImportPayload(payload, expectedType = null) {
  const normalized = normalizeImportedBundle(payload);

  if (expectedType && payload?.type && payload.type !== expectedType) {
    throw new Error(`Expected module type ${expectedType} but received ${payload.type}.`);
  }

  if (expectedType) {
    return {
      type: expectedType,
      records: normalized[expectedType] || []
    };
  }

  return normalized;
}

export function parseMasterDataText(text, expectedType = null) {
  const parsed = JSON.parse(text);
  const validated = validateImportPayload(parsed, expectedType);
  return validated;
}

export function downloadJsonFile(filename, payload) {
  if (typeof document === 'undefined') {
    return;
  }

  const body = typeof payload === 'string' ? payload : serializeBundle(payload);
  const blob = new Blob([body], { type: 'application/json;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => window.URL.revokeObjectURL(url), 0);
}

export async function readMasterDataFile(file, expectedType = null) {
  const text = await file.text();
  return parseMasterDataText(text, expectedType);
}
