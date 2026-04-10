# @company/master-data-ui Architecture

## Overview

`@company/master-data-ui` is a reusable React library for enterprise master data management in manufacturing systems.

It is designed as a config-driven platform with:

- a shared dashboard shell
- dynamic module resolution
- pluggable adapters
- reusable UI components
- centralized validation
- cache-backed data loading
- localStorage fallback for offline persistence

The core goal is to let each consuming app extend behavior without modifying the library source.

## High-Level Flow

1. The app renders `<MasterProvider />`.
2. The provider injects theme, adapter registry, and runtime context.
3. `<MasterModule type="product" />` resolves a module config from the registry.
4. `<GenericModule />` resolves the active adapter.
5. The module loads records through the adapter.
6. Records are cached by module type.
7. The UI renders `<DynamicForm />` and `<DataTable />`.
8. Create, update, delete, import, and export operations go through the adapter.

## Core Layers

### 1. Provider Layer

Location:

- [src/providers/MasterProvider.jsx](src/providers/MasterProvider.jsx)
- [src/providers/MasterContext.jsx](src/providers/MasterContext.jsx)
- [src/providers/masterRuntime.js](src/providers/masterRuntime.js)

Responsibilities:

- provide theme tokens
- merge custom adapters with defaults
- expose runtime access to adapters
- hydrate the initial store bundle
- keep legacy storage behavior compatible

### 2. Module Resolution Layer

Location:

- [src/MasterModule.jsx](src/MasterModule.jsx)
- [src/registry/moduleRegistry.js](src/registry/moduleRegistry.js)

Responsibilities:

- accept a `type`
- resolve the base config
- merge overrides
- resolve the adapter for the module
- pass a clean config into the generic engine

### 3. Generic Module Engine

Location:

- [src/GenericModule.jsx](src/GenericModule.jsx)

Responsibilities:

- load module records
- read from cache first
- fall back to adapter fetch
- sync records into the Zustand store
- handle create / update / delete
- handle import / export
- show loading and error states

### 4. Adapter Layer

Location:

- [src/adapters/adapterRegistry.js](src/adapters/adapterRegistry.js)
- [src/adapters/localStorageAdapter.js](src/adapters/localStorageAdapter.js)
- [src/adapters/categoryAdapter.js](src/adapters/categoryAdapter.js)

Responsibilities:

- define a standard async CRUD contract
- transform API payloads to UI payloads
- transform UI payloads to API payloads
- support optional `import()` and `export()`
- provide a localStorage fallback when no adapter is registered

Standard adapter shape:

```js
{
  getList(context),
  getById(id, context),
  create(data, context),
  update(id, data, context),
  delete(id, context),
  import?(data, context),
  export?(context)
}
```

### 5. Cache Layer

Location:

- [src/utils/cacheManager.js](src/utils/cacheManager.js)

Responsibilities:

- store records in memory per module type
- optionally persist cache to localStorage
- return cached records before network fetch
- clear cache after create / update / delete / import

Cache keys follow the module pattern:

- `module:category`
- `module:product`
- `module:warehouse`

### 6. Store Layer

Location:

- [src/store/masterDataStore.js](src/store/masterDataStore.js)

Responsibilities:

- hold the active bundle in Zustand
- expose module-level record operations
- keep the UI reactive
- support import / export and reset flows

### 7. UI Components

Location:

- [src/components/DynamicForm/DynamicForm.jsx](src/components/DynamicForm/DynamicForm.jsx)
- [src/components/DataTable/DataTable.jsx](src/components/DataTable/DataTable.jsx)
- [src/components/Modal/Modal.jsx](src/components/Modal/Modal.jsx)
- [src/components/Layout/DashboardLayout.jsx](src/components/Layout/DashboardLayout.jsx)
- [src/components/ErrorBoundary.jsx](src/components/ErrorBoundary.jsx)

Responsibilities:

- render reusable forms
- render searchable and sortable tables
- provide a modal shell
- provide the dashboard layout
- catch runtime failures and show a fallback UI

## Data Flow

### Read Flow

1. `GenericModule` requests records for the active module.
2. It checks `cacheManager` for cached records.
3. If cached data exists, the table renders immediately.
4. Otherwise the module calls the adapter’s `getList()`.
5. The adapter returns UI-safe records.
6. Records are stored in cache and mirrored into the Zustand store.

### Write Flow

1. The user submits the form.
2. `DynamicForm` validates all fields.
3. `GenericModule` calls adapter `create()` or `update()`.
4. The adapter transforms UI data into API data.
5. The module clears the cache for that module type.
6. The module reloads the data.

### Delete Flow

1. The user clicks Delete.
2. `GenericModule` calls adapter `delete()`.
3. The cache for that module is cleared.
4. The module reloads records.

### Import / Export Flow

1. Export calls adapter `export()` if available.
2. Import validates the JSON structure.
3. Import calls adapter `import()` if available.
4. Cache is invalidated after import.

## Configuration Model

Modules are described with config factories and can be overridden per app.

Common config sections:

- `type`
- `moduleName`
- `displayName`
- `description`
- `fields`
- `columns`
- `permissions`
- `defaultValues`
- `pageSize`
- `searchable`
- `sortable`

Field-level config can include:

- `name`
- `apiKey`
- `label`
- `type`
- `options`
- `render`
- `validate`
- `validation`

Column config can include:

- `key`
- `apiKey`
- `label`
- `sortable`
- `searchable`
- `render`
- `resolveValue`

## Extension Points

### Add a New Module

1. Create a config factory.
2. Register it in `moduleRegistry`.
3. Add an adapter if the module should use API data.
4. Render it with `<MasterModule type="your-type" />`.

### Add a Custom Adapter

Pass adapters into the provider:

```jsx
<MasterProvider adapters={{ category: customCategoryAdapter }}>
  <App />
</MasterProvider>
```

### Override Module Fields

Use `configOverride` on `MasterModule`:

```jsx
<MasterModule type="product" configOverride={productOverride} />
```

### Add Validation

Use field-level `validate` or the global validation utility.

### Add UI Customization

Use `render` on a field to replace the default input.

## Performance Strategy

- cache records by module type
- use debounced search in tables
- memoize `DataTable` and `DynamicForm`
- minimize unnecessary store writes
- keep adapter lookups stable

## Error Handling Strategy

- wrap the app with `ErrorBoundary`
- catch adapter failures with `try / catch`
- show module-level error messages
- preserve a safe empty state when data cannot load

## Backward Compatibility

The library preserves older flows by:

- keeping localStorage as the fallback adapter
- keeping module config overrides supported
- keeping existing hooks and exports intact
- keeping the dashboard shell and module API stable

## Recommended Usage

```jsx
import {
  ErrorBoundary,
  MasterProvider,
  MasterModule,
  DashboardLayout
} from '@company/master-data-ui';

export default function App() {
  return (
    <ErrorBoundary>
      <MasterProvider>
        <DashboardLayout activeModule="product" onModuleChange={() => {}}>
          <MasterModule type="product" />
        </DashboardLayout>
      </MasterProvider>
    </ErrorBoundary>
  );
}
```

## Summary

This architecture keeps the UI generic, the data layer pluggable, and the system scalable for enterprise master data applications.
