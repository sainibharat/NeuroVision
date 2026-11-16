import React, { useState } from 'react';
import { Layers, Eye, Sliders } from 'lucide-react';

export default function HeatmapViewer({ originalUrl, overlayBase64 }) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'overlay' | 'original'

  const overlaySrc = overlayBase64
    ? (overlayBase64.startsWith('data:') ? overlayBase64 : `data:image/png;base64,${overlayBase64}`)
    : null;

  return (
    <div className="glass-panel" style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-cyan)" />
            Grad-CAM Explainability Heatmap
          </h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Highlights convolutional activation regions that directed the model's decision
          </p>
        </div>

        {/* View mode toggle buttons */}
        <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '3px', borderRadius: '8px' }}>
          {['side-by-side', 'overlay', 'original'].map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              style={{
                fontSize: '0.75rem',
                textTransform: 'capitalize',
                padding: '4px 10px',
                borderRadius: '6px',
                background: viewMode === mode ? 'var(--accent-blue)' : 'transparent',
                color: viewMode === mode ? '#fff' : 'var(--text-secondary)'
              }}
            >
              {mode.replace('-', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Image Display */}
      {viewMode === 'side-by-side' ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '8px', textAlign: 'center' }}>
              Input MRI Scan
            </div>
            <div style={{
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1/1',
              border: '1px solid var(--border-color)'
            }}>
              <img
                src={originalUrl}
                alt="Original MRI"
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              />
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-cyan)', marginBottom: '8px', textAlign: 'center' }}>
              Grad-CAM Class Activation Overlay
            </div>
            <div style={{
              background: '#000',
              borderRadius: '12px',
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              aspectRatio: '1/1',
              border: '1px solid rgba(6, 182, 212, 0.4)'
            }}>
              {overlaySrc ? (
                <img
                  src={overlaySrc}
                  alt="Grad-CAM Overlay"
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Grad-CAM processing...</span>
              )}
            </div>
          </div>
        </div>
      ) : viewMode === 'overlay' ? (
        <div style={{
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: '400px',
          border: '1px solid rgba(6, 182, 212, 0.4)'
        }}>
          <img
            src={overlaySrc || originalUrl}
            alt="Grad-CAM Overlay"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
      ) : (
        <div style={{
          background: '#000',
          borderRadius: '12px',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          maxHeight: '400px',
          border: '1px solid var(--border-color)'
        }}>
          <img
            src={originalUrl}
            alt="Original MRI"
            style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>
      )}

      {/* Legend */}
      <div style={{
        marginTop: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 14px',
        borderRadius: '8px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        fontSize: '0.75rem',
        color: 'var(--text-secondary)'
      }}>
        <span>Low Activation (Cold / Blue)</span>
        <div style={{
          height: '8px',
          width: '180px',
          borderRadius: '4px',
          background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)'
        }} />
        <span>High Activation (Hot / Red)</span>
      </div>
    </div>
  );
}
