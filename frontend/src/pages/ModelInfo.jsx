import React from 'react';
import { BarChart3, Database, Layers, ShieldCheck, Cpu } from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SectionHeader from '../components/ui/SectionHeader';

export default function ModelInfo() {
  const models = [
    {
      name: 'Baseline CNN',
      type: 'Custom 4-Block CNN',
      params: '~1.17M',
      valAccuracy: '92.04%',
      valF1: '0.9222',
      role: 'Baseline Benchmark',
      badgeVariant: 'default'
    },
    {
      name: 'ResNet-18',
      type: 'Transfer Learning (ImageNet)',
      params: '11.18M',
      valAccuracy: '96.64%',
      valF1: '0.9657',
      role: 'Comparative Backbone',
      badgeVariant: 'blue'
    },
    {
      name: 'EfficientNet-B0 (Champion)',
      type: 'Transfer Learning (ImageNet, Fine-Tuned)',
      params: '4.01M',
      valAccuracy: '98.43%',
      valF1: '0.9830',
      role: 'Production Architecture',
      highlight: true,
      badgeVariant: 'primary'
    }
  ];

  const stats = [
    { label: 'Overall Test Accuracy', value: '98.31%', subtext: '874 / 889 Correct Scans', color: 'text-emerald-600' },
    { label: 'Macro-Averaged F1', value: '0.9826', subtext: 'Balanced across 4 classes', color: 'text-slate-900' },
    { label: 'Tumor Sensitivity', value: '99.61%', subtext: '768 of 771 Tumors Detected', color: 'text-blue-600' },
    { label: 'Healthy Specificity', value: '98.31%', subtext: '116 of 118 Controls Verified', color: 'text-purple-600' },
  ];

  const confusionData = [
    { label: 'Glioma', row: [323, 4, 1, 0] },
    { label: 'Meningioma', row: [5, 214, 1, 1] },
    { label: 'No Tumor', row: [1, 0, 116, 1] },
    { label: 'Pituitary', row: [0, 0, 1, 221] }
  ];

  return (
    <div className="flex flex-col gap-10 pb-20">
      {/* Page Header */}
      <SectionHeader
        badge="Benchmark Evaluation"
        badgeIcon={BarChart3}
        title="Science & Clinical Metrics"
        subtitle="Quantitative performance metrics evaluated strictly on test dataset."
      />

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, idx) => (
          <Card key={idx} className="text-center p-6 hover:-translate-y-0.5 transition-transform duration-200">
            <span className="text-[0.72rem] font-bold text-slate-500 uppercase tracking-wider block">
              {s.label}
            </span>
            <div className={`text-4xl font-extrabold font-mono my-2 ${s.color}`}>
              {s.value}
            </div>
            <span className="text-xs text-slate-400 block">{s.subtext}</span>
          </Card>
        ))}
      </div>

      {/* Architecture Comparison Table */}
      <Card className="p-6 md:p-8">
        <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2.5">
          <Cpu size={20} className="text-purple-600" />
          <span>Model Architecture Comparison</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase text-slate-400">
                <th className="py-3 px-4">Architecture</th>
                <th className="py-3 px-4">Approach</th>
                <th className="py-3 px-4">Parameters</th>
                <th className="py-3 px-4">Val Accuracy</th>
                <th className="py-3 px-4">Val Macro-F1</th>
                <th className="py-3 px-4">Role</th>
              </tr>
            </thead>
            <tbody>
              {models.map((m, idx) => (
                <tr
                  key={idx}
                  className={`border-b border-slate-100 transition-colors ${m.highlight ? 'bg-purple-50/60 font-semibold' : 'hover:bg-slate-50/60'
                    }`}
                >
                  <td className={`py-4 px-4 ${m.highlight ? 'text-purple-900 font-bold' : 'text-slate-900'}`}>
                    {m.name}
                  </td>
                  <td className="py-4 px-4 text-slate-600">{m.type}</td>
                  <td className="py-4 px-4 font-mono text-slate-700">{m.params}</td>
                  <td className="py-4 px-4 font-mono font-bold text-emerald-600">{m.valAccuracy}</td>
                  <td className="py-4 px-4 font-mono text-slate-700">{m.valF1}</td>
                  <td className="py-4 px-4">
                    <Badge variant={m.badgeVariant} size="sm">
                      {m.role}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Confusion Matrix & Grad-CAM Methodology */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Confusion Matrix */}
        <Card className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2.5">
              <BarChart3 size={20} className="text-blue-600" />
              <span>Official Test Confusion Matrix</span>
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Held-out test split (n = 889 scans):
            </p>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              {confusionData.flatMap((c, rIdx) =>
                c.row.map((val, cIdx) => {
                  const isMatch = rIdx === cIdx;
                  return (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`p-3.5 rounded-xl border text-base font-bold transition-transform duration-150 hover:scale-105 ${isMatch
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : val > 0
                          ? 'bg-rose-50 border-rose-200 text-rose-600'
                          : 'bg-white/60 border-slate-200 text-slate-400'
                        }`}
                    >
                      {val}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-5 text-[0.72rem] text-slate-400 text-center">
            Rows: Ground Truth | Columns: Predictions (Glioma • Meningioma • No Tumor • Pituitary)
          </div>
        </Card>

        {/* Grad-CAM Methodology */}
        <Card className="p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2.5">
              <Layers size={20} className="text-purple-600" />
              <span>Grad-CAM Mathematical Foundation</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              Grad-CAM computes the gradient of class score \(y^c\) with respect to feature maps \(A^k\) of the final convolutional block (<code className="bg-slate-100 text-purple-700 px-1 py-0.5 rounded font-mono">model.features[-1]</code>, 7×7 feature map):
            </p>

            <div className="bg-slate-900 text-white p-3.5 rounded-xl font-mono text-xs font-semibold mb-4 text-center shadow-inner">
              L_Grad-CAM = ReLU( ∑ α_k · A_k )
            </div>

            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside leading-relaxed">
              <li><strong className="text-slate-900">Global Average Pooling:</strong> Calculates channel importance weights \(\alpha_k\) from backpropagated class gradients.</li>
              <li><strong className="text-slate-900">ReLU Rectification:</strong> Retains features positively correlated with the target tumor class score.</li>
              <li><strong className="text-slate-900">Sanity Validated:</strong> Passed model randomization and class-specificity sanity checks in Kaggle benchmarks.</li>
            </ul>
          </div>
        </Card>
      </div>
    </div>
  );
}
