import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, CloudUpload } from 'lucide-react';
import type { SyncQueueItem } from '../types';
import type { UIStrings } from '../data/translations';

interface SyncQueueScreenProps {
  queue: SyncQueueItem[];
  labels: UIStrings;
  onSyncNow: () => void;
}

export const SyncQueueScreen: React.FC<SyncQueueScreenProps> = ({ queue, labels, onSyncNow }) => {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleTriggerSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncNow();
    }, 1500);
  };

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <RefreshCw size={16} />
          <span>OFFLINE-FIRST SYNCHRONIZATION MANAGER • TFLITE LOCAL DB</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.syncQueueTitle}
        </h1>
      </div>

      {/* Sync Status Banner */}
      <div className="moa-card-linen" style={{ border: '1.5px solid var(--accent-leaf-green)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-leaf-light)',
            color: 'var(--accent-leaf-green-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <CloudUpload size={24} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', color: 'var(--text-earth-dark)', margin: 0 }}>
              On-Device TFLite Queue Status
            </h3>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-earth-light)' }}>
              Scans are executed 100% on-device offline and auto-queued for central cloud database sync.
            </span>
          </div>
        </div>

        <button
          onClick={handleTriggerSync}
          className="btn-leaf-green"
          style={{ padding: '0.75rem 1.5rem' }}
          disabled={isSyncing}
        >
          <RefreshCw size={18} className={isSyncing ? 'pulse-green' : ''} />
          <span>{isSyncing ? 'Syncing Queue...' : labels.syncAllNow}</span>
        </button>
      </div>

      {/* Queue Items List */}
      <div className="moa-card">
        <h3 style={{ fontSize: '1.1rem', color: 'var(--text-earth-dark)', marginBottom: '1rem' }}>
          Queued Lot Scans ({queue.length})
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {queue.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: 'var(--bg-linen-light)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span className={item.syncStatus === 'synced' ? 'badge-grade-a' : 'badge-terracotta'}>
                    {item.syncStatus.toUpperCase()}
                  </span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)' }}>
                    {item.timestamp}
                  </span>
                </div>
                <h4 style={{ fontSize: '1.05rem', color: 'var(--text-earth-dark)', margin: '0 0 0.2rem 0' }}>
                  Lot #{item.lotNumber}
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-earth-light)' }}>
                  Total Onions: {item.totalOnions} | Grade A Rate: {item.gradeAPercentage}% | Size: {(item.fileSizeBytes / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>

              {item.syncStatus === 'synced' ? (
                <div style={{ color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <CheckCircle2 size={18} />
                  <span>Synced to Cloud</span>
                </div>
              ) : (
                <button
                  onClick={handleTriggerSync}
                  className="btn-outline-brown"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}
                >
                  <span>Sync Now</span>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
