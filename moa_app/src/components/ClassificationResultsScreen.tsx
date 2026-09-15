import React from 'react';
import { Eye, Edit3, ArrowRight } from 'lucide-react';
import type { DetectedOnion } from '../types';
import type { UIStrings } from '../data/translations';

interface ClassificationResultsScreenProps {
  items: DetectedOnion[];
  labels: UIStrings;
  imageUrl?: string;
  onOpenOverrideModal: (item: DetectedOnion) => void;
  onProceedToSummary: () => void;
}

export const ClassificationResultsScreen: React.FC<ClassificationResultsScreenProps> = ({
  items,
  labels,
  imageUrl,
  onOpenOverrideModal,
  onProceedToSummary,
}) => {
  const [visibleCount, setVisibleCount] = React.useState(32);

  const getBadgeStyle = (condition: string) => {
    switch (condition) {
      case 'grade_a':
        return { bg: 'var(--accent-leaf-light)', color: 'var(--accent-leaf-green-hover)', label: 'Grade A (Healthy)' };
      case 'damaged':
        return { bg: '#FEF3C7', color: '#92400E', label: 'Damaged' };
      case 'rotten':
        return { bg: '#FEE2E2', color: '#991B1B', label: 'Rotten' };
      case 'sprouted':
        return { bg: '#F3E8FF', color: '#6B21A8', label: 'Sprouted' };
      case 'undersized':
        return { bg: '#DBEAFE', color: '#1E40AF', label: 'Undersized' };
      default:
        return { bg: 'var(--bg-linen-dark)', color: 'var(--text-earth-dark)', label: condition };
    }
  };

  const displayedItems = items.slice(0, visibleCount);

  return (
    <div style={{ padding: '1.25rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="animate-fade-in">
      {/* Header Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-leaf-green)', fontWeight: 700, fontSize: '0.8rem' }}>
            <Eye size={16} />
            <span>PER-ONION CLASSIFICATION & DEFECT CROPS ({items.length} TOTAL IDENTIFIED)</span>
          </div>
          <h1 style={{ fontSize: '1.5rem', color: 'var(--text-earth-dark)', margin: '0.2rem 0 0 0' }}>
            {labels.classificationTitle}
          </h1>
        </div>

        <button
          onClick={onProceedToSummary}
          className="btn-leaf-green"
          style={{ padding: '0.75rem 1.5rem', fontSize: '0.95rem' }}
        >
          <span>Calculate Lot Grade</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Per-Onion Grid List */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: '1rem',
      }}>
        {displayedItems.map((onion) => {
          const badge = getBadgeStyle(onion.condition);
          return (
            <div
              key={onion.id}
              className="moa-card"
              style={{
                border: onion.isOverridden ? '2px solid var(--accent-terracotta)' : '1px solid var(--border-subtle)',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                {/* Header Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-earth-dark)' }}>
                    Onion Crop #{onion.onionIndex}
                  </span>

                  <span style={{
                    backgroundColor: badge.bg,
                    color: badge.color,
                    padding: '0.2rem 0.55rem',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                  }}>
                    {badge.label}
                  </span>
                </div>

                {/* Crop Box - Isolated Onion Crop Zoom */}
                <div style={{
                  height: '140px',
                  backgroundColor: '#0F172A',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '0.85rem',
                  border: `2.5px solid ${badge.color}`,
                  position: 'relative',
                  overflow: 'hidden',
                }}>
                  {onion.cropImageUrl ? (
                    <img
                      src={onion.cropImageUrl}
                      alt={`Cropped Bulb #${onion.onionIndex}`}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#0F172A',
                      }}
                    />
                  ) : items.length === 1 ? (
                    <img
                      src={imageUrl || "/mode-single.jpg"}
                      alt="Isolated Single Onion Crop"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'contain',
                        backgroundColor: '#FFFFFF',
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '100%',
                      height: '100%',
                      backgroundImage: `url('${imageUrl || "/mode-batch.jpg"}')`,
                      backgroundSize: `${Math.max(220, 10000 / Math.max(15, onion.bbox.width))}% ${Math.max(220, 10000 / Math.max(15, onion.bbox.height))}%`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: `${onion.bbox.x + onion.bbox.width / 2}% ${onion.bbox.y + onion.bbox.height / 2}%`,
                      transform: 'scale(1.15)',
                    }} />
                  )}

                  <span style={{
                    position: 'absolute',
                    bottom: '6px',
                    right: '6px',
                    fontSize: '0.7rem',
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    color: '#FFFFFF',
                    padding: '0.15rem 0.45rem',
                    borderRadius: '4px',
                    fontWeight: 700,
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  }}>
                    Conf: {Math.round(onion.confidence)}%
                  </span>
                </div>

                {/* Metrics */}
                <div style={{ fontSize: '0.82rem', color: 'var(--text-earth-brown)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <div>Diameter: <strong>{onion.diameterMm} mm</strong></div>
                  {onion.weightGrams && <div>Est. Weight: <strong>{onion.weightGrams} g</strong></div>}
                  {onion.defectDetails && (
                    <div style={{ fontSize: '0.75rem', color: '#991B1B', fontWeight: 600, marginTop: '0.25rem' }}>
                      ⚠️ {onion.defectDetails}
                    </div>
                  )}

                  {/* Overridden Badge */}
                  {onion.isOverridden && (
                    <div style={{
                      backgroundColor: 'var(--accent-terracotta-light)',
                      border: '1px solid var(--accent-terracotta)',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.35rem 0.5rem',
                      fontSize: '0.72rem',
                      color: 'var(--accent-terracotta-dark)',
                      marginTop: '0.35rem',
                      fontWeight: 700,
                    }}>
                      ✏️ Inspector Overridden from "{onion.originalCondition}"
                    </div>
                  )}
                </div>
              </div>

              {/* Override Button */}
              <button
                onClick={() => onOpenOverrideModal(onion)}
                className="btn-outline-brown"
                style={{ width: '100%', marginTop: '0.85rem', padding: '0.45rem', fontSize: '0.78rem' }}
              >
                <Edit3 size={14} />
                <span>{onion.isOverridden ? 'Edit Override' : labels.manualOverrideBtn}</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Pagination controls for large lots (e.g. 50-100 onions) */}
      {items.length > visibleCount && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
          <button
            onClick={() => setVisibleCount((prev) => prev + 32)}
            className="btn-outline-brown"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
          >
            Load Next 32 Crops (Showing {visibleCount} of {items.length})
          </button>
          <button
            onClick={() => setVisibleCount(items.length)}
            className="btn-leaf-green"
            style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem' }}
          >
            Show All ({items.length} Onions)
          </button>
        </div>
      )}
    </div>
  );
};
