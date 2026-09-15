import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, Lock, CheckCircle, UserCheck, Building } from 'lucide-react';
import type { UIStrings } from '../data/translations';
import type { InspectorProfile } from '../types';

interface AuthScreenProps {
  labels: UIStrings;
  onLoginSuccess: (profile: InspectorProfile) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ labels, onLoginSuccess }) => {
  const [inspectorId, setInspectorId] = useState('INS-9021');
  const [centerId, setCenterId] = useState('NAFED-NSK-04');
  const [pinCode, setPinCode] = useState('4829');
  const [isVerifying, setIsVerifying] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);

    setTimeout(() => {
      setIsVerifying(false);
      const mockProfile: InspectorProfile = {
        inspectorId: inspectorId || 'INS-9021',
        name: 'Rajesh Kumar Verma',
        designation: 'Senior Quality Inspector',
        centerId: centerId || 'NAFED-NSK-04',
        centerName: 'NAFED Procurement Hub, Lasalgaon',
        district: 'Nashik',
        state: 'Maharashtra',
        mobile: '9823011492',
        isKycVerified: true,
        modelLoaded: 'yolov8n-seg-int8.tflite (v2.4.1)',
      };
      onLoginSuccess(mockProfile);
    }, 600);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-linen)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: '2rem 1rem',
      overflowY: 'auto',
    }} className="animate-fade-in">
      <div style={{
        maxWidth: '460px',
        width: '100%',
        backgroundColor: 'var(--surface-white)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        border: '1px solid var(--border-subtle)',
        overflow: 'hidden',
      }}>
        {/* Header Bar */}
        <div style={{
          backgroundColor: 'var(--text-earth-brown)',
          color: '#FFFFFF',
          padding: '1.5rem 1.25rem',
          textAlign: 'center',
        }}>
          <div style={{
            width: '58px',
            height: '58px',
            borderRadius: '50%',
            backgroundColor: '#FFFFFF',
            margin: '0 auto 0.75rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '2.5px solid var(--accent-leaf-green)',
            overflow: 'hidden',
            boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          }}>
            <img src="/emblem.png" alt="Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <h2 style={{ color: '#FFFFFF', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>
            {labels.welcomeMinistry}
          </h2>
          <p style={{ color: 'var(--accent-terracotta-light)', fontSize: '0.8rem', margin: '0.2rem 0 0 0', fontWeight: 600 }}>
            {labels.portalTitle}
          </p>
        </div>

        {/* Sub Header Notice */}
        <div style={{
          backgroundColor: 'var(--accent-leaf-light)',
          padding: '0.75rem 1.25rem',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          fontSize: '0.8rem',
          color: 'var(--accent-leaf-green-hover)',
        }}>
          <ShieldCheck size={18} />
          <span>Procurement Officers & Quality Inspection Staff Terminal</span>
        </div>

        {/* Form Body */}
        <div style={{ padding: '1.5rem 1.25rem' }}>
          <form onSubmit={handleLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <UserCheck size={15} color="var(--accent-leaf-green)" />
                <span>{labels.inspectorId}</span>
              </label>
              <input
                type="text"
                required
                placeholder={labels.enterInspectorId}
                value={inspectorId}
                onChange={(e) => setInspectorId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.95rem',
                  color: 'var(--text-earth-dark)',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Building size={15} color="var(--accent-leaf-green)" />
                <span>{labels.centerId}</span>
              </label>
              <input
                type="text"
                required
                placeholder={labels.enterCenterId}
                value={centerId}
                onChange={(e) => setCenterId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-strong)',
                  fontSize: '0.95rem',
                  color: 'var(--text-earth-dark)',
                  fontWeight: 600,
                }}
              />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-earth-dark)', marginBottom: '0.35rem', display: 'block' }}>
                {labels.loginOtp}
              </label>
              <input
                type="password"
                maxLength={4}
                required
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--accent-leaf-green)',
                  fontSize: '1.2rem',
                  textAlign: 'center',
                  letterSpacing: '8px',
                  fontWeight: 700,
                  color: 'var(--text-earth-dark)',
                }}
              />
            </div>

            <div style={{
              backgroundColor: 'var(--bg-linen)',
              padding: '0.65rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: 'var(--text-earth-light)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}>
              <CheckCircle size={15} color="var(--accent-leaf-green)" />
              <span>Offline TFLite Model v2.4 pre-loaded into device memory.</span>
            </div>

            <button
              type="submit"
              className="btn-leaf-green"
              style={{ width: '100%', padding: '0.85rem', marginTop: '0.5rem' }}
              disabled={isVerifying}
            >
              <Lock size={18} />
              <span>{isVerifying ? 'Authenticating Officer...' : labels.verifyLogin}</span>
              <ArrowRight size={18} />
            </button>
          </form>
        </div>

        {/* Footer Note */}
        <div style={{
          backgroundColor: 'var(--bg-linen)',
          padding: '0.75rem',
          textAlign: 'center',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: '0.72rem',
          color: 'var(--text-earth-light)',
        }}>
          {labels.authFooterNote}
        </div>
      </div>
    </div>
  );
};
