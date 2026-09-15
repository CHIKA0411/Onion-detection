import React from 'react';
import { ShieldCheck, Edit3, CheckCircle2, Clock } from 'lucide-react';
import type { AuditLogEntry } from '../types';
import type { UIStrings } from '../data/translations';

interface AuditTrailScreenProps {
  logs: AuditLogEntry[];
  labels: UIStrings;
}

export const AuditTrailScreen: React.FC<AuditTrailScreenProps> = ({ logs, labels }) => {
  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <ShieldCheck size={16} />
          <span>IMMUTABLE AUDIT LEDGER • GOVERNMENT ACCOUNTABILITY LOG</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.auditTrailTitle}
        </h1>
      </div>

      {/* Notice Banner */}
      <div className="moa-card-linen" style={{ border: '1.5px solid var(--accent-leaf-green)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="var(--accent-leaf-green-hover)" />
          <div>
            <strong style={{ fontSize: '0.92rem', color: 'var(--text-earth-dark)' }}>
              Tamper-Evident Inspection Ledger (SIH26031 Standard)
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
              Every AI prediction, manual inspector override, and lot certification decision is timestamped and cryptographically logged for full government accountability.
            </p>
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="moa-card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {logs.map((entry) => (
            <div
              key={entry.id}
              style={{
                backgroundColor: entry.actionType === 'CLASSIFICATION_OVERRIDDEN' ? 'var(--accent-terracotta-light)' : 'var(--bg-linen-light)',
                border: entry.actionType === 'CLASSIFICATION_OVERRIDDEN' ? '1.5px solid var(--accent-terracotta)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem 1.15rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div style={{ flex: 1, minWidth: '240px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                  {entry.actionType === 'CLASSIFICATION_OVERRIDDEN' ? (
                    <span className="badge-terracotta">
                      <Edit3 size={13} />
                      CLASSIFICATION OVERRIDDEN
                    </span>
                  ) : (
                    <span className="badge-grade-a">
                      <CheckCircle2 size={13} />
                      {entry.actionType}
                    </span>
                  )}

                  <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                    <Clock size={12} />
                    <span>{entry.timestamp}</span>
                  </span>
                </div>

                <h4 style={{ fontSize: '1rem', color: 'var(--text-earth-dark)', margin: '0 0 0.25rem 0' }}>
                  Lot ID: {entry.lotNumber}
                </h4>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-earth-brown)', margin: 0, lineHeight: 1.4 }}>
                  {entry.details}
                </p>

                {entry.previousValue && (
                  <div style={{ fontSize: '0.78rem', color: 'var(--accent-terracotta-dark)', fontWeight: 700, marginTop: '0.35rem' }}>
                    Changed from "{entry.previousValue}" → "{entry.newValue}"
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.78rem', color: 'var(--text-earth-light)' }}>
                <div style={{ fontWeight: 700, color: 'var(--text-earth-dark)' }}>{entry.inspectorName}</div>
                <div>ID: {entry.inspectorId}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
