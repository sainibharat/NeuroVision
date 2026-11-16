import React from 'react';
import { BookOpen, Terminal, FileCode, CheckSquare, FolderGit2 } from 'lucide-react';

export default function Documentation() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', paddingBottom: '60px' }}>
      <div>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '6px' }}>
          Project Documentation & Setup
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Detailed guide for running the Python ML pipeline, FastAPI backend, and React dashboard.
        </p>
      </div>

      {/* Notebooks Guide */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <FileCode size={20} color="var(--accent-cyan)" />
          Notebooks Development Series (01 - 06)
        </h3>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
          The machine learning development follows a sequential 6-stage pipeline originally developed in Google Colab:
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
          {[
            { name: '01_dataset_exploration.ipynb', desc: 'Dataset distribution, slice count inspection, corruption checks.' },
            { name: '02_preprocessing.ipynb', desc: 'Resizing, 3-channel RGB conversion, ImageNet transforms & augmentations.' },
            { name: '03_baseline_cnn.ipynb', desc: 'Custom 4-layer CNN trained from scratch to set initial baseline.' },
            { name: '04_resnet18_training.ipynb', desc: 'Pretrained ResNet18 transfer learning and layer fine-tuning.' },
            { name: '05_model_comparison.ipynb', desc: 'Evaluation of ResNet-18 vs. EfficientNet-B0 vs. Baseline CNN.' },
            { name: '06_gradcam.ipynb', desc: 'Hook registration and Grad-CAM class activation map extraction.' },
          ].map((nb, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              padding: '14px',
              borderRadius: '8px'
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: 600, marginBottom: '4px' }}>
                {nb.name}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                {nb.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Local execution guide */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Terminal size={20} color="var(--accent-emerald)" />
          Local Execution Instructions
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          <div>
            <strong style={{ color: '#fff' }}>1. Backend (FastAPI):</strong>
            <pre style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
              color: '#34d399',
              overflowX: 'auto'
            }}>
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
            </pre>
          </div>

          <div>
            <strong style={{ color: '#fff' }}>2. Frontend (React + Vite):</strong>
            <pre style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
              color: '#38bdf8',
              overflowX: 'auto'
            }}>
cd frontend
npm install
npm run dev
            </pre>
          </div>

          <div>
            <strong style={{ color: '#fff' }}>3. Running Unit Tests:</strong>
            <pre style={{
              background: 'rgba(0,0,0,0.4)',
              padding: '12px',
              borderRadius: '8px',
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
              color: '#f43f5e',
              overflowX: 'auto'
            }}>
pytest tests/
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
