import React from 'react';
import { Sparkles, FileDown, Printer, RefreshCw, ShieldAlert, CheckCircle2, ArrowLeft, Brain } from 'lucide-react';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';
import ProbabilityBar from '../components/ProbabilityBar';
import HeatmapViewer from '../components/HeatmapViewer';
import { downloadReportFile, printReportWindow } from '../utils/reportGenerator';

export default function Results({ result, previewUrl, selectedFile, onNewScanClick }) {
  if (!result || !previewUrl) {
    return (
      <div className="flex flex-col gap-10 pb-20">
        <SectionHeader 
          badge="Results & Explainability"
          badgeIcon={Sparkles}
          title="Results & Grad-CAM Localization"
          subtitle="View primary tumor findings, multi-class probability distributions, and convolutional attention heatmaps."
        />

        <Card className="p-12 md:p-16 text-center flex flex-col items-center justify-center min-h-[420px] max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center mb-5 shadow-sm">
            <Brain size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            No Scan Analyzed Yet
          </h3>
          <p className="text-sm text-slate-500 max-w-md mb-6 leading-relaxed">
            Please upload a brain MRI scan in the <strong>Classifier</strong> tab and click <em>Run AI Analysis</em> to generate diagnosis results and Grad-CAM heatmaps.
          </p>
          <Button 
            variant="primary" 
            size="md" 
            onClick={onNewScanClick}
            icon={ArrowLeft}
          >
            Go to Classifier Tab
          </Button>
        </Card>
      </div>
    );
  }

  const isHealthy = result.predicted_class === 'no_tumor';
  const confidencePct = (result.confidence * 100).toFixed(1);
  const formattedClass = result.predicted_class.replace('_', ' ');

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <SectionHeader 
          badge="Inference Complete"
          badgeIcon={CheckCircle2}
          title="Results & Grad-CAM Localization"
          subtitle="Primary classified finding, multi-class softmax probability distributions, and spatial Grad-CAM attention heatmap."
        />

        <Button
          variant="secondary"
          size="sm"
          onClick={onNewScanClick}
          icon={RefreshCw}
          className="shrink-0"
        >
          Analyze Another Scan
        </Button>
      </div>

      {/* Main Analysis Container */}
      <div className="flex flex-col gap-8">
        {/* Primary Prediction Card */}
        <Card className="p-6 md:p-8 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <Badge variant={isHealthy ? 'success' : 'danger'} size="sm" dot>
                  {isHealthy ? 'Negative for Neoplasm' : 'Neoplastic Finding Identified'}
                </Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {selectedFile?.name || 'mri_scan.png'}
                </span>
              </div>
              <h2 className="text-3xl font-extrabold text-slate-900 capitalize tracking-tight">
                {formattedClass}
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">
                Model Confidence
              </span>
              <div className="text-3xl font-extrabold font-mono text-slate-900">
                {confidencePct}%
              </div>
            </div>
          </div>

          {/* Probability Distribution */}
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Softmax Probability Distribution across 4 Classes
            </h4>
            <ProbabilityBar
              probabilities={result.probabilities}
              predictedClass={result.predicted_class}
            />
          </div>

          {/* Action Export Buttons */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-6 border-t border-slate-100 gap-4">
            <span className="text-xs text-slate-500">
              Generate clinical documentation with embedded scan & Grad-CAM visualization:
            </span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="primary"
                size="sm"
                onClick={() => downloadReportFile({ result, previewUrl, fileName: selectedFile?.name || 'mri_scan.png' })}
                icon={FileDown}
                className="w-full sm:w-auto"
              >
                Download Report
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => printReportWindow({ result, previewUrl, fileName: selectedFile?.name || 'mri_scan.png' })}
                icon={Printer}
                className="w-full sm:w-auto"
              >
                Print / PDF
              </Button>
            </div>
          </div>
        </Card>

        {/* Heatmap Visualizer */}
        <HeatmapViewer
          originalUrl={previewUrl}
          overlayBase64={result.overlay_base64}
        />

        {/* Clinical Disclaimer */}
        <div className="bg-amber-50/80 border border-amber-200/80 rounded-2xl p-5 flex items-start gap-4">
          <ShieldAlert size={20} className="text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900 leading-relaxed">
            <strong>Clinical Interpretability Note:</strong> Grad-CAM heatmaps highlight spatial regions in the convolutional feature maps of <code>model.features[-1]</code> that drove the classification score. They are intended as an interpretability audit tool and second-opinion support, not an automated surgical margin boundary.
          </div>
        </div>
      </div>
    </div>
  );
}
