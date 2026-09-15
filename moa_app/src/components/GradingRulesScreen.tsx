import React, { useState } from 'react';
import { Sliders, Save, ShieldCheck } from 'lucide-react';
import type { GradingRules } from '../types';
import type { UIStrings } from '../data/translations';

interface GradingRulesScreenProps {
  rules: GradingRules;
  onUpdateRules: (newRules: GradingRules) => void;
  labels: UIStrings;
}

export const GradingRulesScreen: React.FC<GradingRulesScreenProps> = ({
  rules,
  onUpdateRules,
  labels: _labels,
}) => {
  const [minGradeA, setMinGradeA] = useState(rules.gradeAMinPercentage);
  const [maxUrs, setMaxUrs] = useState(rules.ursMaxPercentage);
  const [undersizedMm, setUndersizedMm] = useState(rules.undersizedMaxDiameterMm);
  const [maxRot, setMaxRot] = useState(rules.rotMaxThresholdPercentage);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveRules = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: GradingRules = {
      ...rules,
      gradeAMinPercentage: minGradeA,
      ursMaxPercentage: maxUrs,
      undersizedMaxDiameterMm: undersizedMm,
      rotMaxThresholdPercentage: maxRot,
      lastUpdated: new Date().toISOString().split('T')[0],
      updatedBy: 'NAFED Center Superintendent',
    };
    onUpdateRules(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <Sliders size={16} />
          <span>CONFIGURABLE POLICY ENGINE • SIH26031</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          Procurement Center Grading Rules & Thresholds
        </h1>
      </div>

      {/* Rules Notice */}
      <div className="moa-card-linen" style={{ border: '1.5px solid var(--accent-terracotta)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="var(--accent-terracotta-dark)" />
          <div>
            <strong style={{ fontSize: '0.92rem', color: 'var(--text-earth-dark)' }}>
              Configurable Rules Engine Active ({rules.centerName})
            </strong>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
              Grading thresholds can be adjusted per procurement hub according to seasonal Department of Consumer Affairs policy mandates.
            </p>
          </div>
        </div>
      </div>

      {/* Save Success Alert */}
      {savedSuccess && (
        <div style={{ backgroundColor: 'var(--accent-leaf-light)', border: '1.5px solid var(--accent-leaf-green)', padding: '0.85rem 1.15rem', borderRadius: 'var(--radius-md)', color: 'var(--accent-leaf-green-hover)', fontWeight: 700, fontSize: '0.88rem' }}>
          ✓ Grading policy thresholds updated successfully! Rule version incremented.
        </div>
      )}

      {/* Form Card */}
      <div className="moa-card">
        <form onSubmit={handleSaveRules} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'block' }}>
                Minimum Grade A Target (%)
              </label>
              <input
                type="number"
                min={50}
                max={100}
                value={minGradeA}
                onChange={(e) => setMinGradeA(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-earth-dark)',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)' }}>
                Current Requirement: Lot must have ≥ {minGradeA}% Grade A onions.
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'block' }}>
                Maximum URS Tolerance (%)
              </label>
              <input
                type="number"
                min={0}
                max={40}
                value={maxUrs}
                onChange={(e) => setMaxUrs(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-earth-dark)',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)' }}>
                Maximum allowable Undersized/Rotten/Sprouted rate (≤ {maxUrs}%).
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'block' }}>
                Undersized Cutoff Diameter (mm)
              </label>
              <input
                type="number"
                min={20}
                max={50}
                value={undersizedMm}
                onChange={(e) => setUndersizedMm(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-earth-dark)',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)' }}>
                Onions with diameter &lt; {undersizedMm}mm classified as Undersized.
              </span>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'block' }}>
                Max Rot Limit (%)
              </label>
              <input
                type="number"
                min={0}
                max={15}
                value={maxRot}
                onChange={(e) => setMaxRot(Number(e.target.value))}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '1rem',
                  fontWeight: 700,
                  color: 'var(--text-earth-dark)',
                }}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)' }}>
                Strict rot cutoff (≤ {maxRot}%).
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button
              type="submit"
              className="btn-leaf-green"
              style={{ padding: '0.85rem 2rem', fontSize: '0.95rem' }}
            >
              <Save size={18} />
              <span>Save Policy Rules</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
