import React from 'react';
import {
  Camera,
  ShieldCheck,
  Building,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import type { InspectorProfile, LotScan, GradingRules } from '../types';
import type { UIStrings } from '../data/translations';

interface HomeDashboardProps {
  profile: InspectorProfile;
  recentScans: LotScan[];
  rules: GradingRules;
  labels: UIStrings;
  onNavigateTab: (tab: string) => void;
  onStartNewScan: () => void;
  pendingSyncCount: number;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  profile,
  recentScans,
  rules,
  labels,
  onNavigateTab,
  onStartNewScan,
  pendingSyncCount,
}) => {
  const latestScan = recentScans[0];

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.25rem',
      }}
      className="animate-fade-in"
    >
      {/* 1. Rich Inspector Banner with Vivid Onion Background & Pop */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundImage: `linear-gradient(135deg, rgba(112, 38, 65, 0.92) 0%, rgba(43, 24, 32, 0.88) 100%), url('/onion-bg.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 1.75rem',
          border: '2px solid rgba(112, 38, 65, 0.4)',
          boxShadow: '0 8px 24px rgba(112, 38, 65, 0.25)',
          color: '#FFFFFF',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <span style={{
              fontSize: '0.75rem',
              color: '#4ADE80',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '1px',
              backgroundColor: 'rgba(74, 222, 128, 0.15)',
              padding: '0.2rem 0.6rem',
              borderRadius: 'var(--radius-full)',
              border: '1px solid rgba(74, 222, 128, 0.3)',
            }}>
              Authorized Quality Inspector
            </span>
            <ShieldCheck size={16} color="#4ADE80" />
          </div>
          <h1 style={{ fontSize: '1.75rem', margin: 0, color: '#FFFFFF', fontWeight: 800, textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>
            {labels.greeting}, {profile.name}!
          </h1>
          <p style={{ fontSize: '0.88rem', color: '#F1F5F9', margin: '0.3rem 0 0 0', opacity: 0.95 }}>
            <Building size={15} style={{ display: 'inline', marginRight: '5px', verticalAlign: '-2px' }} />
            {profile.centerName} • {profile.district}
          </p>
        </div>

        <button
          onClick={onStartNewScan}
          className="btn-leaf-green pulse-green"
          style={{
            padding: '0.9rem 1.85rem',
            fontSize: '1.05rem',
            backgroundColor: '#2E7D32',
            color: '#FFFFFF',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <Camera size={20} />
          <span>Start Inspection</span>
        </button>
      </div>

      {/* 2. Focused 2-Metric Summary Cards (Grade A & Defect Ratio) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '1rem',
      }}>
        {/* Metric 1: Healthy Grade A Rate */}
        <div
          style={{
            borderTop: '4px solid var(--accent-leaf-green)',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)', fontWeight: 700 }}>
              Healthy Grade A Rate
            </span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-leaf-green)', margin: '0.2rem 0' }}>
            {latestScan ? `${latestScan.gradeAPercentage}%` : '79.2%'}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-leaf-green)', fontWeight: 600 }}>
            Target: ≥{rules.gradeAMinPercentage}% Passed
          </span>
        </div>

        {/* Metric 2: URS Defect Rate */}
        <div
          style={{
            borderTop: '4px solid var(--accent-onion-purple)',
            backgroundColor: '#FFFFFF',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)', fontWeight: 700 }}>
              Defect & Sprout Limit (URS)
            </span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-onion-purple)', margin: '0.2rem 0' }}>
            {latestScan ? `${latestScan.ursPercentage}%` : '12.5%'}
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--accent-onion-purple)', fontWeight: 600 }}>
            Max Limit: ≤{rules.ursMaxPercentage}% Allowed
          </span>
        </div>

        {/* Metric 3: Quick Offline Sync Status */}
        {pendingSyncCount > 0 && (
          <div
            onClick={() => onNavigateTab('sync')}
            style={{
              cursor: 'pointer',
              borderTop: '4px solid var(--accent-onion-purple)',
              backgroundColor: 'var(--accent-onion-purple-light)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              border: '1px solid var(--border-subtle)',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--accent-onion-purple)', fontWeight: 700 }}>
                Pending Sync Queue
              </span>
              <RefreshCw size={18} color="var(--accent-onion-purple)" />
            </div>
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--accent-onion-purple)', margin: '0.2rem 0' }}>
              {pendingSyncCount} Lots
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--accent-onion-purple)', fontWeight: 600 }}>
              Tap to upload saved inspections
            </span>
          </div>
        )}
      </div>

      {/* 3. Recent Inspection Lots */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 'var(--radius-lg)',
          padding: '1.25rem',
          border: '1px solid var(--border-subtle)',
          boxShadow: 'var(--shadow-sm)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1.1rem', color: 'var(--text-earth-dark)', margin: 0, fontWeight: 700 }}>
            Recent Inspection Lots
          </h3>
          <span
            onClick={() => onNavigateTab('audit')}
            style={{ fontSize: '0.82rem', color: 'var(--accent-leaf-green)', fontWeight: 700, cursor: 'pointer' }}
          >
            View All Logs ➔
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentScans.map((scan) => {
            const isAccepted = scan.overallGrade.includes('ACCEPTED');
            return (
              <div
                key={scan.id}
                style={{
                  backgroundColor: 'var(--bg-linen-light)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.9rem 1.1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{
                      backgroundColor: isAccepted ? 'var(--accent-leaf-light)' : 'var(--accent-onion-purple-light)',
                      color: isAccepted ? 'var(--accent-leaf-green)' : 'var(--accent-onion-purple)',
                      border: `1px solid ${isAccepted ? 'rgba(46, 125, 50, 0.2)' : 'rgba(112, 38, 65, 0.2)'}`,
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.2rem 0.55rem',
                      borderRadius: 'var(--radius-full)',
                    }}>
                      {scan.overallGrade}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)' }}>
                      {scan.timestamp}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-earth-dark)', margin: '0 0 0.15rem 0', fontWeight: 700 }}>
                    {scan.lotNumber}
                  </h4>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-earth-light)', margin: 0 }}>
                    {scan.totalOnions} onions scanned • Grade A: <strong>{scan.gradeAPercentage}%</strong>
                  </p>
                </div>

                <button
                  onClick={() => onNavigateTab('reports')}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1.5px solid var(--border-strong)',
                    color: 'var(--text-earth-dark)',
                    padding: '0.45rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.82rem',
                    fontWeight: 600,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  <span>Details</span>
                  <ArrowRight size={14} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
