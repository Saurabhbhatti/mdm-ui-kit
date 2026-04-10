import React, { useMemo } from 'react';
import { getModuleConfig } from './registry/moduleRegistry.js';
import GenericModule from './GenericModule.jsx';
import { useMasterDataBundle } from './store/masterDataStore.js';
import { useMasterContext } from './providers/MasterContext.jsx';
import { mergeConfig } from './utils/mergeConfig.js';

export default function MasterModule({
  type,
  configOverride = null,
  config = null,
  dataMapper = null,
  className = ''
}) {
  const bundle = useMasterDataBundle();
  const context = useMasterContext();
  const baseConfig = useMemo(
    () =>
      getModuleConfig(type, {
        bundle,
        related: bundle,
        theme: context.theme
      }),
    [bundle, context.theme, type]
  );

  const mergedConfig = useMemo(
    () => mergeConfig(baseConfig, config),
    [baseConfig, config]
  );

  const finalConfig = useMemo(
    () => mergeConfig(mergedConfig, configOverride),
    [configOverride, mergedConfig]
  );
  const adapter = useMemo(
    () => context.getAdapter?.(type) || context.adapters?.[type] || null,
    [context.getAdapter, context.adapters, type]
  );

  if (!finalConfig) {
    return <div className="mdm-module">Unknown module type: {type}</div>;
  }

  return (
    <GenericModule
      key={type}
      className={className}
      config={finalConfig}
      configOverride={null}
      adapter={adapter}
      dataMapper={dataMapper}
    />
  );
}
