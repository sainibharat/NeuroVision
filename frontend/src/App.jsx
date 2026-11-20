import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Classifier from './pages/Classifier';
import Results from './pages/Results';
import ModelInfo from './pages/ModelInfo';
import { checkApiHealth } from './services/api';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [apiOnline, setApiOnline] = useState(false);

  // Analysis State shared between Classifier & Results tabs
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);

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
    }, 12000);

    return () => clearInterval(interval);
  }, []);

  const handleAnalysisComplete = (result, file, preview) => {
    setAnalysisResult(result);
    setSelectedFile(file);
    setPreviewUrl(preview);
    // Transition to 3rd tab: Results & Grad-CAM
    setActiveTab('results');
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        apiOnline={apiOnline}
        hasResults={Boolean(analysisResult)}
      />

      <main className="max-w-7xl mx-auto px-6 w-full flex-1 pt-6">
        {/* Tab 1: Overview */}
        {activeTab === 'home' && (
          <Home
            onStartClick={() => setActiveTab('classify')}
          />
        )}

        {/* Tab 2: Classifier (Upload scan & Run Analysis button) */}
        {activeTab === 'classify' && (
          <Classifier
            onAnalysisComplete={handleAnalysisComplete}
            existingScan={selectedFile}
            existingPreview={previewUrl}
          />
        )}

        {/* Tab 3: Results & Grad-CAM (Primary Findings & Heatmap) */}
        {activeTab === 'results' && (
          <Results
            result={analysisResult}
            previewUrl={previewUrl}
            selectedFile={selectedFile}
            onNewScanClick={() => setActiveTab('classify')}
          />
        )}

        {/* Tab 4: Science & Metrics (Benchmarks & Model Arch) */}
        {activeTab === 'model' && (
          <ModelInfo />
        )}
      </main>

      <footer className="border-t border-slate-900/10 bg-white/70 backdrop-blur-xl py-6 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div>
            <strong className="text-slate-800">NeuroVision</strong> • Explainable Deep Learning for Brain Tumor Classification
          </div>
          <div className="text-[0.72rem] text-slate-400">
            EfficientNet-B0 (98.31% Test Acc) • Grad-CAM XAI • Research Portfolio System
          </div>
        </div>
      </footer>
    </div>
  );
}
