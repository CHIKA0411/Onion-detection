import React from 'react';
import { Globe, ShieldCheck, Smartphone, Monitor, WifiOff, Cpu } from 'lucide-react';
import type { Language, InspectorProfile } from '../types';

interface HeaderProps {
  currentLanguage: Language;
  profile: InspectorProfile;
  onOpenLanguageSelector: () => void;
  isMobileSimulator: boolean;
  onToggleSimulator: () => void;
  pendingSyncCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLanguage,
  profile,
  onOpenLanguageSelector,
  isMobileSimulator,
  onToggleSimulator,
  pendingSyncCount,
}) => {
  return (
    <header style={{
      backgroundColor: 'var(--text-earth-brown)',
      color: '#FFFFFF',
      padding: '0.85rem 1.25rem',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 4px 12px rgba(74, 59, 50, 0.3)',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        {/* Ministry Brand & Emblem */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2px solid var(--accent-leaf-green)',
            boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
            padding: '3px',
            overflow: 'hidden',
          }}>
            <img src="/emblem.png" alt="National Emblem of India" style={{ height: '100%', objectFit: 'contain' }} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.62rem', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--accent-terracotta-light)', fontWeight: 700 }}>
                GOVERNMENT OF INDIA • SIH26031
              </span>
              <ShieldCheck size={13} color="var(--accent-leaf-green)" />
            </div>
            <h1 style={{
              fontSize: '1.02rem',
              fontWeight: 700,
              color: '#FFFFFF',
              lineHeight: 1.2,
              margin: 0,
            }}>
              Ministry of Consumer Affairs, Food & Public Distribution
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.85)', margin: 0 }}>
              Onion Quality Detection & Grading System • {profile.centerId}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* On-device Engine Status */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            backgroundColor: 'rgba(255, 255, 255, 0.12)',
            padding: '0.35rem 0.75rem',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.75rem',
            color: '#FFFFFF',
            border: '1px solid rgba(255,255,255,0.2)',
          }} title="TFLite / ONNX On-Device Inference Ready">
            <Cpu size={13} color="var(--accent-leaf-green)" />
            <span>TFLite Offline</span>
          </div>

          {/* Sync Queue Badge */}
          {pendingSyncCount > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'var(--accent-terracotta)',
              padding: '0.35rem 0.75rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.75rem',
              color: '#FFFFFF',
              fontWeight: 700,
            }}>
              <WifiOff size={13} />
              <span>{pendingSyncCount} Pending Sync</span>
            </div>
          )}

          {/* Language Fast Switcher */}
          <button
            onClick={onOpenLanguageSelector}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.18)',
              color: '#FFFFFF',
              padding: '0.4rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.82rem',
              fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.3)',
            }}
            title="Change Language"
          >
            <Globe size={15} color="var(--accent-terracotta-light)" />
            <span>{currentLanguage.nativeName}</span>
          </button>

          {/* Device Simulator Toggle */}
          <button
            onClick={onToggleSimulator}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              border: 'none',
            }}
            title={isMobileSimulator ? "Switch to Desktop View" : "Switch to Mobile View"}
          >
            {isMobileSimulator ? <Monitor size={17} /> : <Smartphone size={17} />}
          </button>
        </div>
      </div>
    </header>
  );
};
