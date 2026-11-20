import React from 'react';
import { Brain, CheckCircle2 } from 'lucide-react';
import Button from './ui/Button';

export default function Navbar({ activeTab, setActiveTab, apiOnline, hasResults }) {
  const navItems = [
    { id: 'home', label: 'Overview' },
    { id: 'classify', label: 'Classifier' },
    { id: 'results', label: 'Results & Grad-CAM', badge: hasResults },
    { id: 'model', label: 'Science & Metrics' },
  ];

  return (
    <header className="relative z-50 bg-transparent py-5">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-full bg-slate-950 flex items-center justify-center text-white shadow-md shadow-slate-900/10 group-hover:scale-105 transition-transform duration-200">
            <Brain size={22} strokeWidth={2.2} />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-extrabold tracking-tight text-slate-950">
              NeuroVision
            </span>
            <span className="text-[0.7rem] font-semibold text-slate-500 uppercase tracking-widest -mt-1">
              Explainable AI
            </span>
          </div>
        </div>

        {/* Center Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative py-1.5 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'text-slate-950' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" title="Analysis Ready" />
                )}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-slate-950 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Action Pills */}
        <div className="flex items-center gap-3">
          {/* Status indicator pill */}
          <div className="hidden sm:inline-flex items-center gap-2 bg-white/80 border border-slate-900/10 rounded-full px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-md shadow-sm">
            <span 
              className={`w-2 h-2 rounded-full ${
                apiOnline 
                  ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' 
                  : 'bg-amber-500'
              }`} 
            />
            <span>{apiOnline ? 'FastAPI Online' : 'Connecting API'}</span>
          </div>

          {/* Primary Action Button */}
          <Button 
            variant="primary"
            size="sm"
            onClick={() => setActiveTab('classify')}
            className="text-xs px-4 py-2"
          >
            Classify MRI
          </Button>
        </div>
      </div>
    </header>
  );
}
