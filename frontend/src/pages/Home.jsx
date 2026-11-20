import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, Activity } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';

export default function Home({ onStartClick }) {
  const categories = [
    {
      title: 'Glioma',
      desc: 'Infiltrative primary tumors originating in glial cells with irregular contrast enhancement.',
      variant: 'danger',
      code: '2,191 Scans in Dataset',
      badge: 'Category 01'
    },
    {
      title: 'Meningioma',
      desc: 'Extra-axial tumors arising from meningeal layers with distinct dural tail sign.',
      variant: 'warning',
      code: '1,478 Scans in Dataset',
      badge: 'Category 02'
    },
    {
      title: 'Pituitary Tumor',
      desc: 'Neuroendocrine tumors in the sella turcica, commonly causing visual field deficits.',
      variant: 'primary',
      code: '1,485 Scans in Dataset',
      badge: 'Category 03'
    },
    {
      title: 'Healthy / No Tumor',
      desc: 'Normal anatomical control scans exhibiting symmetrical ventricles and clear parenchyma.',
      variant: 'success',
      code: '787 Scans in Dataset',
      badge: 'Category 04'
    }
  ];

  const steps = [
    { step: '01', title: 'MRI Scan Ingestion', desc: 'Accepts axial/coronal 2D slice images via drag-and-drop', icon: '📥' },
    { step: '02', title: 'Image Normalization', desc: 'Bilinear 224×224 resize & ImageNet normalization', icon: '⚙️' },
    { step: '03', title: 'Deep CNN Inference', desc: 'Fine-tuned EfficientNet-B0 backbone predicts probabilities', icon: '🧠' },
    { step: '04', title: 'Grad-CAM Activation', desc: 'Convolutional gradients generate spatial heatmaps', icon: '🔥' },
    { step: '05', title: 'Clinical Review', desc: 'Interactive inspection with opacity and comparison sliders', icon: '📊' }
  ];

  return (
    <div className="flex flex-col gap-16 md:gap-20 pb-20">
      {/* Hero Section with clean 3D neural brain background */}
      <div 
        className="relative rounded-3xl overflow-hidden min-h-[580px] md:min-h-[620px] p-8 md:p-16 grid grid-cols-1 lg:grid-cols-12 items-center gap-10 shadow-[0_30px_70px_-20px_rgba(220,180,220,0.4),0_0_0_1px_rgba(255,255,255,0.95)]"
        style={{
          background: `url('/hero-bg-clean.jpg') right center / cover no-repeat`,
          backgroundColor: '#f6f8fc'
        }}
      >
        {/* Left Content Area */}
        <div className="lg:col-span-7 flex flex-col gap-6 z-10">
          <div className="inline-flex">
            <Badge variant="primary" size="md">
              <Sparkles size={13} className="mr-1 text-purple-600" />
              Explainable AI (XAI) for Neuro-Radiology
            </Badge>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-[1.12]">
            AI for Precision<br />Brain Tumor Detection
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-xl">
            An Explainable Deep Learning platform powered by EfficientNet-B0 transfer learning that classifies brain MRI scans across four distinct pathological categories: <strong>Glioma, Meningioma, Pituitary tumors</strong>, and healthy tissue with <strong>98.3% test accuracy</strong> and transparent Grad-CAM convolutional attention maps.
          </p>

          <div className="flex items-center gap-4 pt-2">
            <Button 
              variant="primary" 
              size="lg"
              onClick={onStartClick}
              icon={ArrowRight}
              iconPosition="right"
            >
              Upload MRI Scan
            </Button>
          </div>
        </div>

        {/* Right Column: 3D illuminated brain with floating badges */}
        <div className="lg:col-span-5 relative h-full min-h-[380px] lg:min-h-[460px]">
          {/* Badge 1: Top of Brain */}
          <div className="floating-badge absolute top-[15%] left-[8%]">
            <span className="badge-dot" />
            <span>Grad-CAM Attention</span>
          </div>

          {/* Badge 2: Right of Brain */}
          <div className="floating-badge absolute top-[38%] right-[2%]" style={{ animationDelay: '1.6s' }}>
            <span className="badge-dot" />
            <span>98.31% Test Accuracy</span>
          </div>

          {/* Badge 3: Bottom Left of Brain */}
          <div className="floating-badge absolute bottom-[24%] left-[22%]" style={{ animationDelay: '3.2s' }}>
            <span className="badge-dot" />
            <span>4-Class Tumor XAI</span>
          </div>
        </div>
      </div>

      {/* 4 Classification Categories Cards */}
      <div className="flex flex-col gap-8">
        <SectionHeader 
          title="Categorized Brain Pathology Detection"
          subtitle="Evaluates scans across four clinically verified categories trained on 5,941 MRI scans."
          centered
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((c, i) => (
            <Card key={i} className="flex flex-col gap-3 hover:-translate-y-1 transition-transform duration-200">
              <div className="flex justify-between items-center">
                <Badge variant={c.variant} size="sm">
                  {c.badge}
                </Badge>
                <span className="text-xs font-medium text-slate-400">{c.code}</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mt-1">{c.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{c.desc}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Technical Pipeline Flow */}
      <Card className="p-8 md:p-12">
        <SectionHeader 
          title="How NeuroVision Works"
          subtitle="A reproducible, explainable 5-step machine learning architecture"
          centered
          className="mb-10"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((item, i) => (
            <div 
              key={i} 
              className="bg-white/70 border border-slate-200/70 rounded-2xl p-5 flex flex-col gap-2 hover:bg-white transition-colors duration-150"
            >
              <div className="flex justify-between items-center">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-[0.7rem] font-extrabold text-purple-600 uppercase tracking-wider">
                  STEP {item.step}
                </span>
              </div>
              <h4 className="text-sm font-bold text-slate-900 mt-1">{item.title}</h4>
              <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Clinical Disclaimer Notice */}
      <div className="bg-white/80 border border-slate-900/10 rounded-2xl p-6 md:p-8 flex items-center gap-5 shadow-sm">
        <div className="w-11 h-11 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <ShieldCheck size={24} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-slate-900 mb-1">
            Research & Educational Prototype Notice
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            NeuroVision is developed as an educational and technical research portfolio system. It is not an FDA-cleared diagnostic medical device and must not be used as a standalone tool for patient diagnosis or surgical treatment planning.
          </p>
        </div>
      </div>
    </div>
  );
}
