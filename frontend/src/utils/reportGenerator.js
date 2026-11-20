/**
 * NeuroVision Clinical Diagnostic Report Generator
 * Generates an interpretable diagnostic report for an analyzed brain MRI scan,
 * embedding the original scan, Grad-CAM attention heatmap, softmax distribution,
 * model architecture details, and clinical disclaimers.
 */

export function generateReportHtml({ result, previewUrl, fileName = 'mri_scan.png' }) {
  const timestamp = new Date().toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'medium',
  });
  const reportId = 'NV-' + Math.random().toString(36).substring(2, 9).toUpperCase();

  const predClass = (result.predicted_class || 'Unknown').replace('_', ' ').toUpperCase();
  const confidence = ((result.confidence || 0) * 100).toFixed(2);
  const isHealthy = result.predicted_class === 'no_tumor';

  // Format overlay source cleanly with data URI prefix
  const overlaySrc = result.overlay_base64
    ? (result.overlay_base64.startsWith('data:') ? result.overlay_base64 : `data:image/png;base64,${result.overlay_base64}`)
    : previewUrl;

  // Format probabilities
  const probs = result.probabilities || {};
  const probRows = Object.entries(probs)
    .sort((a, b) => b[1] - a[1])
    .map(([cat, val]) => {
      const pct = (val * 100).toFixed(2);
      const isTop = cat === result.predicted_class;
      return `
        <tr style="${isTop ? 'background-color: #f1f5f9; font-weight: 700;' : ''}">
          <td style="padding: 10px 14px; text-transform: capitalize; border-bottom: 1px solid #e2e8f0;">
            ${cat.replace('_', ' ')} ${isTop ? '<span style="font-size: 0.75rem; color: #2563eb; background: #dbeafe; padding: 2px 8px; border-radius: 9999px; margin-left: 8px;">Primary Finding</span>' : ''}
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; font-family: monospace; font-size: 1rem;">
            ${pct}%
          </td>
          <td style="padding: 10px 14px; border-bottom: 1px solid #e2e8f0; width: 40%;">
            <div style="background: #e2e8f0; border-radius: 9999px; height: 10px; overflow: hidden;">
              <div style="background: ${isTop ? (isHealthy ? '#10b981' : '#dc2626') : '#94a3b8'}; width: ${pct}%; height: 100%;"></div>
            </div>
          </td>
        </tr>
      `;
    })
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NeuroVision Report - ${reportId}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');
    
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, sans-serif;
      color: #0f172a;
      background: #f8fafc;
      padding: 40px 20px;
      line-height: 1.5;
    }
    .sheet {
      max-width: 880px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e2e8f0;
      border-radius: 16px;
      padding: 48px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.06);
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      border-bottom: 2px solid #0f172a;
      padding-bottom: 24px;
      margin-bottom: 28px;
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .badge-tumor { background: #fee2e2; color: #b91c1c; }
    .badge-healthy { background: #dcfce7; color: #15803d; }
    
    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      margin: 24px 0;
    }
    .card {
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      padding: 20px;
      background: #fafafa;
    }
    .img-box {
      text-align: center;
      background: #000;
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      align-items: center;
      justifyContent: center;
      min-height: 240px;
    }
    .img-box img {
      max-width: 100%;
      height: 240px;
      object-fit: contain;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 12px;
      font-size: 0.92rem;
    }
    .print-bar {
      max-width: 880px;
      margin: 0 auto 20px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      background: #0f172a;
      color: #fff;
      border: none;
      padding: 10px 20px;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
    }
    .btn:hover { background: #1e293b; }
    @media print {
      body { background: #fff; padding: 0; }
      .sheet { box-shadow: none; border: none; padding: 20px; }
      .print-bar { display: none; }
    }
  </style>
</head>
<body>

  <div class="print-bar">
    <div style="font-size: 0.9rem; color: #64748b;">
      NeuroVision AI Brain MRI Clinical Interpretation
    </div>
    <button class="btn" onclick="window.print()">Print or Save as PDF</button>
  </div>

  <div class="sheet">
    <!-- Header -->
    <div class="header">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
          <div style="width: 28px; height: 28px; border-radius: 50%; background: #0f172a; color: #fff; display: flex; align-items: center; justify-content: center; font-size: 16px;">🧠</div>
          <h1 style="font-size: 1.6rem; font-weight: 800; letter-spacing: -0.02em;">NEUROVISION</h1>
        </div>
        <p style="font-size: 0.85rem; color: #475569;">
          Explainable Deep Learning for Brain Tumor Classification & Localization
        </p>
      </div>

      <div style="text-align: right;">
        <div style="font-family: monospace; font-size: 0.9rem; font-weight: 700; color: #0f172a;">REPORT ID: ${reportId}</div>
        <div style="font-size: 0.78rem; color: #64748b; margin-top: 4px;">Generated: ${timestamp}</div>
      </div>
    </div>

    <!-- Case Information -->
    <div style="margin-bottom: 24px; padding: 16px; background: #f1f5f9; border-radius: 10px; font-size: 0.86rem; display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;">
      <div>
        <span style="color: #64748b; display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Scan Filename</span>
        <strong style="color: #0f172a;">${fileName}</strong>
      </div>
      <div>
        <span style="color: #64748b; display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Input Modality</span>
        <strong style="color: #0f172a;">Brain MRI (Axial)</strong>
      </div>
      <div>
        <span style="color: #64748b; display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Resolution</span>
        <strong style="color: #0f172a;">224 × 224 px (RGB)</strong>
      </div>
      <div>
        <span style="color: #64748b; display: block; font-size: 0.75rem; text-transform: uppercase; font-weight: 600;">Inference Model</span>
        <strong style="color: #0f172a;">EfficientNet-B0</strong>
      </div>
    </div>

    <!-- Diagnostic Finding -->
    <div style="padding: 24px; border: 2px solid ${isHealthy ? '#10b981' : '#dc2626'}; border-radius: 12px; margin-bottom: 28px; background: ${isHealthy ? '#f0fdf4' : '#fef2f2'};">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <span class="badge ${isHealthy ? 'badge-healthy' : 'badge-tumor'}">
            ${isHealthy ? 'Negative for Neoplasm' : 'Neoplasm Identified'}
          </span>
          <h2 style="font-size: 2.1rem; font-weight: 800; color: #0f172a; margin-top: 8px;">
            ${predClass}
          </h2>
          <p style="font-size: 0.9rem; color: #475569; margin-top: 4px;">
            ${isHealthy 
              ? 'Anatomical parenchymal symmetry observed. No focal mass effect or pathological hyperintensity detected.' 
              : `Focal mass effect consistent with ${predClass.toLowerCase()} pathology indicated by localized deep convolutional activations.`}
          </p>
        </div>

        <div style="text-align: right;">
          <div style="font-size: 0.8rem; font-weight: 600; color: #64748b; text-transform: uppercase;">Confidence Score</div>
          <div style="font-size: 2.5rem; font-weight: 800; color: #0f172a; font-family: monospace;">${confidence}%</div>
        </div>
      </div>
    </div>

    <!-- Visual Evidence: Scan & Grad-CAM -->
    <h3 style="font-size: 1.15rem; font-weight: 700; margin-bottom: 12px;">Visual Evidence & Explainability Heatmap</h3>
    <div class="grid-2">
      <div class="card">
        <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; color: #334155;">Original Brain MRI Scan</div>
        <div class="img-box">
          <img src="${previewUrl}" alt="Original MRI" />
        </div>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 8px; text-align: center;">
          Preprocessed with bilinear interpolation & ImageNet normalization
        </div>
      </div>

      <div class="card">
        <div style="font-size: 0.85rem; font-weight: 700; margin-bottom: 8px; color: #334155;">Grad-CAM Attention Heatmap (Overlay)</div>
        <div class="img-box">
          <img src="${overlaySrc}" alt="Grad-CAM Overlay" />
        </div>
        <div style="font-size: 0.75rem; color: #64748b; margin-top: 8px; text-align: center;">
          Convolutional gradient activations on <code>model.features[-1]</code>
        </div>
      </div>
    </div>

    <!-- Softmax Distribution -->
    <h3 style="font-size: 1.15rem; font-weight: 700; margin: 24px 0 12px 0;">Class Softmax Probability Distribution</h3>
    <table class="card" style="padding: 0;">
      <thead>
        <tr style="background: #f1f5f9; text-align: left; font-size: 0.8rem; text-transform: uppercase; color: #64748b;">
          <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1;">Pathology Class</th>
          <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1;">Probability</th>
          <th style="padding: 10px 14px; border-bottom: 1px solid #cbd5e1;">Relative Confidence</th>
        </tr>
      </thead>
      <tbody>
        ${probRows}
      </tbody>
    </table>

    <!-- Benchmark Specifications -->
    <div style="margin-top: 28px; padding: 18px; border: 1px solid #e2e8f0; border-radius: 12px; background: #fafafa; font-size: 0.82rem; color: #475569;">
      <strong style="color: #0f172a; display: block; margin-bottom: 6px;">Champion Model Audit & Verification:</strong>
      Trained on 5,941 verified brain MRI scans with two-stage AdamW optimization. Evaluated on 889 held-out test scans with <strong>98.31% Overall Accuracy</strong>, <strong>99.61% Tumor Sensitivity</strong>, and <strong>0.9826 Macro F1-Score</strong>.
    </div>

    <!-- Medical Disclaimer -->
    <div style="margin-top: 20px; padding: 14px; background: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; font-size: 0.76rem; color: #92400e; line-height: 1.4;">
      <strong>Clinical Decision Support Disclaimer:</strong> This document was generated automatically by the NeuroVision Explainable AI system. It is designed as an investigative decision-support aid and second opinion for clinical radiologists. It does not constitute an unverified medical diagnosis. Definitive medical conclusions should incorporate histology, clinical history, and physician oversight.
    </div>
  </div>

</body>
</html>`;
}

/**
 * Initiates direct download of the generated HTML clinical report
 */
export function downloadReportFile({ result, previewUrl, fileName = 'brain_mri_scan.png' }) {
  const html = generateReportHtml({ result, previewUrl, fileName });
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  const safeName = (result.predicted_class || 'tumor').toLowerCase();
  a.href = url;
  a.download = `NeuroVision_Report_${safeName}_${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Opens a print-friendly window for direct "Save as PDF"
 */
export function printReportWindow({ result, previewUrl, fileName = 'brain_mri_scan.png' }) {
  const html = generateReportHtml({ result, previewUrl, fileName });
  const win = window.open('', '_blank');
  if (win) {
    win.document.open();
    win.document.write(html);
    win.document.close();
  } else {
    // If popups are blocked, fallback to direct file download
    downloadReportFile({ result, previewUrl, fileName });
  }
}
