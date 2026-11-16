import React from 'react';

const CLASS_CONFIG = {
  glioma: { label: 'Glioma', color: '#f43f5e', bg: 'rgba(244, 63, 94, 0.15)' },
  meningioma: { label: 'Meningioma', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.15)' },
  pituitary: { label: 'Pituitary Tumor', color: '#8b5cf6', bg: 'rgba(139, 92, 246, 0.15)' },
  notumor: { label: 'No Tumor (Normal)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
  no_tumor: { label: 'No Tumor (Normal)', color: '#10b981', bg: 'rgba(16, 185, 129, 0.15)' },
};

export default function ProbabilityBar({ probabilities = {}, predictedClass = '' }) {
  const entries = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
      {entries.map(([clsKey, prob]) => {
        const config = CLASS_CONFIG[clsKey.toLowerCase()] || {
          label: clsKey,
          color: '#3b82f6',
          bg: 'rgba(59, 130, 246, 0.15)',
        };
        const percentage = (prob * 100).toFixed(1);
        const isPredicted = clsKey.toLowerCase() === predictedClass.toLowerCase();

        return (
          <div key={clsKey} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: isPredicted ? 700 : 500, color: isPredicted ? '#fff' : 'var(--text-secondary)' }}>
                  {config.label}
                </span>
                {isPredicted && (
                  <span style={{
                    fontSize: '0.65rem',
                    background: config.color,
                    color: '#fff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontWeight: 700,
                    textTransform: 'uppercase'
                  }}>
                    Predicted
                  </span>
                )}
              </div>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                color: isPredicted ? config.color : 'var(--text-muted)'
              }}>
                {percentage}%
              </span>
            </div>

            {/* Progress Bar Container */}
            <div style={{
              width: '100%',
              height: '8px',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '9999px',
              overflow: 'hidden',
              border: isPredicted ? `1px solid ${config.color}50` : 'none'
            }}>
              <div style={{
                height: '100%',
                width: `${percentage}%`,
                backgroundColor: config.color,
                borderRadius: '9999px',
                transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: isPredicted ? `0 0 10px ${config.color}80` : 'none'
              }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
