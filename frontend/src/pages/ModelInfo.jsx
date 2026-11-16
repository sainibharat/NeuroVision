import React from 'react';
import { BarChart3, CheckCircle, Database, Layers, ShieldCheck, Cpu } from 'lucide-react';

export default function ModelInfo() {
  const models = [
    {
      name: 'Baseline CNN',
      type: 'Custom 4-Block CNN',
      params: '~2.5M',
      valAccuracy: '92.04%',
      valF1: '0.9222',
      role: 'Baseline Benchmark'
    },
    {
      name: 'ResNet-18',
      type: 'Transfer Learning (ImageNet)',
      params: '11.2M',
      valAccuracy: '96.64%',
      valF1: '0.9657',
      role: 'Comparative Backbone'
    },
    {
      name: 'EfficientNet-B0 (Selected)',
      type: 'Transfer Learning (ImageNet, Fine-Tuned)',
      params: '4.0M',
      valAccuracy: '98.43%',
      valF1: '0.9830',
      role: 'Production Architecture',
      highlight: true
    }
  ];

  const confusionData = [
    { label: 'Glioma', row: [323, 4, 1, 0], total: 328 },
    { label: 'Meningioma', row: [5, 214, 1, 1], total: 221 },
    { label: 'No Tumor', row: [1, 0, 116, 1], total: 118 },
    { label: 'Pituitary', row: [0, 0, 1, 221], total: 222 }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '36px', paddingBottom: '60px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          Model Architecture & Evaluation Benchmarks
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Comparative analysis and held-out test set performance (889 scans) from Colab Notebooks 01–06.
        </p>
      </div>

      {/* Primary Test Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Test Accuracy</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            98.31%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>874 / 889 Correct</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Macro F1-Score</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            0.9826
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Balanced across 4 classes</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Tumor Sensitivity</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-blue)', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            99.61%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>True Positive Tumor Rate</div>
        </div>

        <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Healthy Specificity</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#a855f7', fontFamily: 'var(--font-mono)', marginTop: '4px' }}>
            98.31%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>True Negative Healthy Rate</div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Cpu size={20} color="var(--accent-cyan)" />
          Validation Architecture Comparison (Notebooks 02, 03, 04)
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '12px 16px' }}>Architecture</th>
                <th style={{ padding: '12px 16px' }}>Approach</th>
                <th style={{ padding: '12px 16px' }}>Parameters</th>
                <th style={{ padding: '12px 16px' }}>Validation Accuracy</th>
                <th style={{ padding: '12px 16px' }}>Validation Macro F1</th>
                <th style={{ padding: '12px 16px' }}>Outcome</th>
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
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#10b981' }}>{m.valAccuracy}</td>
                  <td style={{ padding: '14px 16px', fontFamily: 'var(--font-mono)' }}>{m.valF1}</td>
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

      {/* Confusion Matrix & Class Breakdown */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChart3 size={18} color="var(--accent-cyan)" />
            Official Test Confusion Matrix
          </h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
            Held-out test set (n = 889 scans) evaluated in Notebook 05:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '8px',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.85rem',
            textAlign: 'center'
          }}>
            {confusionData.flatMap((c, rIdx) =>
              c.row.map((val, cIdx) => {
                const isMatch = rIdx === cIdx;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    style={{
                      background: isMatch ? 'rgba(16, 185, 129, 0.2)' : val > 0 ? 'rgba(244, 63, 94, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                      border: `1px solid ${isMatch ? 'rgba(16, 185, 129, 0.4)' : val > 0 ? 'rgba(244, 63, 94, 0.3)' : 'rgba(255,255,255,0.05)'}`,
                      color: isMatch ? '#34d399' : val > 0 ? '#fb7185' : 'var(--text-muted)',
                      padding: '14px 6px',
                      borderRadius: '8px',
                      fontWeight: isMatch ? 700 : 400
                    }}
                  >
                    <div style={{ fontSize: '1.1rem' }}>{val}</div>
                  </div>
                );
              })
            )}
          </div>

          <div style={{ marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
            Order: Glioma (328) • Meningioma (221) • No Tumor (118) • Pituitary (222)
          </div>
        </div>

        {/* Explainability Math & Methodology */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={18} color="var(--accent-purple)" />
            Grad-CAM Explainability (Notebook 06)
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '14px' }}>
            Grad-CAM targets <code>model.features[-1]</code> on EfficientNet-B0 (last convolutional block, generating 7×7 feature maps):
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
            • <strong>Global Average Pooling:</strong> Calculates channel importance weights \(\alpha_k\) from backpropagated class gradients.<br/>
            • <strong>ReLU Rectification:</strong> Retains features positively correlated with the tumor class score.<br/>
            • <strong>Upsampling & Jet Colormap:</strong> Scaled bilinearly to 224×224 and blended over the scan at \(\alpha = 0.45\).
          </p>
        </div>
      </div>
    </div>
  );
}
