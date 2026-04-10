import React, { useMemo, useState } from 'react';
import {
  MasterProvider,
  MasterModule,
  DashboardLayout,
  getModuleTypes,
  useMasterDataBundle
} from '../../src/index.js';

function Summary() {
  const bundle = useMasterDataBundle();

  const summary = useMemo(
    () =>
      Object.entries(bundle).map(([type, records]) => ({
        type,
        count: Array.isArray(records) ? records.length : 0
      })),
    [bundle]
  );

  return (
    <div className="demo-summary">
      {summary.map((item) => (
        <div key={item.type} className="demo-summary__card">
          <span>{item.type}</span>
          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [activeModule, setActiveModule] = useState(getModuleTypes()[0] || 'product');

  return (
    <MasterProvider>
      <DashboardLayout
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        title="Master Data Platform"
        subtitle="SaaS-style manufacturing operations console"
      >
        <div className="mdm-card mdm-card--module" style={{ marginBottom: 18 }}>
          <div className="mdm-module__header">
            <div>
              <p className="mdm-module__eyebrow">Overview</p>
              <h2 className="mdm-module__title">Module Snapshot</h2>
              <p className="mdm-module__description">Live counts from the current master data bundle.</p>
            </div>
            <Summary />
          </div>
        </div>

        <MasterModule type={activeModule} />
      </DashboardLayout>
    </MasterProvider>
  );
}
