import React from 'react';
import { Bell, RefreshCw } from 'lucide-react';
import type { NotificationItem } from '../types';
import type { UIStrings } from '../data/translations';

interface NotificationsScreenProps {
  notifications: NotificationItem[];
  labels: UIStrings;
  onNavigateToSync: () => void;
}

export const NotificationsScreen: React.FC<NotificationsScreenProps> = ({
  notifications,
  labels: _labels,
  onNavigateToSync,
}) => {
  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <Bell size={16} />
          <span>PROCUREMENT ALERTS & NOTIFICATION CENTER</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          System Alerts & Sync Notifications
        </h1>
      </div>

      {/* Notifications List */}
      <div className="moa-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {notifications.map((n) => (
            <div
              key={n.id}
              style={{
                backgroundColor: n.type === 'sync_alert' ? 'var(--accent-terracotta-light)' : 'var(--bg-linen-light)',
                border: n.type === 'sync_alert' ? '1.5px solid var(--accent-terracotta)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span className={n.type === 'sync_alert' ? 'badge-terracotta' : 'badge-grade-a'}>
                    {n.type.replace('_', ' ').toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)' }}>
                    {n.timestamp}
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', color: 'var(--text-earth-dark)', margin: '0 0 0.25rem 0' }}>
                  {n.title}
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-earth-brown)', margin: 0, lineHeight: 1.4 }}>
                  {n.message}
                </p>
              </div>

              {n.type === 'sync_alert' && (
                <button
                  onClick={onNavigateToSync}
                  className="btn-leaf-green"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem', backgroundColor: 'var(--accent-terracotta)' }}
                >
                  <RefreshCw size={14} />
                  <span>Sync Queue</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
