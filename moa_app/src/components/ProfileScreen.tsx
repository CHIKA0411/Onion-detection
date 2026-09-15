import React from 'react';
import { User, Globe, Building, LogOut, CheckCircle2 } from 'lucide-react';
import type { UIStrings } from '../data/translations';
import type { InspectorProfile, Language } from '../types';

interface ProfileScreenProps {
  profile: InspectorProfile;
  currentLanguage: Language;
  labels: UIStrings;
  onOpenLanguageSelector: () => void;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  profile,
  currentLanguage,
  labels,
  onOpenLanguageSelector,
  onLogout,
}) => {
  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <User size={16} />
          <span>OFFICER CREDENTIALS & ON-DEVICE CONFIGURATION</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.navProfile}
        </h1>
      </div>

      {/* Inspector Profile Card */}
      <div className="moa-card" style={{ border: '1.5px solid var(--accent-leaf-green)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
          <div style={{
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            backgroundColor: 'var(--accent-leaf-light)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid var(--accent-leaf-green)',
            color: 'var(--text-earth-dark)',
            fontSize: '1.6rem',
            fontWeight: 700,
          }}>
            👨‍🔬
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-earth-dark)', margin: 0 }}>
                {profile.name}
              </h2>
              <CheckCircle2 size={18} color="var(--accent-leaf-green)" />
            </div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-earth-light)', display: 'block' }}>
              {profile.designation} • ID: {profile.inspectorId}
            </span>
            <span style={{ fontSize: '0.82rem', color: 'var(--accent-leaf-green-hover)', fontWeight: 600 }}>
              <Building size={13} style={{ display: 'inline', marginRight: '3px' }} />
              {profile.centerName} ({profile.centerId})
            </span>
          </div>

          <span className="badge-grade-a">Authorized Inspector</span>
        </div>

        <hr style={{ border: 'none', borderTop: '1px solid var(--border-subtle)', margin: '1.25rem 0' }} />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-linen-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)', display: 'block' }}>
              Active Model Weights:
            </span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text-earth-dark)' }}>
              {profile.modelLoaded}
            </strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-linen-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)', display: 'block' }}>
              Procurement Hub District:
            </span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text-earth-dark)' }}>
              {profile.district}, {profile.state}
            </strong>
          </div>

          <div style={{ backgroundColor: 'var(--bg-linen-light)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)', display: 'block' }}>
              Mobile Credentials:
            </span>
            <strong style={{ fontSize: '0.88rem', color: 'var(--text-earth-dark)' }}>
              +91 {profile.mobile}
            </strong>
          </div>
        </div>
      </div>

      {/* Settings Options */}
      <div className="moa-card">
        <h3 style={{ fontSize: '1.15rem', color: 'var(--text-earth-dark)', marginBottom: '1rem' }}>
          ⚙️ Inspector Settings
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {/* Change Language Row */}
          <div
            onClick={onOpenLanguageSelector}
            style={{
              backgroundColor: 'var(--bg-linen)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              border: '1px solid var(--border-subtle)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <Globe size={22} color="var(--accent-leaf-green)" />
              <div>
                <h4 style={{ fontSize: '0.98rem', color: 'var(--text-earth-dark)', margin: 0 }}>
                  Change Interface Language
                </h4>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-earth-light)' }}>
                  Current: <strong>{currentLanguage.nativeName} ({currentLanguage.name})</strong>
                </span>
              </div>
            </div>

            <span className="badge-grade-a">Switch</span>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="btn-outline-brown"
            style={{ marginTop: '0.5rem', padding: '0.85rem' }}
          >
            <LogOut size={18} />
            <span>{labels.logout}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
