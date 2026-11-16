import React from 'react';
import { Activity, Brain, FileText, BarChart3 } from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, apiOnline }) {
  const tabs = [
    { id: 'home', label: 'Overview', icon: Brain },
    { id: 'classify', label: 'Classify & Explain', icon: Activity },
    { id: 'model', label: 'Model Benchmarks', icon: BarChart3 },
    { id: 'docs', label: 'Documentation', icon: FileText },
  ];

  return (
    <nav style={{
      borderBottom: '1px solid var(--border-color)',
      background: 'rgba(10, 14, 23, 0.85)',
      backdropFilter: 'blur(16px)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      padding: '16px 0'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div 
          onClick={() => setActiveTab('home')}
          style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
        >
          <div style={{
            background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
            borderRadius: '12px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.4)'
          }}>
            <Brain size={24} color="#ffffff" />
          </div>
          <div>
            <h1 style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', background: 'linear-gradient(90deg, #fff, #94a3b8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              NeuroVision
            </h1>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Explainable Deep Learning for Brain MRI</p>
          </div>
        </div>

        {/* Tab buttons */}
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(255,255,255,0.03)', padding: '4px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  transition: 'all 0.2s',
                  background: isActive ? 'linear-gradient(135deg, #3b82f6, #06b6d4)' : 'transparent',
                  color: isActive ? '#ffffff' : 'var(--text-secondary)',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Backend Status indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
          <span style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            backgroundColor: apiOnline ? '#10b981' : '#f59e0b',
            boxShadow: apiOnline ? '0 0 10px #10b981' : '0 0 10px #f59e0b'
          }} />
          <span>{apiOnline ? 'FastAPI Connected' : 'Local Standby'}</span>
        </div>
      </div>
    </nav>
  );
}
