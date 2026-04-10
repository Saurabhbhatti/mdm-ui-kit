import React, { useEffect, useMemo, useState } from 'react';
import {
  DashboardLayout,
  ErrorBoundary,
  MasterModule,
  MasterProvider
} from '../src/index.js';

const MODULES = {
  '/module/category': 'category',
  '/module/product': 'product',
  '/module/workstation': 'workstation',
  '/module/resource': 'resource',
  '/module/warehouse': 'warehouse',
  '/module/inventory': 'inventory'
};

function getModuleType(pathname) {
  return MODULES[pathname] ?? 'category';
}

const productOverride = {
  fields: [
    {
      name: 'name',
      label: 'Product Name'
    },
    {
      name: 'unit',
      label: 'UOM',
      validation: {
        required: true
      }
    },
    {
      name: 'minStock',
      hidden: true
    },
    {
      name: 'region',
      label: 'Region',
      apiKey: 'region_code',
      type: 'dropdown',
      validation: { required: true },
      options: [
        { label: 'India', value: 'IN' },
        { label: 'Europe', value: 'EU' },
        { label: 'USA', value: 'US' }
      ]
    },
    {
      name: 'gst',
      label: 'GST',
      apiKey: 'gst_number',
      type: 'text',
      validation: { required: true },
      validate: (value) => {
        if (!value) {
          return 'GST is required.';
        }

        return String(value).length === 15 ? true : 'GST must be 15 characters.';
      }
    }
  ],
  columns: [
    { key: 'name', label: 'Product Name' },
    { key: 'code', label: 'Product Code' },
    { key: 'unit', label: 'UOM' },
    { key: 'minStock', hidden: true },
    { key: 'region', label: 'Region' },
    { key: 'gst', label: 'GST' }
  ]
};

export default function UsageExample() {
  const [pathname, setPathname] = useState(() => window.location.pathname);

  useEffect(() => {
    const onPopState = () => setPathname(window.location.pathname);

    if (window.location.pathname === '/') {
      window.history.replaceState({}, '', '/module/product');
      setPathname('/module/product');
    }

    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const activeModule = useMemo(() => getModuleType(pathname), [pathname]);

  const handleModuleChange = (type) => {
    const nextPath = `/module/${type}`;
    window.history.pushState({}, '', nextPath);
    setPathname(nextPath);
  };

  return (
    <ErrorBoundary>
      <MasterProvider>
        <DashboardLayout
          activeModule={activeModule}
          onModuleChange={handleModuleChange}
          title="MDM Platform"
          subtitle="Master data administration"
          userName="Admin User"
          userRole="Administrator"
        >
          <MasterModule
            type={activeModule}
            configOverride={activeModule === 'product' ? productOverride : null}
          />
        </DashboardLayout>
      </MasterProvider>
    </ErrorBoundary>
  );
}
