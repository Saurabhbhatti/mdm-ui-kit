import { mapToAPI, mapToUI } from '../utils/configHelpers.js';

const DEFAULT_ENDPOINT = '/api/categories';

function resolveConfig(context = {}) {
  return {
    ...(context.config || {}),
    dataMapper: context.dataMapper || context.config?.dataMapper || null
  };
}

function getEndpoint(context = {}) {
  return context.config?.api?.baseUrl || DEFAULT_ENDPOINT;
}

function extractRecords(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }

  if (Array.isArray(payload?.records)) {
    return payload.records;
  }

  if (Array.isArray(payload?.items)) {
    return payload.items;
  }

  if (Array.isArray(payload?.data)) {
    return payload.data;
  }

  return [];
}

function extractRecord(payload) {
  if (!payload || Array.isArray(payload)) {
    return payload;
  }

  return payload.data || payload.record || payload;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = await response.text().catch(() => '');
    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

function buildApiPayload(data, context) {
  return mapToAPI(data, resolveConfig(context), context);
}

function buildUiPayload(data, context) {
  return mapToUI(data, resolveConfig(context), context);
}

export const categoryAdapter = {
  async getList(context = {}) {
    const endpoint = getEndpoint(context);
    const payload = await requestJson(endpoint, { method: 'GET' });
    return buildUiPayload(extractRecords(payload), context);
  },

  async getById(id, context = {}) {
    const endpoint = `${getEndpoint(context)}/${encodeURIComponent(id)}`;
    const payload = await requestJson(endpoint, { method: 'GET' });
    return buildUiPayload(extractRecord(payload), context);
  },

  async create(data, context = {}) {
    const endpoint = getEndpoint(context);
    const payload = await requestJson(endpoint, {
      method: 'POST',
      body: JSON.stringify(buildApiPayload(data, context))
    });
    return buildUiPayload(extractRecord(payload), context);
  },

  async update(id, data, context = {}) {
    const endpoint = `${getEndpoint(context)}/${encodeURIComponent(id)}`;
    const payload = await requestJson(endpoint, {
      method: 'PUT',
      body: JSON.stringify(buildApiPayload(data, context))
    });
    return buildUiPayload(extractRecord(payload), context);
  },

  async delete(id, context = {}) {
    const endpoint = `${getEndpoint(context)}/${encodeURIComponent(id)}`;
    await requestJson(endpoint, { method: 'DELETE' });
    return { id };
  },

  async import(payload, context = {}) {
    const endpoint = `${getEndpoint(context)}/import`;
    const body = Array.isArray(payload) ? payload : payload?.records || [];
    await requestJson(endpoint, {
      method: 'POST',
      body: JSON.stringify({
        type: context?.config?.type,
        records: buildApiPayload(body, context)
      })
    });
    return buildUiPayload(body, context);
  },

  async export(context = {}) {
    const records = buildUiPayload(extractRecords(await requestJson(getEndpoint(context), { method: 'GET' })), context);
    return {
      type: context?.config?.type || 'category',
      records
    };
  }
};
