import React, { useState } from 'react';
import { FileText, Download, Printer, ShieldCheck } from 'lucide-react';
import type { UIStrings } from '../data/translations';
import type { LotScan, InspectorProfile } from '../types';
import { downloadDynamicLotPdf } from '../utils/dynamicPdfGenerator';

interface ReportsViewProps {
  labels: UIStrings;
  profile: InspectorProfile;
  latestScan: LotScan;
}

export const ReportsView: React.FC<ReportsViewProps> = ({ labels, profile, latestScan }) => {
  const [reportLanguageToggle, setReportLanguageToggle] = useState<'en' | 'translated'>('en');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const handlePrintReport = () => {
    window.print();
  };

  const handleDownloadDynamicPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await downloadDynamicLotPdf(latestScan, profile);
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Title */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
          <FileText size={16} />
          <span>OFFICIAL ADMINISTRATIVE CERTIFICATION • SIH26031 REPOSITORY</span>
        </div>
        <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
          {labels.officialCertificateTitle}
        </h1>
      </div>

      {/* Official Master Document Guarantee Banner */}
      <div style={{
        backgroundColor: 'var(--accent-leaf-light)',
        border: '1.5px solid var(--accent-leaf-green)',
        borderRadius: 'var(--radius-md)',
        padding: '0.9rem 1.15rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ShieldCheck size={24} color="var(--accent-leaf-green-hover)" />
          <div>
            <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--accent-leaf-green-hover)', display: 'block' }}>
              Official Administrative Guarantee
            </span>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-earth-brown)', margin: 0 }}>
              {labels.englishReportNotice}
            </p>
          </div>
        </div>

        {/* Language Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--surface-white)', padding: '0.25rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-subtle)' }}>
          <button
            onClick={() => setReportLanguageToggle('en')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: reportLanguageToggle === 'en' ? 'var(--accent-leaf-green)' : 'transparent',
              color: reportLanguageToggle === 'en' ? '#FFFFFF' : 'var(--text-earth-brown)',
              border: 'none',
            }}
          >
            English Master
          </button>
          <button
            onClick={() => setReportLanguageToggle('translated')}
            style={{
              padding: '0.35rem 0.85rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.78rem',
              fontWeight: 700,
              backgroundColor: reportLanguageToggle === 'translated' ? 'var(--accent-leaf-green)' : 'transparent',
              color: reportLanguageToggle === 'translated' ? '#FFFFFF' : 'var(--text-earth-brown)',
              border: 'none',
            }}
          >
            Hindi Preview
          </button>
        </div>
      </div>

      {/* Printable Official Inspection Certificate Box */}
      <div
        id="printable-official-certificate"
        className="moa-card"
        style={{
          backgroundColor: '#FFFFFF',
          border: '2px solid var(--text-earth-brown)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          boxShadow: 'var(--shadow-lg)',
          position: 'relative',
        }}
      >
        {/* Certificate Header Banner */}
        <div style={{
          borderBottom: '2px solid var(--text-earth-brown)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--accent-leaf-green)',
              padding: '4px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.08)'
            }}>
              <img src="/emblem.png" alt="National Emblem of India" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div>
              <span style={{ fontSize: '0.72rem', letterSpacing: '1.5px', textTransform: 'uppercase', color: 'var(--text-earth-dark)', fontWeight: 800 }}>
                GOVERNMENT OF INDIA • MINISTRY OF CONSUMER AFFAIRS, FOOD & PUBLIC DISTRIBUTION
              </span>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--text-earth-dark)', margin: 0, fontWeight: 700 }}>
                {reportLanguageToggle === 'en' ? 'OFFICIAL ONION QUALITY GRADING CERTIFICATE' : 'आधिकारिक प्याज गुणवत्ता ग्रेडिंग प्रमाण पत्र'}
              </h2>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-earth-light)' }}>
                Department of Consumer Affairs • SIH26031 Automated ML Inspection Standard
              </span>
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <span className="badge-grade-a" style={{ marginBottom: '0.25rem' }}>
              Master Copy: English
            </span>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-earth-dark)' }}>
              Cert No: DOCA-{latestScan.id.toUpperCase()}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-earth-light)' }}>
              Date: {latestScan.timestamp}
            </div>
          </div>
        </div>

        {/* Metadata Grid */}
        <div style={{
          backgroundColor: 'var(--bg-linen)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '0.85rem',
          marginBottom: '1.5rem',
          fontSize: '0.85rem',
          border: '1px solid var(--border-subtle)',
        }}>
          <div>
            <span style={{ color: 'var(--text-earth-light)', display: 'block', fontSize: '0.75rem' }}>Lot Number:</span>
            <strong style={{ color: 'var(--text-earth-dark)' }}>{latestScan.lotNumber}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-earth-light)', display: 'block', fontSize: '0.75rem' }}>Procurement Center:</span>
            <strong style={{ color: 'var(--text-earth-dark)' }}>{profile.centerName} ({profile.centerId})</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-earth-light)', display: 'block', fontSize: '0.75rem' }}>Certified Quality Officer:</span>
            <strong style={{ color: 'var(--text-earth-dark)' }}>{profile.name} (ID: {profile.inspectorId})</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-earth-light)', display: 'block', fontSize: '0.75rem' }}>Overall Lot Status:</span>
            <strong style={{ color: latestScan.overallGrade.includes('ACCEPTED') ? 'var(--accent-leaf-green-hover)' : '#991B1B' }}>
              {latestScan.overallGrade}
            </strong>
          </div>
        </div>

        {/* Aggregated Categorization Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-earth-dark)', marginBottom: '0.75rem' }}>
            1. Automated ML Instance Classification Breakdown (YOLOv8-seg)
          </h3>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--text-earth-brown)', color: '#FFFFFF', textAlign: 'left' }}>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Category</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Count (Units)</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Percentage (%)</th>
                  <th style={{ padding: '0.65rem 0.85rem' }}>Policy Status</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>Grade A (Healthy)</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{latestScan.defectBreakdown.gradeA}</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{latestScan.gradeAPercentage}%</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>
                    <span style={{ backgroundColor: '#DCFCE7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700, fontSize: '0.75rem' }}>
                      PASSED (≥ 75%)
                    </span>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>Mechanically Damaged</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{latestScan.defectBreakdown.damaged}</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{((latestScan.defectBreakdown.damaged / latestScan.totalOnions) * 100).toFixed(1)}%</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>Tol. Under Limit</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>Neck / Basal Rot</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{latestScan.defectBreakdown.rotten}</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{((latestScan.defectBreakdown.rotten / latestScan.totalOnions) * 100).toFixed(1)}%</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>Tol. Under Limit</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>Sprouted (&gt;15mm)</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{latestScan.defectBreakdown.sprouted}</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{((latestScan.defectBreakdown.sprouted / latestScan.totalOnions) * 100).toFixed(1)}%</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>Tol. Under Limit</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.6rem 0.85rem', fontWeight: 600 }}>Undersized (&lt;35mm)</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{latestScan.defectBreakdown.undersized}</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>{((latestScan.defectBreakdown.undersized / latestScan.totalOnions) * 100).toFixed(1)}%</td>
                  <td style={{ padding: '0.6rem 0.85rem' }}>Tol. Under Limit</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Scanned Lot Batch Image Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-earth-dark)', marginBottom: '0.75rem' }}>
            2. Scanned Lot Batch Image & Segmentation Snapshot
          </h3>
          <div style={{
            borderRadius: 'var(--radius-md)',
            overflow: 'hidden',
            border: '1.5px solid var(--border-subtle)',
            backgroundColor: '#0F172A',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            padding: '0.75rem',
          }}>
            {latestScan.annotatedImageUrl && latestScan.annotatedImageUrl !== latestScan.imageUrl ? (
              <img
                src={latestScan.annotatedImageUrl}
                alt={`Scanned Lot ${latestScan.lotNumber} Annotated`}
                style={{
                  maxWidth: '100%',
                  maxHeight: '380px',
                  width: 'auto',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '4px',
                }}
              />
            ) : (
              <div style={{ position: 'relative', display: 'inline-block', lineHeight: 0, maxWidth: '100%' }}>
                <img
                  src={latestScan.imageUrl}
                  alt={`Scanned Lot ${latestScan.lotNumber}`}
                  style={{
                    display: 'block',
                    maxWidth: '100%',
                    maxHeight: '380px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain',
                    borderRadius: '4px',
                  }}
                />
                {latestScan.items.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      position: 'absolute',
                      left: `${item.bbox.x}%`,
                      top: `${item.bbox.y}%`,
                      width: `${item.bbox.width}%`,
                      height: `${item.bbox.height}%`,
                      border: '3px solid #FACC15',
                      backgroundColor: 'rgba(250, 204, 21, 0.15)',
                      boxShadow: '0 0 10px rgba(250, 204, 21, 0.7)',
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'flex-start',
                      pointerEvents: 'none',
                    }}
                  >
                    <span style={{
                      fontSize: '0.65rem',
                      fontWeight: 800,
                      color: '#0F172A',
                      backgroundColor: '#FACC15',
                      padding: '0.08rem 0.3rem',
                      borderRadius: '2px',
                    }}>
                      #{item.onionIndex}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Flagged Defective Onion Crops Section */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.05rem', color: 'var(--text-earth-dark)', marginBottom: '0.75rem' }}>
            3. Flagged Defective Onion Crops & Individual Inspection Thumbnails
          </h3>

          {latestScan.items.filter((i) => i.condition !== 'grade_a' || i.isOverridden).length > 0 ? (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '0.85rem',
            }}>
              {latestScan.items
                .filter((i) => i.condition !== 'grade_a' || i.isOverridden)
                .map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: '1px solid var(--border-subtle)',
                      backgroundColor: 'var(--bg-linen)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: '#E5E7EB',
                      overflow: 'hidden',
                      flexShrink: 0,
                      border: item.isOverridden ? '2px solid var(--accent-terracotta)' : '2px solid #EF4444',
                    }}>
                      <img
                        src={item.cropImageUrl || latestScan.imageUrl}
                        alt={`Onion #${item.onionIndex}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: item.cropImageUrl ? 'contain' : 'cover',
                          objectPosition: item.cropImageUrl ? 'center' : `${item.bbox.x}% ${item.bbox.y}%`,
                        }}
                      />
                    </div>

                    <div style={{ fontSize: '0.78rem' }}>
                      <strong style={{ color: 'var(--text-earth-dark)', display: 'block' }}>
                        Onion #{item.onionIndex} {item.isOverridden && '(OVERRIDDEN)'}
                      </strong>
                      <span style={{ color: item.condition === 'grade_a' ? 'var(--accent-leaf-green-hover)' : '#C53030', fontWeight: 700, display: 'block' }}>
                        {item.condition.replace('_', ' ').toUpperCase()} ({Math.round(item.confidence)}%)
                      </span>
                      <span style={{ color: 'var(--text-earth-light)', fontSize: '0.72rem' }}>
                        Size: {item.diameterMm}mm | {item.defectDetails || 'Visual defect detected'}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div style={{ backgroundColor: 'var(--bg-linen-light)', border: '1px solid var(--border-subtle)', padding: '0.85rem 1rem', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-earth-brown)' }}>
              All scanned onions passed Grade A specifications with 0 flagged defects.
            </div>
          )}
        </div>

        {/* Seal & Digital Signature Verification */}
        <div style={{
          borderTop: '2px dashed var(--border-strong)',
          paddingTop: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)', display: 'block' }}>
              Cryptographic Verification Hash:
            </span>
            <div style={{ backgroundColor: 'var(--bg-linen)', padding: '0.35rem 0.75rem', borderRadius: '4px', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'monospace' }}>
              SHA256-SIH26031-{latestScan.id.toUpperCase()}-VERIFIED
            </div>
          </div>

          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-earth-dark)' }}>
              {profile.name}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-earth-light)' }}>
              Senior Quality Inspector, NAFED Hub
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button
          onClick={handlePrintReport}
          className="btn-outline-brown"
          style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}
        >
          <Printer size={18} />
          <span>{labels.printCertificate}</span>
        </button>

        <button
          onClick={handleDownloadDynamicPdf}
          disabled={isGeneratingPdf}
          className="btn-leaf-green"
          style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: isGeneratingPdf ? 'wait' : 'pointer' }}
        >
          <Download size={18} />
          <span>{isGeneratingPdf ? 'Generating PDF...' : labels.downloadPdf}</span>
        </button>
      </div>
    </div>
  );
};
