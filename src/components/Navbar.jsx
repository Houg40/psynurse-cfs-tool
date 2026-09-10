import React from 'react';
import { Stethoscope, FileText, FastForward, Award, RotateCcw, ShieldCheck, Sparkles } from 'lucide-react';

export default function Navbar({ activePhase, setActivePhase, onResetCase, revealedCluesCount, totalCluesCount }) {
  const phases = [
    { id: 'interview', label: '1. Interview', icon: Stethoscope },
    { id: 'charting', label: '2. Chart & Orders', icon: FileText },
    { id: 'timejump', label: '3. Week 4 Follow-Up', icon: FastForward },
    { id: 'debrief', label: '4. Scorecard', icon: Award },
  ];

  return (
    <header className="sticky top-0 z-30 shadow-xl border-b border-slate-800 bg-slate-900/95 backdrop-blur-md">
      {/* Primary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <img
              src="./icon-192.png"
              alt="PsyNurse CFS"
              className="w-9 h-9 object-contain rounded-xl p-0.5 bg-slate-800 border border-teal-500/40 shadow-xs flex-shrink-0"
            />
            <div className="flex items-center gap-2">
              <span className="font-black text-white text-base tracking-tight whitespace-nowrap">
                PsyNurse CFS
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-teal-950/80 text-teal-300 border border-teal-800/80 whitespace-nowrap">
                Flight Simulator
              </span>
            </div>
          </div>

          {/* Phase Stepper Tabs (Segmented Pill) */}
          <nav className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800/80 shadow-inner overflow-x-auto">
            {phases.map((phase) => {
              const Icon = phase.icon;
              const isActive = activePhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{phase.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Utilities: Clue Counter Pill & Reset Button */}
          <div className="flex items-center gap-2.5 flex-shrink-0">
            {/* Clues Pill */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-semibold whitespace-nowrap shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
              <span className="text-slate-400 text-[11px]">Clues:</span>
              <span className="font-black text-teal-400 text-xs">
                {revealedCluesCount}/{totalCluesCount}
              </span>
            </div>

            {/* Reset Button */}
            <button
              onClick={onResetCase}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800/90 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700/80 transition-all shadow-xs whitespace-nowrap"
              title="Reset simulation back to start"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>

        </div>
      </div>

      {/* Secondary Context Ribbon: Clean Case Metadata Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/60 py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 truncate">
            <span className="text-slate-500 font-medium">Case 1:</span>
            <span className="font-bold text-slate-200">Marcus Vance (31yo)</span>
            <span className="text-slate-600 hidden sm:inline">•</span>
            <span className="text-slate-400 hidden sm:inline">Senior Data Analyst</span>
            <span className="text-slate-600 hidden md:inline">•</span>
            <span className="text-teal-400 font-semibold hidden md:inline">Bipolar II vs. MDD Diagnostic &amp; Titration Lab</span>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400/90 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Simulated Clinical OSCE
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
