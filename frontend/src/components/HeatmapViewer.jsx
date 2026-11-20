import React, { useState } from 'react';
import { Layers, Sliders } from 'lucide-react';
import Card from './ui/Card';

export default function HeatmapViewer({ originalUrl, overlayBase64 }) {
  const [viewMode, setViewMode] = useState('side-by-side'); // 'side-by-side' | 'overlay' | 'original'
  const [opacity, setOpacity] = useState(80);

  const overlaySrc = overlayBase64
    ? (overlayBase64.startsWith('data:') ? overlayBase64 : `data:image/png;base64,${overlayBase64}`)
    : null;

  return (
    <Card className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Layers size={18} className="text-purple-600" />
            <span>Grad-CAM Spatial Explainability Heatmap</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Highlights convolutional activation in <code className="bg-slate-100 text-purple-700 px-1 py-0.5 rounded font-mono">model.features[-1]</code>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Opacity slider for Overlay Mode */}
          {viewMode === 'overlay' && (
            <div className="flex items-center gap-2 bg-slate-900/5 px-3 py-1.5 rounded-full border border-slate-900/10 text-xs">
              <Sliders size={13} className="text-purple-600" />
              <span className="font-semibold text-slate-700">Opacity: {opacity}%</span>
              <input
                type="range"
                min="0"
                max="100"
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-20 accent-purple-600 cursor-pointer"
              />
            </div>
          )}

          {/* View Mode Toggle Pills */}
          <div className="flex gap-1 bg-slate-900/5 p-1 rounded-full border border-slate-900/10">
            {['side-by-side', 'overlay', 'original'].map((mode) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`text-xs font-semibold capitalize px-3.5 py-1.5 rounded-full transition-all duration-200 ${
                  viewMode === mode
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {mode.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Visual Displays */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 text-center">
              Input MRI Scan (224×224)
            </span>
            <div className="bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center aspect-square shadow-inner border border-slate-800">
              <img
                src={originalUrl}
                alt="Input MRI Scan"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-semibold text-purple-600 text-center">
              Grad-CAM Class Activation Overlay
            </span>
            <div className="bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center aspect-square shadow-inner border-2 border-purple-500/50">
              {overlaySrc ? (
                <img
                  src={overlaySrc}
                  alt="Grad-CAM Overlay"
                  className="w-full h-full object-contain"
                />
              ) : (
                <span className="text-xs text-slate-500">Processing heatmap...</span>
              )}
            </div>
          </div>
        </div>
      ) : viewMode === 'overlay' ? (
        <div className="relative bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center max-h-[460px] aspect-square mx-auto border-2 border-purple-500/50 shadow-inner">
          <img
            src={originalUrl}
            alt="Base MRI Scan"
            className="w-full h-full object-contain"
          />
          {overlaySrc && (
            <img
              src={overlaySrc}
              alt="Grad-CAM Heatmap"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none transition-opacity duration-150"
              style={{ opacity: opacity / 100 }}
            />
          )}
        </div>
      ) : (
        <div className="bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center max-h-[460px] aspect-square mx-auto border border-slate-800 shadow-inner">
          <img
            src={originalUrl}
            alt="Original MRI"
            className="w-full h-full object-contain"
          />
        </div>
      )}

      {/* Colormap Legend */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3.5 rounded-xl bg-white/70 border border-slate-900/5 text-xs text-slate-600 font-semibold">
        <span>Low Attention (Cold / Blue)</span>
        <div 
          className="h-2 w-48 rounded-full shadow-sm"
          style={{
            background: 'linear-gradient(to right, #0000ff, #00ffff, #00ff00, #ffff00, #ff0000)',
          }} 
        />
        <span>Peak Tumor Focus (Hot / Red)</span>
      </div>
    </Card>
  );
}
