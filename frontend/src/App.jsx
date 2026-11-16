import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Classifier from './pages/Classifier';
import ModelInfo from './pages/ModelInfo';
import Documentation from './pages/Documentation';
import { checkApiHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [apiOnline, setApiOnline] = useState(false);

  useEffect(() => {
    // Initial health check
    checkApiHealth().then((res) => {
      if (res && res.status === 'healthy') {
        setApiOnline(true);
      }
    });

    const interval = setInterval(() => {
      checkApiHealth().then((res) => {
        setApiOnline(Boolean(res && res.status === 'healthy'));
      });
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiOnline={apiOnline}
      />

      <main className="container" style={{ flex: 1, paddingTop: '36px' }}>
        {activeTab === 'home' && <Home onStartClick={() => setActiveTab('classify')} />}
        {activeTab === 'classify' && <Classifier />}
        {activeTab === 'model' && <ModelInfo />}
        {activeTab === 'docs' && <Documentation />}
      </main>

      <footer style={{
        borderTop: '1px solid var(--border-color)',
        padding: '24px 0',
        textAlign: 'center',
        fontSize: '0.8rem',
        color: 'var(--text-muted)',
        background: 'rgba(10, 14, 23, 0.95)'
      }}>
        <div className="container">
          NeuroVision • Explainable Deep Learning for Brain Tumor Classification • Educational & Research Prototype
        </div>
      </footer>
    </div>
  );
}
