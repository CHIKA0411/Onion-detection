import React from 'react';
import {
  Scan,
  BarChart3,
  Globe2,
  CheckCircle,
  ArrowRight,
  Database,
  Cpu,
  Layers,
  FileCheck
} from 'lucide-react';

interface LandingScreenProps {
  onGetStarted: () => void;
}

export const LandingScreen: React.FC<LandingScreenProps> = ({ onGetStarted }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.65) 0%, rgba(30, 41, 59, 0.75) 100%), url('/onion-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        position: 'relative',
        overflowX: 'hidden',
        color: '#FFFFFF',
      }}
      className="animate-fade-in"
    >
      {/* Top Ministry Banner */}
      <header
        style={{
          width: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.15)',
          padding: '0.75rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid #4ADE80',
              padding: '3px',
              overflow: 'hidden',
            }}
          >
            <img src="/emblem.png" alt="National Emblem of India" style={{ height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div
              style={{
                fontSize: '0.68rem',
                fontWeight: 700,
                color: '#4ADE80',
                textTransform: 'uppercase',
                letterSpacing: '1px',
              }}
            >
              Government of India • Ministry of Consumer Affairs
            </div>
            <div
              style={{
                fontSize: '0.92rem',
                fontWeight: 800,
                color: '#FFFFFF',
              }}
            >
              Smart Quality Evaluation & Grading System for Onions (SIH26031)
            </div>
          </div>
        </div>

      </header>

      {/* Hero Section */}
      <main
        style={{
          maxWidth: '1100px',
          width: '100%',
          padding: '3.5rem 1.5rem 2.5rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: '2.5rem',
        }}
      >
        {/* Hero Title & Subtitle */}
        <div style={{ maxWidth: '820px' }}>

          <h1
            style={{
              fontSize: '2.85rem',
              lineHeight: 1.15,
              color: '#FFFFFF',
              fontWeight: 800,
              marginBottom: '1rem',
              fontFamily: 'var(--font-display)',
              textShadow: '0 4px 12px rgba(0,0,0,0.6)',
            }}
          >
            Automated Quality Grading & Defect Detection for Procurement Centers
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#E2E8F0',
              lineHeight: 1.6,
              maxWidth: '740px',
              margin: '0 auto',
              textShadow: '0 2px 8px rgba(0,0,0,0.7)',
            }}
          >
            Empowering procurement inspectors with real-time on-device AI analysis for 
            sprouting, rot, mechanical damage, and sizing. Ensure fair farmer pricing and 
            transparent NAFED / NCCF buffer stock quality standards.
          </p>

          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '1rem',
              marginTop: '2rem',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onGetStarted}
              className="btn-leaf-green pulse-green"
              style={{
                padding: '1rem 2.25rem',
                fontSize: '1.1rem',
                borderRadius: 'var(--radius-md)',
              }}
            >
              <span>Get Started / शुरू करें</span>
              <ArrowRight size={20} />
            </button>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            width: '100%',
            marginTop: '1rem',
          }}
        >
          {/* Card 1 */}
          <div
            style={{
              textAlign: 'left',
              padding: '1.5rem',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: '#4ADE80',
              }}
            >
              <Scan size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
              Multi-Onion Scanning
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Scan single onions, batch sampling trays, or full crates simultaneously using on-device YOLOv8 segmentation.
            </p>
          </div>

          {/* Card 2 */}
          <div
            style={{
              textAlign: 'left',
              padding: '1.5rem',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(251, 191, 36, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: '#FDE047',
              }}
            >
              <Cpu size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
              AI Defect Classifier
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              MobileNetV3 detects sprouting, black rot, neck rot, fungal decay, and mechanical skin peel defects in seconds.
            </p>
          </div>

          {/* Card 3 */}
          <div
            style={{
              textAlign: 'left',
              padding: '1.5rem',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(96, 165, 250, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: '#60A5FA',
              }}
            >
              <Globe2 size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
              22 Native Languages
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Fully localized in all 22 Eighth Schedule Constitutional Languages of India with optional voice assistance.
            </p>
          </div>

          {/* Card 4 */}
          <div
            style={{
              textAlign: 'left',
              padding: '1.5rem',
              backgroundColor: 'rgba(15, 23, 42, 0.75)',
              backdropFilter: 'blur(10px)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(74, 222, 128, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1rem',
                color: '#4ADE80',
              }}
            >
              <BarChart3 size={26} />
            </div>
            <h3 style={{ fontSize: '1.15rem', color: '#FFFFFF', marginBottom: '0.4rem' }}>
              Audit & Sync Logs
            </h3>
            <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: 1.5 }}>
              Supports manual inspector override tracking, transparent audit trail, and offline queue syncing for low-network APMCs.
            </p>
          </div>
        </div>

        {/* Technical Architecture Specs Banner */}
        <div
          style={{
            width: '100%',
            padding: '1.75rem',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            backgroundColor: 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(12px)',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px dashed #4ADE80',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={20} color="#4ADE80" />
            <h4 style={{ fontSize: '1.05rem', color: '#FFFFFF', margin: 0 }}>
              System Specifications & Buffer Quality Compliance
            </h4>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              fontSize: '0.88rem',
              color: '#E2E8F0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="#4ADE80" />
              <span><strong>Grade A Standard:</strong> ≥70% Healthy</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CheckCircle size={16} color="#4ADE80" />
              <span><strong>URS Defect Limit:</strong> ≤15% Tolerated</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Database size={16} color="#4ADE80" />
              <span><strong>Model Engine:</strong> PyTorch & TFLite</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <FileCheck size={16} color="#4ADE80" />
              <span><strong>Procurement Tagging:</strong> Automated Lot ID</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        style={{
          width: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.95)',
          color: '#94A3B8',
          padding: '1.25rem 2rem',
          textAlign: 'center',
          fontSize: '0.82rem',
          marginTop: 'auto',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <p>
          Smart Quality Evaluation System for Onions • SIH 2026 Problem Statement SIH26031
        </p>
      </footer>
    </div>
  );
};
