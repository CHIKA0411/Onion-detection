import React, { useState } from 'react';
import { Edit3, CheckCircle2, ShieldCheck, X } from 'lucide-react';
import type { DetectedOnion, OnionCondition } from '../types';
import type { UIStrings } from '../data/translations';

interface ManualOverrideScreenProps {
  onion: DetectedOnion | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveOverride: (onionId: string, newCondition: OnionCondition, reason: string) => void;
  labels: UIStrings;
}

export const ManualOverrideScreen: React.FC<ManualOverrideScreenProps> = ({
  onion,
  isOpen,
  onClose,
  onSaveOverride,
  labels: _labels,
}) => {
  const [selectedCondition, setSelectedCondition] = useState<OnionCondition>(onion?.condition || 'grade_a');
  const [overrideReason, setOverrideReason] = useState<string>('Superficial scale tear only, bulb firm and healthy');

  if (!isOpen || !onion) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveOverride(onion.id, selectedCondition, overrideReason);
    onClose();
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(50, 38, 31, 0.75)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2500,
      padding: '1rem',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: 'var(--surface-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: 'var(--shadow-lg)',
        border: '2px solid var(--accent-terracotta)',
        position: 'relative',
      }} className="animate-fade-in">
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-earth-light)' }}
        >
          <X size={22} />
        </button>

        {/* Header */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--accent-terracotta)', fontSize: '0.78rem', fontWeight: 700 }}>
            <Edit3 size={15} />
            <span>HUMAN-IN-THE-LOOP INSPECTOR OVERRIDE (SIH26031)</span>
          </div>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--text-earth-dark)', margin: '0.15rem 0 0 0' }}>
            Override Onion Crop #{onion.onionIndex} AI Classification
          </h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-earth-light)' }}>
            AI Model Prediction: <strong>{onion.condition.replace('_', ' ').toUpperCase()}</strong> ({Math.round(onion.confidence)}% Confidence)
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-earth-dark)', marginBottom: '0.5rem', display: 'block' }}>
              Select Corrected Condition Category:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.65rem' }}>
              {[
                { id: 'grade_a', label: 'Grade A (Healthy)' },
                { id: 'damaged', label: 'Damaged' },
                { id: 'rotten', label: 'Neck/Basal Rot' },
                { id: 'sprouted', label: 'Sprouted' },
                { id: 'undersized', label: 'Undersized (<35mm)' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSelectedCondition(opt.id as OnionCondition)}
                  style={{
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: selectedCondition === opt.id ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-subtle)',
                    backgroundColor: selectedCondition === opt.id ? 'var(--accent-terracotta-light)' : 'var(--bg-linen)',
                    color: 'var(--text-earth-dark)',
                    fontWeight: selectedCondition === opt.id ? 700 : 500,
                    fontSize: '0.82rem',
                    textAlign: 'left',
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'block' }}>
              Inspector Override Rationale (Mandatory for Audit Trail):
            </label>
            <textarea
              required
              rows={3}
              value={overrideReason}
              onChange={(e) => setOverrideReason(e.target.value)}
              style={{
                width: '100%',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-strong)',
                fontSize: '0.85rem',
                color: 'var(--text-earth-dark)',
              }}
            />
          </div>

          <div style={{
            backgroundColor: 'var(--bg-linen)',
            padding: '0.75rem',
            borderRadius: 'var(--radius-sm)',
            fontSize: '0.75rem',
            color: 'var(--text-earth-light)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}>
            <ShieldCheck size={16} color="var(--accent-leaf-green)" />
            <span>This override will be timestamped and permanently logged in the Audit Ledger.</span>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="btn-leaf-green"
              style={{ flex: 1, backgroundColor: 'var(--accent-terracotta)' }}
            >
              <CheckCircle2 size={18} />
              <span>Commit Override</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="btn-outline-brown"
              style={{ flex: 1 }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
