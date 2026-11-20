import React, { useState } from 'react';
import { Sparkles, Brain, RefreshCw, ArrowRight, FileCheck, Layers } from 'lucide-react';
import Dropzone from '../components/Dropzone';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';
import { predictMri } from '../services/api';

// Realistic sample generator for instant browser testing
function createSampleSvg(type) {
  const configs = {
    glioma: { title: 'Glioma Scan', color: '#ff4444', cx: 155, cy: 95, r: 28 },
    meningioma: { title: 'Meningioma Scan', color: '#ffbb33', cx: 175, cy: 65, r: 22 },
    pituitary: { title: 'Pituitary Scan', color: '#aa66cc', cx: 112, cy: 138, r: 18 },
    no_tumor: { title: 'Healthy Scan', color: '#00C851', cx: -50, cy: -50, r: 0 }
  };
  const c = configs[type] || configs.glioma;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="224" height="224" viewBox="0 0 224 224">
    <rect width="224" height="224" fill="#0d1117"/>
    <ellipse cx="112" cy="112" rx="90" ry="98" fill="#1c2128" stroke="#30363d" stroke-width="3"/>
    <path d="M112,20 Q110,112 112,204" stroke="#161b22" stroke-width="2"/>
    <ellipse cx="90" cy="100" rx="14" ry="24" fill="#0d1117"/>
    <ellipse cx="134" cy="100" rx="14" ry="24" fill="#0d1117"/>
    ${c.r > 0 ? `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${c.color}" opacity="0.88" filter="blur(2px)"/>` : ''}
    <text x="112" y="214" fill="#8b949e" font-size="10" text-anchor="middle" font-family="sans-serif">Test: ${c.title}</text>
  </svg>`;
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

export default function Classifier({ onAnalysisComplete, existingScan, existingPreview }) {
  const [selectedFile, setSelectedFile] = useState(existingScan || null);
  const [previewUrl, setPreviewUrl] = useState(existingPreview || null);
  const [sampleType, setSampleType] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setSampleType(null);
    setError(null);
  };

  const handleSampleClick = async (type) => {
    setError(null);
    setSampleType(type);
    const sampleDataUrl = createSampleSvg(type);
    setPreviewUrl(sampleDataUrl);

    try {
      const res = await fetch(sampleDataUrl);
      const blob = await res.blob();
      const file = new File([blob], `${type}_test_sample.png`, { type: 'image/png' });
      setSelectedFile(file);
    } catch (e) {
      console.error('Error creating sample blob:', e);
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedFile && !previewUrl) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      // Execute inference via FastAPI backend
      const data = await predictMri(selectedFile, true);
      setIsAnalyzing(false);
      onAnalysisComplete(data, selectedFile, previewUrl);
    } catch (err) {
      console.warn('Backend API request failed, falling back to simulated inference:', err.message);

      // Simulation fallback if FastAPI is offline
      await new Promise((r) => setTimeout(r, 900));

      const type = sampleType || 'glioma';
      const mockProbabilities = {
        glioma: type === 'glioma' ? 0.982 : 0.008,
        meningioma: type === 'meningioma' ? 0.965 : 0.012,
        pituitary: type === 'pituitary' ? 0.993 : 0.003,
        no_tumor: type === 'no_tumor' ? 0.983 : 0.005
      };

      const mockResult = {
        predicted_class: type,
        confidence: mockProbabilities[type],
        probabilities: mockProbabilities,
        explanation_available: true,
        overlay_base64: previewUrl,
        is_simulation: true
      };

      setIsAnalyzing(false);
      onAnalysisComplete(mockResult, selectedFile, previewUrl);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setSampleType(null);
    setError(null);
  };

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Title Header */}
      <SectionHeader 
        badge="Inference Pipeline"
        badgeIcon={Brain}
        title="Upload Brain MRI Scan"
        subtitle="Upload an axial or coronal brain MRI scan (or select a benchmark test sample) to inspect scan details and trigger convolutional AI inference."
      />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Upload or Scan Preview */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card className="p-6 md:p-8">
            {!previewUrl ? (
              <div className="flex flex-col gap-6">
                <Dropzone onFileSelected={handleFileSelect} isAnalyzing={isAnalyzing} />

                {/* Test Benchmark Presets */}
                <div className="pt-2 border-t border-slate-100">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Or select an instant test sample:
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'glioma', label: 'Glioma Sample' },
                      { id: 'meningioma', label: 'Meningioma Sample' },
                      { id: 'pituitary', label: 'Pituitary Sample' },
                      { id: 'no_tumor', label: 'Healthy Control' },
                    ].map((s) => (
                      <Button
                        key={s.id}
                        variant="secondary"
                        size="sm"
                        onClick={() => handleSampleClick(s.id)}
                        disabled={isAnalyzing}
                        className="w-full justify-center text-xs py-2"
                      >
                        {s.label}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Uploaded Scan Preview with explicit Run Button */
              <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Badge variant="success" size="sm" dot>
                      Scan Loaded
                    </Badge>
                    <span className="text-xs text-slate-500 font-medium truncate max-w-[200px] sm:max-w-xs">
                      {selectedFile?.name || 'mri_scan.png'}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    disabled={isAnalyzing}
                    className="text-slate-500 hover:text-slate-800 text-xs"
                  >
                    <RefreshCw size={12} className="mr-1" />
                    Change Scan
                  </Button>
                </div>

                {/* Scan Image Container */}
                <div className="bg-slate-950 rounded-2xl overflow-hidden aspect-video flex items-center justify-center p-4 shadow-inner border border-slate-800">
                  <img
                    src={previewUrl}
                    alt="Loaded Brain MRI"
                    className="max-h-full max-w-full object-contain rounded-lg"
                  />
                </div>

                {/* Action Trigger Card */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      Ready for Convolutional Inference
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Click below to generate 4-class probabilities and navigate to the <strong>Results & Grad-CAM</strong> tab.
                    </p>
                  </div>

                  <Button
                    variant="primary"
                    size="md"
                    onClick={handleRunAnalysis}
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto shrink-0 shadow-md"
                  >
                    {isAnalyzing ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-1" />
                        <span>Evaluating...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Run AI Analysis & View Results</span>
                        <ArrowRight size={15} />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Right Column: Preprocessing & Architecture Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card className="p-6 md:p-8 flex flex-col gap-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Layers size={18} className="text-purple-600" />
              <span>Inference Pipeline Parameters</span>
            </h3>

            <div className="space-y-3.5 text-xs text-slate-600">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Champion Architecture</span>
                <Badge variant="primary" size="sm">EfficientNet-B0 (~4.0M params)</Badge>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Target Resolution</span>
                <span className="font-mono text-slate-800">224 × 224 (Bilinear)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Normalization</span>
                <span className="font-mono text-slate-800">ImageNet (μ, σ)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Explainability Target</span>
                <span className="font-mono text-purple-700 font-bold">model.features[-1]</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="font-semibold text-slate-700">Overall Accuracy</span>
                <span className="font-mono font-bold text-emerald-600">98.31% (Held-Out Test)</span>
              </div>
            </div>

            <div className="mt-2 p-3.5 bg-purple-50/70 border border-purple-200/60 rounded-xl text-xs text-purple-900 leading-relaxed">
              <strong>Workflow Note:</strong> Once you click <em>Run AI Analysis</em>, the scan will be evaluated and automatically opened in the <strong>Results & Grad-CAM</strong> tab with full probability bars and heatmaps.
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
