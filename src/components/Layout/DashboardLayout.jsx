import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getModuleConfig, getModuleTypes } from '../../registry/moduleRegistry.js';
import { BrandMark, ChevronDownIcon, ChevronUpIcon, LogOutIcon, MenuIcon, ModuleIcon, UserIcon } from '../icons/index.js';

function getModuleLabel(type) {
  const config = getModuleConfig(type);
  return config?.displayName || config?.moduleName || type;
}

export default function DashboardLayout({
  activeModule,
  onModuleChange,
  title = 'Master Data',
  subtitle = 'Config-driven manufacturing dashboard',
  children,
  userName = 'Admin User',
  userRole = 'Administrator',
  onProfileClick,
  onLogout
}) {
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);
  const types = getModuleTypes();
  const activeConfig = getModuleConfig(activeModule);

  const headerTitle = useMemo(() => activeConfig?.displayName || getModuleLabel(activeModule), [activeModule, activeConfig]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setProfileOpen(false);
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, []);

  return (
    <div className={`mdm-dashboard ${collapsed ? 'mdm-dashboard--collapsed' : ''}`.trim()}>
      <aside className="mdm-sidebar" aria-label="Sidebar navigation">
        <div className="mdm-sidebar__brand">
          <div className="mdm-sidebar__logo" aria-hidden="true">
            <BrandMark className="mdm-sidebar__brandIcon" />
          </div>
          {!collapsed ? (
            <div className="mdm-sidebar__brandText">
              <strong>MDM Platform</strong>
              <span>{subtitle}</span>
            </div>
          ) : null}
        </div>

        {!collapsed ? <div className="mdm-sidebar__divider" aria-hidden="true" /> : null}

        <nav className="mdm-sidebar__nav">
          {types.map((type) => {
            const config = getModuleConfig(type);
            const label = config?.displayName || getModuleLabel(type);
            const icon = config?.icon || type;

            return (
              <button
                key={type}
                type="button"
                className={`mdm-sidebar__item ${activeModule === type ? 'is-active' : ''}`.trim()}
                onClick={() => onModuleChange?.(type)}
                title={label}
                aria-current={activeModule === type ? 'page' : undefined}
              >
                <ModuleIcon name={icon} className="mdm-sidebar__itemIcon" />
                {!collapsed ? <span>{label}</span> : null}
              </button>
            );
          })}
        </nav>
      </aside>

      <div className="mdm-dashboard__main">
        <header className="mdm-header">
          <button
            className="mdm-iconButton mdm-header__sidebarToggle"
            type="button"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <MenuIcon className="mdm-icon--button" />
          </button>

          <div className="mdm-header__actions">
            <div className="mdm-profileMenu" ref={profileRef}>
              <button
                className="mdm-profile"
                type="button"
                onClick={() => setProfileOpen((value) => !value)}
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >
                <span className="mdm-profile__avatar">{userName.charAt(0)}</span>
                <span className="mdm-profile__meta">
                  <strong>{userName}</strong>
                  <small>{userRole}</small>
                </span>
                {profileOpen ? <ChevronUpIcon className="mdm-profile__chevron" /> : <ChevronDownIcon className="mdm-profile__chevron" />}
              </button>

              {profileOpen ? (
                <div className="mdm-profileMenu__dropdown" role="menu" aria-label="Profile actions">
                  <button className="mdm-profileMenu__item" type="button" onClick={() => { setProfileOpen(false); onProfileClick?.(); }}>
                    <UserIcon className="mdm-profileMenu__icon" />
                    <span>Profile</span>
                  </button>
                  <button className="mdm-profileMenu__item mdm-profileMenu__item--danger" type="button" onClick={() => { setProfileOpen(false); onLogout?.(); }}>
                    <LogOutIcon className="mdm-profileMenu__icon" />
                    <span>Logout</span>
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <main className="mdm-content">{children}</main>
      </div>
    </div>
  );
}
