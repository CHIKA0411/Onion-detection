import React from 'react';
import { ShieldCheck, CheckCircle2, XCircle, AlertTriangle, FileText } from 'lucide-react';
import type { LotScan, GradingRules } from '../types';
import type { UIStrings } from '../data/translations';

interface GradingSummaryScreenProps {
  scan: LotScan;
  rules: GradingRules;
  labels: UIStrings;
  onNavigateToReports: () => void;
  onNavigateToAudit: () => void;
}

export const GradingSummaryScreen: React.FC<GradingSummaryScreenProps> = ({
  scan,
  rules,
  labels,
  onNavigateToReports,
  onNavigateToAudit,
}) => {
  const isAccepted = scan.gradeAPercentage >= rules.gradeAMinPercentage && scan.ursPercentage <= rules.ursMaxPercentage;

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <ShieldCheck size={16} />
          <span>LOT BATCH GRADING SUMMARY & CERTIFICATION CALCULATOR</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.lotSummaryTitle}
        </h1>
      </div>

      {/* Main Certification Result Status Card */}
      <div
        className="moa-card"
        style={{
          border: isAccepted ? '2px solid var(--accent-leaf-green)' : '2px solid #EF4444',
          backgroundColor: isAccepted ? 'var(--accent-leaf-light)' : '#FEE2E2',
          padding: '1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            backgroundColor: isAccepted ? 'var(--accent-leaf-green)' : '#DC2626',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            {isAccepted ? <CheckCircle2 size={36} /> : <XCircle size={36} />}
          </div>

          <div>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px', color: isAccepted ? 'var(--accent-leaf-green-hover)' : '#991B1B' }}>
              OFFICIAL DECISION: {isAccepted ? 'GRADE A ACCEPTED' : 'REJECTED - HIGH DEFECT RATE'}
            </span>
            <h2 style={{ fontSize: '1.4rem', color: isAccepted ? 'var(--accent-leaf-green-hover)' : '#991B1B', margin: '0.15rem 0' }}>
              Lot #{scan.lotNumber}
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-dark)' }}>
              Center: {scan.procurementCenter} | Timestamp: {scan.timestamp}
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={onNavigateToReports}
            className="btn-leaf-green"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <FileText size={18} />
            <span>Generate PDF Certificate</span>
          </button>
        </div>
      </div>

      {/* Grade A % vs URS % Key Gauges Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1.25rem',
      }}>
        {/* Gauge 0: Total Onions Counted */}
        <div className="moa-card" style={{ borderLeft: '5px solid var(--text-earth-dark)' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)', fontWeight: 700, display: 'block' }}>
            Total Onions Counted
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--text-earth-dark)', lineHeight: 1.1, margin: '0.3rem 0' }}>
            {scan.totalOnions} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>Units</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
            Scanned via YOLOv8-seg instance segmentation.
          </p>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-earth-light)', marginTop: '0.75rem', display: 'block' }}>
            Batch Mode: {scan.scanMode.replace('_', ' ').toUpperCase()}
          </span>
        </div>

        {/* Gauge 1: Grade A Rate */}
        <div className="moa-card" style={{ borderLeft: '5px solid var(--accent-leaf-green)' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)', fontWeight: 700, display: 'block' }}>
            Grade A Healthy Count
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-leaf-green-hover)', lineHeight: 1.1, margin: '0.3rem 0' }}>
            {scan.gradeACount} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>({scan.gradeAPercentage}%)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
            {scan.gradeACount} out of {scan.totalOnions} onions passed Grade A specifications.
          </p>
          <div style={{ marginTop: '0.75rem', backgroundColor: 'var(--bg-linen)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${scan.gradeAPercentage}%`, height: '100%', backgroundColor: 'var(--accent-leaf-green)' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-earth-light)', marginTop: '0.35rem', display: 'block' }}>
            Target Benchmark: Min {rules.gradeAMinPercentage}%
          </span>
        </div>

        {/* Gauge 2: URS Defect Rate */}
        <div className="moa-card" style={{ borderLeft: '5px solid var(--accent-terracotta)' }}>
          <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)', fontWeight: 700, display: 'block' }}>
            URS Defect Count
          </span>
          <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-terracotta-dark)', lineHeight: 1.1, margin: '0.3rem 0' }}>
            {scan.ursCount} <span style={{ fontSize: '1.1rem', fontWeight: 600 }}>({scan.ursPercentage}%)</span>
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
            {scan.ursCount} out of {scan.totalOnions} onions flagged with URS defects.
          </p>
          <div style={{ marginTop: '0.75rem', backgroundColor: 'var(--bg-linen)', height: '10px', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{ width: `${scan.ursPercentage}%`, height: '100%', backgroundColor: 'var(--accent-terracotta)' }} />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-earth-light)', marginTop: '0.35rem', display: 'block' }}>
            Maximum Tolerance: Max {rules.ursMaxPercentage}%
          </span>
        </div>
      </div>

      {/* Defect Category Breakdown Grid */}
      <div className="moa-card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-earth-dark)', marginBottom: '1rem' }}>
          {labels.defectBreakdown} (Individual Counts & Percentages)
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
        }}>
          <div style={{ backgroundColor: 'var(--accent-leaf-light)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--accent-leaf-green)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-leaf-green-hover)', display: 'block', fontWeight: 700 }}>Grade A (Healthy)</span>
            <strong style={{ fontSize: '1.4rem', color: 'var(--accent-leaf-green-hover)', display: 'block' }}>
              {scan.defectBreakdown.gradeA} / {scan.totalOnions} Units
            </strong>
            <span style={{ fontSize: '0.75rem', color: 'var(--accent-leaf-green-hover)' }}>
              ({scan.totalOnions > 0 ? ((scan.defectBreakdown.gradeA / scan.totalOnions) * 100).toFixed(1) : 0}%)
            </span>
          </div>

          <div style={{ backgroundColor: '#FEF3C7', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #F59E0B' }}>
            <span style={{ fontSize: '0.78rem', color: '#92400E', display: 'block', fontWeight: 700 }}>Mechanically Damaged</span>
            <strong style={{ fontSize: '1.4rem', color: '#92400E', display: 'block' }}>
              {scan.defectBreakdown.damaged} / {scan.totalOnions} Units
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#92400E' }}>
              ({scan.totalOnions > 0 ? ((scan.defectBreakdown.damaged / scan.totalOnions) * 100).toFixed(1) : 0}%)
            </span>
          </div>

          <div style={{ backgroundColor: '#FEE2E2', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #EF4444' }}>
            <span style={{ fontSize: '0.78rem', color: '#991B1B', display: 'block', fontWeight: 700 }}>Neck / Basal Rot</span>
            <strong style={{ fontSize: '1.4rem', color: '#991B1B', display: 'block' }}>
              {scan.defectBreakdown.rotten} / {scan.totalOnions} Units
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#991B1B' }}>
              ({scan.totalOnions > 0 ? ((scan.defectBreakdown.rotten / scan.totalOnions) * 100).toFixed(1) : 0}%)
            </span>
          </div>

          <div style={{ backgroundColor: '#F3E8FF', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #8B5CF6' }}>
            <span style={{ fontSize: '0.78rem', color: '#6B21A8', display: 'block', fontWeight: 700 }}>Sprouted</span>
            <strong style={{ fontSize: '1.4rem', color: '#6B21A8', display: 'block' }}>
              {scan.defectBreakdown.sprouted} / {scan.totalOnions} Units
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#6B21A8' }}>
              ({scan.totalOnions > 0 ? ((scan.defectBreakdown.sprouted / scan.totalOnions) * 100).toFixed(1) : 0}%)
            </span>
          </div>

          <div style={{ backgroundColor: '#DBEAFE', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid #3B82F6' }}>
            <span style={{ fontSize: '0.78rem', color: '#1E40AF', display: 'block', fontWeight: 700 }}>Undersized (&lt;{rules.undersizedMaxDiameterMm}mm)</span>
            <strong style={{ fontSize: '1.4rem', color: '#1E40AF', display: 'block' }}>
              {scan.defectBreakdown.undersized} / {scan.totalOnions} Units
            </strong>
            <span style={{ fontSize: '0.75rem', color: '#1E40AF' }}>
              ({scan.totalOnions > 0 ? ((scan.defectBreakdown.undersized / scan.totalOnions) * 100).toFixed(1) : 0}%)
            </span>
          </div>
        </div>
      </div>

      {/* Human-in-the-Loop Override Alert */}
      {scan.hasOverrides && (
        <div style={{
          backgroundColor: 'var(--accent-terracotta-light)',
          border: '1.5px solid var(--accent-terracotta)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={22} color="var(--accent-terracotta-dark)" />
            <div>
              <strong style={{ color: 'var(--accent-terracotta-dark)', fontSize: '0.9rem', display: 'block' }}>
                Human-in-the-Loop Inspector Override Recorded
              </strong>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
                1 classification was manually overridden by Inspector {scan.inspectorName}. Logged in Audit Trail.
              </p>
            </div>
          </div>

          <button
            onClick={onNavigateToAudit}
            className="btn-outline-brown"
            style={{ padding: '0.5rem 1rem', fontSize: '0.82rem' }}
          >
            <span>View Audit Log</span>
          </button>
        </div>
      )}
    </div>
  );
};
