import React from 'react';
import { ArrowRight, ShieldAlert, Cpu, Sparkles, CheckCircle2, Eye, Database } from 'lucide-react';

export default function Home({ onStartClick }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '64px', paddingBottom: '60px' }}>
      {/* Hero Section */}
      <div style={{
        textAlign: 'center',
        padding: '60px 0 20px',
        maxWidth: '850px',
        margin: '0 auto'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 14px',
          borderRadius: '9999px',
          background: 'rgba(6, 182, 212, 0.1)',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          color: 'var(--accent-cyan)',
          fontSize: '0.8rem',
          fontWeight: 600,
          marginBottom: '24px'
        }}>
          <Sparkles size={14} />
          <span>Explainable Deep Learning Prototype</span>
        </div>

        <h1 style={{
          fontSize: '2.8rem',
          fontWeight: 800,
          letterSpacing: '-0.03em',
          lineHeight: 1.15,
          marginBottom: '20px',
          background: 'linear-gradient(135deg, #ffffff 40%, #94a3b8 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          NeuroVision: Brain Tumor Classification & Explainability
        </h1>

        <p style={{
          fontSize: '1.15rem',
          color: 'var(--text-secondary)',
          lineHeight: 1.6,
          marginBottom: '36px'
        }}>
          A complete deep learning pipeline evaluating brain MRI scans across four distinct categories.
          Coupled with <strong>Grad-CAM</strong> visual attention maps to ensure interpretability and transparency in neural predictions.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px' }}>
          <button className="glow-btn" onClick={onStartClick} style={{ fontSize: '1rem', padding: '14px 32px' }}>
            <span>Launch Image Classifier</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </div>

      {/* Pipeline Diagram */}
      <div className="glass-panel" style={{ padding: '36px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '24px', textAlign: 'center' }}>
          End-to-End Technical Pipeline
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          position: 'relative'
        }}>
          {[
            { step: '01', title: 'MRI Ingestion', desc: 'Accepts axial/sagittal 2D brain MRI scans', icon: '📥' },
            { step: '02', title: 'Preprocessing', desc: 'Resizing to 224x224, ImageNet 3-channel normalization', icon: '⚙️' },
            { step: '03', title: 'Deep CNN Inference', desc: 'Fine-tuned ResNet18 / EfficientNet-B0 backbone', icon: '🧠' },
            { step: '04', title: 'Grad-CAM Activation', desc: 'Feature map gradients mapped onto input slice', icon: '🔥' },
            { step: '05', title: 'Clinical Dashboard', desc: 'Probability scores, overlay viewer, and disclaimer', icon: '📊' }
          ].map((item, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.5rem' }}>{item.icon}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-cyan)' }}>STEP {item.step}</span>
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginTop: '4px' }}>{item.title}</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Target Classes Cards */}
      <div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '8px', textAlign: 'center' }}>
          Target Classification Categories
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '32px' }}>
          Trained on standardized datasets to categorize 4 distinct clinical states
        </p>

        <div className="grid-2">
          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f43f5e' }}>
            <span className="badge badge-glioma" style={{ marginBottom: '12px' }}>Category 01</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Glioma</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Primary brain tumor originating from glial cells, typically exhibiting infiltrative margins and heterogeneous contrast enhancement.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #f59e0b' }}>
            <span className="badge badge-meningioma" style={{ marginBottom: '12px' }}>Category 02</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Meningioma</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Arises from the meninges (membranes enveloping brain and spinal cord). Often well-circumscribed with dural tail enhancement.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #8b5cf6' }}>
            <span className="badge badge-pituitary" style={{ marginBottom: '12px' }}>Category 03</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>Pituitary Tumor</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Develops in the sella turcica within the pituitary gland, frequently presenting with suprasellar extension.
            </p>
          </div>

          <div className="glass-panel" style={{ padding: '24px', borderLeft: '4px solid #10b981' }}>
            <span className="badge badge-notumor" style={{ marginBottom: '12px' }}>Category 04</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 600, marginBottom: '8px' }}>No Tumor (Healthy)</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Baseline control scans exhibiting normal ventricular symmetry, parenchymal intensity, and absence of mass effect.
            </p>
          </div>
        </div>
      </div>

      {/* Clinical Disclaimer */}
      <div style={{
        background: 'rgba(244, 63, 94, 0.08)',
        border: '1px solid rgba(244, 63, 94, 0.25)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        gap: '16px',
        alignItems: 'flex-start'
      }}>
        <ShieldAlert size={28} color="#f43f5e" style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f43f5e', marginBottom: '4px' }}>
            Important Medical Research Disclaimer
          </h4>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            NeuroVision is strictly an engineering and educational research prototype. It is not an FDA-cleared diagnostic device and should never replace qualified clinical radiological review. Model confidence scores reflect statistical patterns and not diagnostic certainty.
          </p>
        </div>
      </div>
    </div>
  );
}
