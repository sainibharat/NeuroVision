import React, { useState } from 'react';
import { UploadCloud, AlertCircle } from 'lucide-react';

export default function Dropzone({ onFileSelected, isAnalyzing, disabled = false }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (disabled || isAnalyzing) return;
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSelect = (file) => {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file (.jpg, .jpeg, .png, .tiff, .bmp)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15 MB limit.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled || isAnalyzing) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSelect(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSelect(e.target.files[0]);
    }
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isAnalyzing && !disabled && document.getElementById('mri-file-input').click()}
        className={`border-2 border-dashed rounded-3xl p-8 md:p-12 text-center transition-all duration-200 cursor-pointer ${
          dragActive
            ? 'border-purple-500 bg-purple-50/70'
            : 'border-slate-300 hover:border-slate-400 bg-white/40 hover:bg-white/60'
        } ${isAnalyzing ? 'opacity-50 cursor-wait' : ''}`}
      >
        <input
          id="mri-file-input"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
          disabled={isAnalyzing || disabled}
        />

        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shadow-md shadow-blue-500/10">
          <UploadCloud size={26} />
        </div>

        <h3 className="text-lg font-bold text-slate-900 mb-1">
          Upload Brain MRI Scan
        </h3>
        <p className="text-sm text-slate-600 mb-3">
          Drag and drop your scan here, or <span className="text-purple-600 font-semibold underline underline-offset-2">browse files</span>
        </p>
        <div className="text-xs text-slate-400">
          Supports PNG, JPG, JPEG, TIFF • Max 15MB
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-rose-600 text-xs bg-rose-50 border border-rose-200 rounded-xl px-4 py-2.5">
          <AlertCircle size={15} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
