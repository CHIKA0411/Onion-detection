import React from 'react';
import { BookOpen, PhoneCall } from 'lucide-react';
import type { UIStrings } from '../data/translations';

interface HelpSupportScreenProps {
  labels: UIStrings;
}

export const HelpSupportScreen: React.FC<HelpSupportScreenProps> = ({ labels }) => {
  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <BookOpen size={16} />
          <span>DEPARTMENT OF CONSUMER AFFAIRS • INSPECTION MANUAL</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.sopTitle}
        </h1>
      </div>

      {/* Visual Defect Guide Cards */}
      <div className="moa-card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-earth-dark)', marginBottom: '1rem' }}>
          📖 Visual Defect Identification Guide (SIH26031 Standard)
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {/* Defect 1: Grade A */}
          <div style={{ backgroundColor: 'var(--accent-leaf-light)', border: '1px solid var(--accent-leaf-green)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ color: 'var(--accent-leaf-green-hover)', fontSize: '1rem', margin: '0 0 0.35rem 0' }}>
              🟢 Grade A (Healthy)
            </h4>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-earth-brown)', margin: 0, lineHeight: 1.4 }}>
              Intact dry outer skin scale, firm bulb flesh, dry neck stem cut cleanly &lt;2.5 cm, diameter ≥ 35mm. No mold, no soft spots.
            </p>
          </div>

          {/* Defect 2: Neck Rot */}
          <div style={{ backgroundColor: '#FEE2E2', border: '1px solid #EF4444', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ color: '#991B1B', fontSize: '1rem', margin: '0 0 0.35rem 0' }}>
              🔴 Neck / Basal Rot
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#991B1B', margin: 0, lineHeight: 1.4 }}>
              Soft watery decay around neck tissues, grey Botrytis mycelium growth, or basal plate fungal decomposition. Flagged as URS.
            </p>
          </div>

          {/* Defect 3: Sprouted */}
          <div style={{ backgroundColor: '#F3E8FF', border: '1px solid #8B5CF6', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ color: '#6B21A8', fontSize: '1rem', margin: '0 0 0.35rem 0' }}>
              🟣 Sprouted Onions
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#6B21A8', margin: 0, lineHeight: 1.4 }}>
              Visible green shoot foliage emerging from stem neck &gt; 15mm. Indicates dormancy breaking. Flagged as URS.
            </p>
          </div>

          {/* Defect 4: Undersized */}
          <div style={{ backgroundColor: '#DBEAFE', border: '1px solid #3B82F6', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h4 style={{ color: '#1E40AF', fontSize: '1rem', margin: '0 0 0.35rem 0' }}>
              🔵 Undersized Onions (&lt;35mm)
            </h4>
            <p style={{ fontSize: '0.82rem', color: '#1E40AF', margin: 0, lineHeight: 1.4 }}>
              Bulb diameter measured below the minimum 35mm threshold. Automated size calculation via YOLOv8-seg bounding box pixels.
            </p>
          </div>
        </div>
      </div>

      {/* Helpline Contact Card */}
      <div className="moa-card-linen" style={{ border: '1.5px solid var(--accent-terracotta)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <PhoneCall size={28} color="var(--accent-terracotta-dark)" />
          <div>
            <h4 style={{ fontSize: '1.05rem', color: 'var(--accent-terracotta-dark)', margin: 0 }}>
              {labels.helplineSupport}
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)' }}>
              Direct helpline for NAFED / NCCF procurement center inspectors & technical model issues.
            </span>
          </div>
        </div>

        <button
          onClick={() => window.open('tel:1800114000')}
          className="btn-leaf-green"
          style={{ backgroundColor: 'var(--accent-terracotta)' }}
        >
          Call Technical Support
        </button>
      </div>
    </div>
  );
};
