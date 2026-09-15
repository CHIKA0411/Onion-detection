import React, { useEffect, useState } from 'react';
import { Cpu, ArrowRight, RefreshCw, Eye } from 'lucide-react';
import type { DetectedOnion } from '../types';
import type { UIStrings } from '../data/translations';

interface LiveDetectionScreenProps {
  items: DetectedOnion[];
  labels: UIStrings;
  imageUrl?: string;
  onProceedToClassification: () => void;
}

export const LiveDetectionScreen: React.FC<LiveDetectionScreenProps> = ({
  items,
  labels,
  imageUrl,
  onProceedToClassification,
}) => {
  const [isProcessing, setIsProcessing] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setIsProcessing(false);
          return 100;
        }
        return prev + 25;
      });
    }, 300);

    return () => clearInterval(timer);
  }, []);

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <Cpu size={16} />
          <span>YOLOV8-SEG INSTANCE SEGMENTATION INFERENCE ENGINE</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.liveSegmentationTitle}
        </h1>
      </div>

      {/* Detection Canvas Container */}
      <div className="moa-card" style={{ padding: '1.5rem', backgroundColor: '#0F172A', color: '#FFFFFF', borderRadius: 'var(--radius-lg)', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge-grade-a">On-Device TFLite INT8</span>
            <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              Resolution: 640x640 • Model: yolov8n-seg.tflite
            </span>
          </div>

          <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-terracotta-light)' }}>
            Detected: {isProcessing ? 'Detecting...' : `${items.length} ${items.length === 1 ? 'Onion Bulb' : 'Onions'}`}
          </div>
        </div>

        {/* Viewfinder Canvas Simulation */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '360px',
          backgroundColor: '#0F172A',
          borderRadius: 'var(--radius-md)',
          overflow: 'hidden',
          backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)',
          backgroundSize: '20px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isProcessing ? (
            <div style={{ textAlign: 'center' }}>
              <RefreshCw size={36} color="var(--accent-leaf-green)" className="pulse-green" style={{ marginBottom: '1rem' }} />
              <h3 style={{ color: '#FFFFFF', fontSize: '1.2rem', margin: '0 0 0.5rem 0' }}>
                {labels.yoloDetecting} ({progress}%)
              </h3>
              <p style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                Generating polygon masks and bounding box predictions...
              </p>
            </div>
          ) : (
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0, maxWidth: '100%', maxHeight: '100%' }}>
                {/* Actual Scanned Frame Photo */}
                <img
                  src={imageUrl || "/mode-single.jpg"}
                  alt="Scanned Batch Frame"
                  style={{ display: 'block', maxWidth: '100%', maxHeight: '350px', width: 'auto', height: 'auto', objectFit: 'contain' }}
                />

                {/* Yellow Square Bounding Boxes strictly aligned with detected onions */}
                {items.map((on) => (
                  <div
                    key={on.id}
                    style={{
                      position: 'absolute',
                      left: `${on.bbox.x}%`,
                      top: `${on.bbox.y}%`,
                      width: `${on.bbox.width}%`,
                      height: `${on.bbox.height}%`,
                      border: '3px solid #FACC15',
                      backgroundColor: 'rgba(250, 204, 21, 0.12)',
                      borderRadius: '0px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: items.length === 1 ? 'flex-start' : 'center',
                      boxShadow: '0 0 14px rgba(250, 204, 21, 0.7), inset 0 0 10px rgba(250, 204, 21, 0.25)',
                      pointerEvents: 'none',
                      paddingTop: items.length === 1 ? '6px' : '0',
                    }}
                  >
                    {items.length > 30 || on.bbox.width < 10 ? (
                      <span style={{
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        color: '#0F172A',
                        backgroundColor: '#FACC15',
                        padding: '0.08rem 0.25rem',
                        borderRadius: '2px',
                        whiteSpace: 'nowrap',
                        border: '1px solid #EAB308',
                      }}>
                        #{on.onionIndex}
                      </span>
                    ) : (
                      <>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 800,
                          color: '#0F172A',
                          backgroundColor: '#FACC15',
                          padding: '0.15rem 0.5rem',
                          borderRadius: '3px',
                          whiteSpace: 'nowrap',
                          border: '1px solid #EAB308',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                        }}>
                          #{on.onionIndex} {on.condition.replace('_', ' ').toUpperCase()} ({Math.round(on.confidence)}%)
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#FEF08A', fontWeight: 800, textShadow: '0 1px 4px #000', marginTop: '2px' }}>
                          Ø {on.diameterMm}mm
                        </span>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #334155',
          fontSize: '0.78rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#2F855A' }} />
            <span>Grade A Healthy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#F59E0B' }} />
            <span>Damaged</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#EF4444' }} />
            <span>Rotten</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#8B5CF6' }} />
            <span>Sprouted</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#3B82F6' }} />
            <span>Undersized (&lt;35mm)</span>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={onProceedToClassification}
          className="btn-leaf-green"
          style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
          disabled={isProcessing}
        >
          <Eye size={18} />
          <span>View Per-Onion Classifications</span>
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
};
