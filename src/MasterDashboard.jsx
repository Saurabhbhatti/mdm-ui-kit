import React, { useState } from 'react';
import { getModuleTypes } from './registry/moduleRegistry.js';
import DashboardLayout from './components/Layout/DashboardLayout.jsx';
import MasterModule from './MasterModule.jsx';
import { MasterProvider } from './providers/index.js';

export default function MasterDashboard({
  initialModule,
  title = 'Master Data Platform',
  subtitle = 'SaaS-style manufacturing operations console',
  userName = 'Admin User',
  userRole = 'Administrator',
  adapters = {}
}) {
  const defaultModule = initialModule || getModuleTypes()[0] || 'product';
  const [activeModule, setActiveModule] = useState(defaultModule);

  return (
    <MasterProvider adapters={adapters}>
      <DashboardLayout
        activeModule={activeModule}
        onModuleChange={setActiveModule}
        title={title}
        subtitle={subtitle}
        userName={userName}
        userRole={userRole}
      >
        <MasterModule type={activeModule} />
      </DashboardLayout>
    </MasterProvider>
  );
}
