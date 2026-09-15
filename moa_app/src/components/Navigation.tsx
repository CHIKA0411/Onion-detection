import React from 'react';
import { LayoutDashboard, Camera, FileText, Sliders, ShieldCheck, RefreshCw, BookOpen, User } from 'lucide-react';
import type { UIStrings } from '../data/translations';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  labels: UIStrings;
  isMobileSimulator: boolean;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  labels,
  isMobileSimulator,
}) => {
  const navItems = [
    { id: 'home', label: labels.navDashboard, icon: LayoutDashboard },
    { id: 'scan', label: labels.navNewScan, icon: Camera },
    { id: 'audit', label: labels.navAuditTrail, icon: ShieldCheck },
    { id: 'rules', label: labels.navRules, icon: Sliders },
    { id: 'reports', label: labels.navReports, icon: FileText },
    { id: 'sync', label: labels.navSyncQueue, icon: RefreshCw },
    { id: 'sop', label: labels.navSopHelp, icon: BookOpen },
    { id: 'profile', label: labels.navProfile, icon: User },
  ];

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <nav style={{
        backgroundColor: 'var(--surface-white)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: 'var(--shadow-sm)',
        display: isMobileSimulator ? 'none' : 'block',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          padding: '0 0.5rem',
          overflowX: 'auto',
        }}>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.85rem 1rem',
                  background: 'none',
                  border: 'none',
                  borderBottom: isActive ? '3px solid var(--accent-leaf-green)' : '3px solid transparent',
                  color: isActive ? 'var(--text-earth-dark)' : 'var(--text-earth-light)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.9rem',
                  whiteSpace: 'nowrap',
                  transition: 'all 0.2s ease',
                }}
              >
                <IconComponent size={18} color={isActive ? 'var(--accent-leaf-green)' : 'var(--text-earth-light)'} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'var(--text-earth-brown)',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        display: isMobileSimulator ? 'flex' : 'none',
        justifyContent: 'space-around',
        alignItems: 'center',
        padding: '0.4rem 0.2rem',
        zIndex: 1000,
        boxShadow: '0 -4px 16px rgba(0,0,0,0.15)',
      }}>
        {navItems.slice(0, 6).map((item) => {
          const IconComponent = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.15rem',
                background: 'none',
                border: 'none',
                color: isActive ? 'var(--accent-terracotta-light)' : 'rgba(255,255,255,0.7)',
                padding: '0.3rem 0.4rem',
                borderRadius: 'var(--radius-sm)',
                minWidth: '48px',
              }}
            >
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <IconComponent size={19} color={isActive ? 'var(--accent-terracotta-light)' : 'rgba(255,255,255,0.7)'} />
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    bottom: '-4px',
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-terracotta-light)',
                  }} />
                )}
              </div>
              <span style={{ fontSize: '0.65rem', fontWeight: isActive ? 700 : 400 }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
};
