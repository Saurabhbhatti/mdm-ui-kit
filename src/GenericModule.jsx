import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMasterContext } from './providers/MasterContext.jsx';
import { useMasterDataStore, useMasterDataBundle } from './store/masterDataStore.js';
import DynamicForm from './components/DynamicForm/index.js';
import DataTable from './components/DataTable/index.js';
import Modal from './components/Modal/index.js';
import { downloadJsonFile, readMasterDataFile } from './services/importExportService.js';
import { getModulePermissions, resolveModuleConfig } from './utils/moduleConfig.js';
import { mergeConfig } from './utils/mergeConfig.js';
import { clearCache, getCache, setCache } from './utils/cacheManager.js';

function buildExportFilename(config) {
  return `${config.fileName || config.type || 'module'}-data.json`;
}

function setBundleRecords(type, records) {
  useMasterDataStore.getState().setEntityRecords(type, records);
}

export default function GenericModule({ config, configOverride = null, adapter = null, dataMapper = null, className = '' }) {
  const context = useMasterContext();
  const bundle = useMasterDataBundle();
  const type = config?.type;
  const [isOpen, setIsOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isBusy, setIsBusy] = useState(false);
  const [records, setRecords] = useState([]);
  const fileInputRef = useRef(null);

  const mergedConfig = useMemo(
    () => mergeConfig(config, configOverride),
    [config, configOverride]
  );

  const finalConfig = useMemo(
    () => mergeConfig(mergedConfig, dataMapper ? { dataMapper } : null),
    [dataMapper, mergedConfig]
  );

  const resolvedConfig = useMemo(
    () =>
      resolveModuleConfig(finalConfig || {}, {
        bundle,
        related: bundle,
        theme: context.theme
      }),
    [bundle, context.theme, finalConfig]
  );

  const permissions = getModulePermissions(resolvedConfig || {});
  const formFields = resolvedConfig?.fields || [];
  const initialValues = useMemo(
    () => editingRecord || resolvedConfig?.defaultValues || {},
    [editingRecord, resolvedConfig?.defaultValues]
  );
  const formTitle = editingRecord ? `Edit ${resolvedConfig?.moduleName || 'Module'}` : `Add ${resolvedConfig?.moduleName || 'Module'}`;

  const adapterContext = useMemo(
    () => ({
      bundle,
      related: bundle,
      theme: context.theme,
      config: resolvedConfig || {},
      dataMapper
    }),
    [bundle, context.theme, dataMapper, resolvedConfig]
  );

  const cacheKey = resolvedConfig?.type ? `module:${resolvedConfig.type}` : null;

  const resolvedAdapter = resolvedConfig?.type
    ? adapter || context.getAdapter?.(resolvedConfig.type) || context.adapters?.[resolvedConfig.type] || null
    : null;

  const loadRecords = useCallback(
    async ({ forceRefresh = false } = {}) => {
      if (!resolvedConfig?.type || !resolvedAdapter?.getList) {
        setError(`No adapter found for ${resolvedConfig?.type || 'module'}.`);
        setIsLoading(false);
        return [];
      }

      if (!forceRefresh) {
        const cachedRecords = getCache(cacheKey);
        if (Array.isArray(cachedRecords)) {
          setError('');
          setRecords(cachedRecords);
          setBundleRecords(resolvedConfig.type, cachedRecords);
          setIsLoading(false);
          return cachedRecords;
        }
      }

      setError('');
      setIsLoading(true);

      try {
        const nextRecords = await resolvedAdapter.getList(adapterContext);
        const safeRecords = Array.isArray(nextRecords) ? nextRecords : [];
        setRecords(safeRecords);
        setBundleRecords(resolvedConfig.type, safeRecords);
        setCache(cacheKey, safeRecords);
        return safeRecords;
      } catch (nextError) {
        setError(nextError?.message || 'Failed to load records.');
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [adapterContext, cacheKey, resolvedAdapter, resolvedConfig?.type]
  );

  useEffect(() => {
    if (!resolvedConfig?.type) {
      setMessage('Missing module configuration.');
    }
  }, [resolvedConfig]);

  useEffect(() => {
    if (!resolvedConfig?.type) {
      return;
    }

    setEditingRecord(null);
    setIsOpen(false);
    loadRecords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedConfig?.type, resolvedAdapter]);

  function closeForm() {
    setIsOpen(false);
    setEditingRecord(null);
  }

  function openCreate() {
    setEditingRecord(null);
    setIsOpen(true);
  }

  function openEdit(record) {
    setEditingRecord(record);
    setIsOpen(true);
  }

  async function handleSubmit(values) {
    if (!resolvedAdapter) {
      setError(`No adapter available for ${resolvedConfig.type}.`);
      return;
    }

    setIsBusy(true);
    setError('');

    try {
      if (editingRecord) {
        await resolvedAdapter.update(editingRecord.id, values, adapterContext);
        setMessage(`${resolvedConfig.moduleName} updated successfully.`);
      } else {
        await resolvedAdapter.create(values, adapterContext);
        setMessage(`${resolvedConfig.moduleName} created successfully.`);
      }

      clearCache(cacheKey);
      await loadRecords({ forceRefresh: true });
      closeForm();
    } catch (nextError) {
      setError(nextError?.message || `Failed to save ${resolvedConfig.moduleName.toLowerCase()}.`);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleDelete(record) {
    if (!resolvedAdapter?.delete) {
      setError(`No adapter available for ${resolvedConfig.type}.`);
      return;
    }

    setIsBusy(true);
    setError('');

    try {
      await resolvedAdapter.delete(record.id, adapterContext);
      setMessage(`${resolvedConfig.moduleName} deleted successfully.`);
      clearCache(cacheKey);
      await loadRecords({ forceRefresh: true });
    } catch (nextError) {
      setError(nextError?.message || `Failed to delete ${resolvedConfig.moduleName.toLowerCase()}.`);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleExport() {
    if (!resolvedAdapter?.export) {
      setError(`No export adapter available for ${resolvedConfig.type}.`);
      return;
    }

    setIsBusy(true);
    setError('');

    try {
      const payload = await resolvedAdapter.export(adapterContext);
      downloadJsonFile(buildExportFilename(resolvedConfig), payload || { type: resolvedConfig.type, records });
      setMessage(`${resolvedConfig.moduleName} exported successfully.`);
    } catch (nextError) {
      setError(nextError?.message || `Failed to export ${resolvedConfig.moduleName.toLowerCase()}.`);
    } finally {
      setIsBusy(false);
    }
  }

  async function handleImport(event) {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      setIsBusy(true);
      setError('');
      const payload = await readMasterDataFile(file, resolvedConfig.type);
      if (payload?.type !== resolvedConfig.type) {
        throw new Error(`Expected ${resolvedConfig.type} import payload.`);
      }

      if (!resolvedAdapter?.import) {
        throw new Error(`No import adapter available for ${resolvedConfig.type}.`);
      }

      await resolvedAdapter.import(payload, adapterContext);
      clearCache(cacheKey);
      await loadRecords({ forceRefresh: true });
      setMessage(`${resolvedConfig.moduleName} imported successfully.`);
    } catch (error) {
      setError(`Import failed: ${error.message}`);
    } finally {
      setIsBusy(false);
      event.target.value = '';
    }
  }

  if (!resolvedConfig?.type) {
    return <div className="mdm-module">Unknown module configuration.</div>;
  }

  const columns = resolvedConfig.columns || [];
  const tableColumns = [...columns];

  if (permissions.edit || permissions.delete) {
    tableColumns.push({
      key: '__actions',
      label: 'Actions',
      searchable: false,
      sortable: false,
      render: (row) => (
        <div className="mdm-rowActions">
          {permissions.edit ? (
            <button className="mdm-button mdm-button--small" type="button" onClick={() => openEdit(row)}>
              Edit
            </button>
          ) : null}
          {permissions.delete ? (
            <button className="mdm-button mdm-button--small mdm-button--danger" type="button" onClick={() => handleDelete(row)}>
              Delete
            </button>
          ) : null}
        </div>
      )
    });
  }

  return (
    <section className={`mdm-module ${className}`.trim()}>
      <div className="mdm-card mdm-card--module">
        <header className="mdm-module__header">
          <div className="mdm-module__headerContent">
            <p className="mdm-module__eyebrow">{resolvedConfig.moduleName}</p>
            <h1 className="mdm-module__title">{resolvedConfig.displayName || resolvedConfig.moduleName}</h1>
            {resolvedConfig.description ? <p className="mdm-module__description">{resolvedConfig.description}</p> : null}
          </div>

          <div className="mdm-module__actions mdm-module__headerActions">
            {permissions.create ? (
              <button className="mdm-button mdm-button--primary" type="button" onClick={openCreate}>
                Add {resolvedConfig.moduleName}
              </button>
            ) : null}
            {permissions.export ? (
              <button className="mdm-button mdm-button--secondary" type="button" onClick={handleExport} disabled={isBusy}>
                {isBusy ? <span className="mdm-button__spinner" /> : null}
                Export JSON
              </button>
            ) : null}
            {permissions.import ? (
              <>
                <button className="mdm-button mdm-button--secondary" type="button" onClick={() => fileInputRef.current?.click()}>
                  Import JSON
                </button>
                <input ref={fileInputRef} type="file" accept="application/json,.json" hidden onChange={handleImport} />
              </>
            ) : null}
          </div>
        </header>

        {message ? <div className="mdm-message">{message}</div> : null}
        {error ? <div className="mdm-message mdm-message--error">{error}</div> : null}

        <DataTable
          columns={tableColumns.map((column) => ({
            ...column,
            render:
              column.render ||
              ((row) => {
                const value = row[column.key];
                return value === '' || value === null || value === undefined ? '-' : value;
              })
          }))}
          data={records}
          pageSize={resolvedConfig.pageSize}
          searchable={resolvedConfig.searchable !== false}
          sortable={resolvedConfig.sortable !== false}
          filters={resolvedConfig.filters || []}
          loading={isLoading || isBusy}
          emptyStateTitle={`No ${resolvedConfig.moduleName.toLowerCase()} records yet`}
          emptyStateDescription={`Add the first ${resolvedConfig.moduleName.toLowerCase()} to get started.`}
          emptyStateActionLabel={permissions.create ? `Add ${resolvedConfig.moduleName}` : 'Create new'}
          onEmptyStateAction={permissions.create ? openCreate : undefined}
        />
      </div>

      <Modal open={isOpen} title={formTitle} onClose={closeForm}>
        <DynamicForm
          schema={formFields}
          initialValues={initialValues}
          submitLabel={editingRecord ? 'Update' : 'Create'}
          onCancel={closeForm}
          onSubmit={handleSubmit}
          context={{
            bundle,
            related: bundle,
            config: resolvedConfig,
            editingRecord
          }}
          loading={isBusy}
        />
      </Modal>
    </section>
  );
}
