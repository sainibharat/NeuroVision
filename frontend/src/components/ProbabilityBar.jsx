import React from 'react';

const CLASS_CONFIG = {
  glioma: { label: 'Glioma', color: '#f43f5e', bg: 'bg-rose-50', text: 'text-rose-600', border: 'border-rose-200' },
  meningioma: { label: 'Meningioma', color: '#f59e0b', bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-200' },
  pituitary: { label: 'Pituitary Tumor', color: '#8b5cf6', bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' },
  no_tumor: { label: 'Healthy / No Tumor', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
  notumor: { label: 'Healthy / No Tumor', color: '#10b981', bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-200' },
};

export default function ProbabilityBar({ probabilities = {}, predictedClass = '' }) {
  const entries = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

  return (
    <div className="flex flex-col gap-4">
      {entries.map(([clsKey, prob]) => {
        const config = CLASS_CONFIG[clsKey.toLowerCase()] || {
          label: clsKey,
          color: '#3b82f6',
          bg: 'bg-blue-50',
          text: 'text-blue-600',
          border: 'border-blue-200'
        };
        const percentage = (prob * 100).toFixed(1);
        const isPredicted = clsKey.toLowerCase() === predictedClass.toLowerCase();

        return (
          <div key={clsKey} className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-2.5">
                <span className={`font-semibold ${isPredicted ? 'text-slate-900 font-bold' : 'text-slate-600'}`}>
                  {config.label}
                </span>
                {isPredicted && (
                  <span className={`text-[0.65rem] font-extrabold uppercase px-2 py-0.5 rounded-full border ${config.bg} ${config.text} ${config.border}`}>
                    Primary Prediction
                  </span>
                )}
              </div>
              <span className={`font-mono font-bold ${isPredicted ? config.text : 'text-slate-500'}`}>
                {percentage}%
              </span>
            </div>

            {/* Progress Track */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${percentage}%`,
                  backgroundColor: config.color,
                  boxShadow: isPredicted ? `0 0 10px ${config.color}60` : 'none',
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
