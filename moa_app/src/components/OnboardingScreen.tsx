import React, { useState } from 'react';
import { Cpu, ShieldCheck, CheckCircle, ArrowRight, Check } from 'lucide-react';
import type { UIStrings } from '../data/translations';

interface OnboardingScreenProps {
  labels: UIStrings;
  onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ labels, onFinish }) => {
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      icon: Cpu,
      title: labels.onboardingTitle1,
      desc: labels.onboardingDesc1,
      bgIcon: '🧅',
      badge: 'YOLOv8-seg Instance Model',
    },
    {
      icon: CheckCircle,
      title: labels.onboardingTitle2,
      desc: labels.onboardingDesc2,
      bgIcon: '🔍',
      badge: '5-Class Defect Categorization',
    },
    {
      icon: ShieldCheck,
      title: labels.onboardingTitle3,
      desc: labels.onboardingDesc3,
      bgIcon: '📋',
      badge: 'Audit Ledger & Override Log',
    },
  ];

  const handleNext = () => {
    if (activeSlide < slides.length - 1) {
      setActiveSlide(activeSlide + 1);
    } else {
      onFinish();
    }
  };

  const current = slides[activeSlide];
  const IconComp = current.icon;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-linen)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2rem 1.5rem',
      maxWidth: '600px',
      margin: '0 auto',
    }} className="animate-fade-in">
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
            flexShrink: 0,
          }}>
            <img src="/emblem.png" alt="Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-earth-light)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            MINISTRY OF CONSUMER AFFAIRS
          </span>
        </div>
        <button
          onClick={onFinish}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-earth-light)',
            fontWeight: 600,
            fontSize: '0.88rem',
          }}
        >
          {labels.skip}
        </button>
      </div>

      {/* Main Slide Card */}
      <div style={{
        backgroundColor: 'var(--surface-white)',
        borderRadius: 'var(--radius-lg)',
        padding: '2.5rem 2rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        margin: '2rem 0',
      }}>
        <div style={{
          position: 'absolute',
          top: '-20px',
          right: '-20px',
          fontSize: '7rem',
          opacity: 0.08,
          pointerEvents: 'none',
        }}>
          {current.bgIcon}
        </div>

        <span className="badge-grade-a" style={{ marginBottom: '1.5rem', padding: '0.35rem 0.85rem' }}>
          {current.badge}
        </span>

        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          backgroundColor: 'var(--accent-leaf-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '1.75rem',
          border: '3px solid var(--accent-leaf-green)',
          boxShadow: '0 8px 24px rgba(47, 133, 90, 0.25)',
        }}>
          <IconComp size={44} color="var(--accent-leaf-green-hover)" />
        </div>

        <h2 style={{ fontSize: '1.45rem', color: 'var(--text-earth-dark)', marginBottom: '0.85rem', lineHeight: 1.3 }}>
          {current.title}
        </h2>
        <p style={{ fontSize: '0.92rem', color: 'var(--text-earth-light)', lineHeight: 1.6, maxWidth: '420px' }}>
          {current.desc}
        </p>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '2rem' }}>
          {slides.map((_, idx) => (
            <div
              key={idx}
              onClick={() => setActiveSlide(idx)}
              style={{
                width: activeSlide === idx ? '28px' : '8px',
                height: '8px',
                borderRadius: 'var(--radius-full)',
                backgroundColor: activeSlide === idx ? 'var(--accent-leaf-green)' : 'var(--border-strong)',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </div>
      </div>

      {/* Bottom Action Button */}
      <div>
        <button
          onClick={handleNext}
          className="btn-leaf-green"
          style={{
            width: '100%',
            padding: '1rem',
            fontSize: '1.02rem',
            borderRadius: 'var(--radius-md)',
          }}
        >
          <span>{activeSlide === slides.length - 1 ? labels.getStarted : labels.next}</span>
          {activeSlide === slides.length - 1 ? <Check size={20} /> : <ArrowRight size={20} />}
        </button>
      </div>
    </div>
  );
};
