import React, { useState } from 'react';
import { UploadCloud, Image as ImageIcon, AlertCircle } from 'lucide-react';

export default function Dropzone({ onFileSelected, isAnalyzing }) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
      setError('Please select a valid image file (.jpg, .jpeg, .png, etc.)');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setError('File size exceeds the 15 MB threshold.');
      return;
    }

    onFileSelected(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

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
    <div>
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragActive ? 'var(--accent-cyan)' : 'rgba(255, 255, 255, 0.15)'}`,
          borderRadius: '16px',
          padding: '40px 24px',
          textAlign: 'center',
          backgroundColor: dragActive ? 'rgba(6, 182, 212, 0.05)' : 'rgba(255, 255, 255, 0.02)',
          transition: 'all 0.2s ease',
          cursor: isAnalyzing ? 'wait' : 'pointer',
          position: 'relative'
        }}
        onClick={() => document.getElementById('mri-file-input').click()}
      >
        <input
          id="mri-file-input"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
          disabled={isAnalyzing}
        />

        <div style={{
          width: '56px',
          height: '56px',
          margin: '0 auto 16px',
          borderRadius: '50%',
          backgroundColor: 'rgba(6, 182, 212, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)'
        }}>
          <UploadCloud size={28} />
        </div>

        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '6px' }}>
          Upload MRI Scan Image
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
          Drag and drop your scan here, or <span style={{ color: 'var(--accent-cyan)', textDecoration: 'underline' }}>browse</span>
        </p>

        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Supports JPG, PNG, DICOM-exported BMP/TIFF • Max 15MB
        </div>
      </div>

      {error && (
        <div style={{
          marginTop: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--accent-rose)',
          fontSize: '0.85rem'
        }}>
          <AlertCircle size={16} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
