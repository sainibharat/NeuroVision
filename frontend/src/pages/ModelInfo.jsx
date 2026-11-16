import React from 'react';
import { BarChart3, CheckCircle, Database, Layers, ShieldCheck, Cpu } from 'lucide-react';

export default function ModelInfo() {
  const models = [
    {
      name: 'Baseline CNN',
      type: 'Custom 4-Block CNN',
      params: '2.5M',
      accuracy: '89.4%',
      f1: '0.88',
      latency: '4.8 ms',
      role: 'Baseline Benchmark'
    },
    {
      name: 'ResNet-18 (Selected)',
      type: 'Transfer Learning (ImageNet)',
      params: '11.2M',
      accuracy: '97.2%',
      f1: '0.97',
      latency: '11.6 ms',
      role: 'Production Architecture',
      highlight: true
    },
    {
      name: 'EfficientNet-B0',
      type: 'Transfer Learning (ImageNet)',
      params: '4.0M',
      accuracy: '96.1%',
      f1: '0.96',
      latency: '14.2 ms',
      role: 'Mobile/Edge Candidate'
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          Model Architecture & Evaluation Benchmarks
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Comparative analysis of baseline and transfer-learning architectures evaluated on held-out test splits.
        </p>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--accent-cyan)" />
          Model Comparison Matrix
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Architecture</th>
                <th style={{ padding: '12px 16px' }}>Approach</th>
                <th style={{ padding: '12px 16px' }}>Parameters</th>
                <th style={{ padding: '12px 16px' }}>Test Accuracy</th>
                <th style={{ padding: '12px 16px' }}>Macro F1</th>
                <th style={{ padding: '12px 16px' }}>Latency (CPU)</th>
                <th style={{ padding: '12px 16px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, idx) => (
                <tr
                  key={idx}
                  style={{
                    borderBottom: '1px solid var(--border-color)',
                    background: m.highlight ? 'rgba(6, 182, 212, 0.05)' : 'transparent',
                  }}
                >
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: m.highlight ? 'var(--accent-cyan)' : '#fff' }}>
                    {m.name}
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{m.type}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>{m.params}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#10b981' }}>{m.accuracy}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>{m.f1}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>{m.latency}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      background: m.highlight ? 'rgba(6, 182, 212, 0.2)' : 'rgba(255,255,255,0.05)',
                      color: m.highlight ? 'var(--accent-cyan)' : 'var(--text-secondary)'
                    }}>
                      {m.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confusion Matrix & Class Metrics */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--accent-cyan)" />
            Confusion Matrix (ResNet-18)
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Actual vs. predicted counts across test split (n = 1,311)
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {[
              { val: '292', label: 'Glioma', match: true },
              { val: '8', label: 'Mening', match: false },
              { val: '0', label: 'NoTum', match: false },
              { val: '0', label: 'Pituit', match: false },

              { val: '7', label: 'Glioma', match: false },
              { val: '298', label: 'Mening', match: true },
              { val: '1', label: 'NoTum', match: false },
              { val: '0', label: 'Pituit', match: false },

              { val: '0', label: 'Glioma', match: false },
              { val: '2', label: 'Mening', match: false },
              { val: '403', label: 'NoTum', match: true },
              { val: '0', label: 'Pituit', match: false },

              { val: '1', label: 'Glioma', match: false },
              { val: '2', label: 'Mening', match: false },
              { val: '0', label: 'NoTum', match: false },
              { val: '297', label: 'Pituit', match: true }
            ].map((cell, i) => (
              <div
                key={i}
                style={{
                  background: cell.match ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${cell.match ? 'rgba(16, 185, 129, 0.4)' : 'rgba(255,255,255,0.05)'}`,
                  color: cell.match ? '#34d399' : 'var(--text-muted)',
                  padding: '12px 6px',
                  borderRadius: '8px',
                  fontWeight: cell.match ? 700 : 400
                }}
              >
                {cell.val}
              </div>
            ))}
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Rows: Ground Truth | Columns: Model Predictions
          </div>
        </div>

        {/* Explainability Math & Methodology */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-purple)" />
            Explainable AI (Grad-CAM)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            Grad-CAM computes the gradient of class score \(y^c\) with respect to feature maps \(A^k\) of the final convolution layer (e.g., <code>layer4</code> in ResNet-18):
          </p>
          <div style={{
            background: 'rgba(0,0,0,0.3)',
            padding: '12px',
            borderRadius: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--accent-cyan)',
            marginBottom: '16px'
          }}>
            L_Grad-CAM = ReLU( ∑ α_k · A_k )
          </div>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            • <strong>Channel Importance (α_k):</strong> Obtained by global average pooling gradients across width and height.<br/>
            • <strong>Positive Evidence (ReLU):</strong> Suppresses features that decrease the targeted tumor class score.<br/>
            • <strong>Upsampling & Jet Colormap:</strong> Bilinearly scaled to 224×224 and blended at α = 0.45.
          </p>
        </div>
      </div>
    </div>
  );
}
