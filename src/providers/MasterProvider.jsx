import React, { useEffect, useMemo } from 'react';
import { MasterContext } from './MasterContext.jsx';
import { localStorageAdapter } from '../services/storageAdapter.js';
import { setMasterRuntime } from './masterRuntime.js';
import { defaultTheme, normalizeTheme } from '../configs/theme.config.js';
import { getStoredBundle } from '../services/masterDataService.js';
import { useMasterDataStore } from '../store/masterDataStore.js';
import { adapterRegistry, createLocalStorageModuleAdapter, mergeAdapterRegistry } from '../adapters/index.js';

function toCssVars(theme) {
  return {
    '--bg-color': theme.colors.bg,
    '--surface-color': theme.colors.surface,
    '--text-color': theme.colors.text,
    '--muted-color': theme.colors.muted,
    '--primary-color': theme.colors.primary,
    '--primary-contrast-color': theme.colors.primaryContrast,
    '--danger-color': theme.colors.danger,
    '--border-color': theme.colors.border,
    '--hover-color': theme.colors.hover,
    '--radius-lg': theme.radius,
    '--spacing-lg': theme.spacing,
    '--shadow-lg': theme.shadow,
    '--mdm-color-bg': theme.colors.bg,
    '--mdm-color-surface': theme.colors.surface,
    '--mdm-color-text': theme.colors.text,
    '--mdm-color-muted': theme.colors.muted,
    '--mdm-color-primary': theme.colors.primary,
    '--mdm-color-primary-contrast': theme.colors.primaryContrast,
    '--mdm-color-danger': theme.colors.danger,
    '--mdm-color-border': theme.colors.border,
    '--mdm-color-hover': theme.colors.hover,
    '--mdm-border-radius': theme.radius,
    '--mdm-spacing': theme.spacing,
    '--mdm-shadow': theme.shadow
  };
}

export default function MasterProvider({
  theme = defaultTheme,
  storageAdapter = localStorageAdapter,
  adapters = {},
  children
}) {
  const mergedTheme = useMemo(() => normalizeTheme(theme), [theme]);
  const mergedAdapters = useMemo(() => mergeAdapterRegistry(adapterRegistry, adapters), [adapters]);

  const getAdapter = useMemo(
    () => (type) => mergedAdapters?.[type] || adapterRegistry[type] || createLocalStorageModuleAdapter(type),
    [mergedAdapters]
  );

  useEffect(() => {
    setMasterRuntime({ storageAdapter, adapters: mergedAdapters });
    useMasterDataStore.setState({ records: getStoredBundle() });
  }, [storageAdapter, mergedAdapters]);

  const style = useMemo(() => toCssVars(mergedTheme), [mergedTheme]);

  return (
    <MasterContext.Provider value={{ theme: mergedTheme, storageAdapter, adapters: mergedAdapters, getAdapter }}>
      <div className="mdm-themeRoot" style={style}>
        {children}
      </div>
    </MasterContext.Provider>
  );
}
