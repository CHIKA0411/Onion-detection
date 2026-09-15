import React, { useState, useRef } from 'react';
import { Camera, Upload, CheckCircle2, AlertCircle, Image as ImageIcon } from 'lucide-react';
import type { UIStrings } from '../data/translations';
import { detectOnionsDynamically, type DynamicDetectionResult } from '../utils/onionVisionDetector';

interface NewScanScreenProps {
  labels: UIStrings;
  onProceedToDetection: (
    mode: 'single' | 'batch_tray' | 'full_crate' | 'auto',
    selectedImage?: string,
    dynamicResult?: DynamicDetectionResult
  ) => void;
}

export const NewScanScreen: React.FC<NewScanScreenProps> = ({ labels, onProceedToDetection }) => {
  const [scanMode, setScanMode] = useState<'single' | 'batch_tray' | 'full_crate'>('single');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageName, setImageName] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [dynamicResult, setDynamicResult] = useState<DynamicDetectionResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    setDynamicResult(null);
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setErrorMessage('Invalid file format. Please capture or select a valid JPEG/PNG image.');
        return;
      }
      setImageName(file.name);
      setIsAnalyzing(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          setSelectedImage(dataUrl);

          try {
            // Run dynamic segmentation model in the background
            const result = await detectOnionsDynamically(dataUrl);
            setDynamicResult(result);
            if (result.totalDetected === 1) {
              setScanMode('single');
            } else if (result.totalDetected > 35) {
              setScanMode('full_crate');
            } else {
              setScanMode('batch_tray');
            }
          } catch (err) {
            console.error('Segmentation error:', err);
          } finally {
            setIsAnalyzing(false);
          }
        }
      };
      reader.onerror = () => {
        setIsAnalyzing(false);
        setErrorMessage('Failed to read image file. Please try selecting again.');
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerCamera = () => {
    setErrorMessage(null);
    try {
      if (cameraInputRef.current) {
        cameraInputRef.current.click();
      }
    } catch {
      setErrorMessage('Camera access permission denied or unavailable. Please check device permissions.');
    }
  };

  const triggerGallery = () => {
    setErrorMessage(null);
    try {
      if (galleryInputRef.current) {
        galleryInputRef.current.click();
      }
    } catch {
      setErrorMessage('Gallery file picker permission denied. Please allow storage permissions.');
    }
  };

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Hidden File Inputs for Native Camera & Gallery */}
      <input
        type="file"
        ref={cameraInputRef}
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <input
        type="file"
        ref={galleryInputRef}
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <Camera size={16} />
          <span>ON-DEVICE TFLITE INSTANCE SCANNER • SIH26031</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          New Procurement Lot Inspection Scan
        </h1>
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div style={{
          backgroundColor: '#FEE2E2',
          border: '1.5px solid #EF4444',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.15rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          color: '#991B1B',
          fontSize: '0.88rem',
          fontWeight: 600,
        }}>
          <AlertCircle size={20} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Mode Selector Card (Original 3 Cards Layout) */}
      <div className="moa-card">
        <label style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-earth-light)', textTransform: 'uppercase', marginBottom: '0.75rem', display: 'block' }}>
          1. Select Inspection Frame Mode:
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          {/* Mode A: Single Close-up */}
          <div
            onClick={() => setScanMode('single')}
            style={{
              backgroundColor: scanMode === 'single' ? 'var(--accent-leaf-light)' : 'var(--bg-linen-light)',
              border: scanMode === 'single' ? '2.5px solid var(--accent-leaf-green)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: '100%',
              height: '110px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#F8FAFC',
            }}>
              <img
                src="/mode-single.jpg"
                alt="Single Onion Close-up"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-earth-dark)', margin: 0, fontWeight: 700 }}>
              {labels.singleOnionMode}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Detailed single onion analysis for defect verification & calibration.
            </p>
          </div>

          {/* Mode B: Batch Tray */}
          <div
            onClick={() => setScanMode('batch_tray')}
            style={{
              backgroundColor: scanMode === 'batch_tray' ? 'var(--accent-leaf-light)' : 'var(--bg-linen-light)',
              border: scanMode === 'batch_tray' ? '2.5px solid var(--accent-leaf-green)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: '100%',
              height: '110px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#F8FAFC',
            }}>
              <img
                src="/mode-batch.jpg"
                alt="Batch Sampling Tray"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-earth-dark)', margin: 0, fontWeight: 700 }}>
              {labels.batchTrayMode}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Standard sampling tray frame (15-30 onions per frame). Recommended.
            </p>
          </div>

          {/* Mode C: Full Crate */}
          <div
            onClick={() => setScanMode('full_crate')}
            style={{
              backgroundColor: scanMode === 'full_crate' ? 'var(--accent-leaf-light)' : 'var(--bg-linen-light)',
              border: scanMode === 'full_crate' ? '2.5px solid var(--accent-leaf-green)' : '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
            }}
          >
            <div style={{
              width: '100%',
              height: '110px',
              borderRadius: 'var(--radius-sm)',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              border: '1px solid var(--border-subtle)',
              backgroundColor: '#F8FAFC',
            }}>
              <img
                src="/mode-crate.jpg"
                alt="Full Crate Frame"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <h4 style={{ fontSize: '1rem', color: 'var(--text-earth-dark)', margin: 0, fontWeight: 700 }}>
              {labels.fullCrateMode}
            </h4>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)', marginTop: '0.35rem', lineHeight: 1.4 }}>
              Full crate wide-angle scan (50+ onions simultaneously).
            </p>
          </div>
        </div>
      </div>

      {/* Viewfinder & Interactive Image Capture / Upload Preview Container */}
      <div className="moa-card-linen" style={{ border: '2px solid var(--accent-leaf-green)', textAlign: 'center', padding: '2rem 1.5rem' }}>
        <div style={{
          maxWidth: '460px',
          margin: '0 auto',
          backgroundColor: '#1E293B',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem 1.5rem',
          color: '#FFFFFF',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
        }}>
          {/* Live Preview Box / Image Display */}
          <div style={{
            width: '100%',
            height: '240px',
            border: selectedImage ? '2px solid var(--accent-leaf-green)' : '2px dashed var(--accent-leaf-green)',
            borderRadius: 'var(--radius-md)',
            margin: '0 auto 1.25rem auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundColor: '#0F172A',
            overflow: 'hidden',
          }}>
            {selectedImage ? (
              <img
                src={selectedImage}
                alt="Selected Frame Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <Camera size={44} color="var(--accent-leaf-green)" style={{ opacity: 0.85 }} />
                <span style={{ fontSize: '0.85rem', color: '#94A3B8' }}>
                  No image captured yet. Use Camera or Upload to select frame.
                </span>
              </div>
            )}

            <div style={{ position: 'absolute', top: '10px', right: '10px', fontSize: '0.68rem', backgroundColor: 'var(--accent-leaf-green)', color: '#FFFFFF', padding: '0.2rem 0.55rem', borderRadius: '4px', fontWeight: 700 }}>
              YOLOv8-seg Ready
            </div>
          </div>

          {imageName && (
            <div style={{
              backgroundColor: '#334155',
              padding: '0.5rem 0.85rem',
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.78rem',
              color: '#FEF3C7',
              marginBottom: '1.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem',
            }}>
              <CheckCircle2 size={15} color="var(--accent-leaf-green)" />
              <span>Loaded: <strong>{imageName}</strong></span>
            </div>
          )}

          <h3 style={{ color: '#FFFFFF', fontSize: '1.25rem', marginBottom: '0.35rem' }}>
            {selectedImage ? 'Frame Loaded for ML Analysis' : 'Capture or Upload Onion Batch'}
          </h3>
          <p style={{ color: '#94A3B8', fontSize: '0.82rem', marginBottom: '1.5rem' }}>
            Ensure uniform lighting and minimal overlapping for maximum segmentation accuracy.
          </p>

          {/* Buttons Row */}
          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={triggerCamera}
              className="btn-leaf-green pulse-green"
              style={{ padding: '0.85rem 1.25rem', fontSize: '0.92rem' }}
            >
              <Camera size={19} />
              <span>Camera Capture</span>
            </button>

            <button
              onClick={triggerGallery}
              className="btn-earth-brown"
              style={{ padding: '0.85rem 1.25rem', fontSize: '0.92rem', backgroundColor: '#334155' }}
            >
              <Upload size={18} />
              <span>Gallery Upload</span>
            </button>
          </div>

          {/* Run Inference Button */}
          <div style={{ marginTop: '1.5rem' }}>
            <button
              onClick={() => onProceedToDetection(scanMode, selectedImage || undefined, dynamicResult || undefined)}
              disabled={isAnalyzing}
              className="btn-leaf-green"
              style={{ width: '100%', padding: '0.95rem', fontSize: '1rem', backgroundColor: 'var(--accent-leaf-green)', cursor: isAnalyzing ? 'wait' : 'pointer' }}
            >
              <ImageIcon size={19} />
              <span>
                {isAnalyzing ? 'Analyzing Image...' : `Run YOLOv8-seg Detection (${scanMode.replace('_', ' ').toUpperCase()})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
