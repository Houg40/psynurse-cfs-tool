import React from 'react';
import { Stethoscope, FileText, FastForward, Award, RotateCcw, ShieldCheck } from 'lucide-react';

export default function Navbar({ activePhase, setActivePhase, onResetCase, revealedCluesCount, totalCluesCount }) {
  const phases = [
    { id: 'interview', label: '1. Patient Interview', icon: Stethoscope },
    { id: 'charting', label: '2. Clinical Chart & Orders', icon: FileText },
    { id: 'timejump', label: '3. Week 4 Follow-Up', icon: FastForward },
    { id: 'debrief', label: '4. Preceptor Scorecard', icon: Award },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3 lg:py-0 lg:h-16 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <img
              src="./icon-192.png"
              alt="PsyNurse CFS"
              className="w-10 h-10 object-contain rounded-xl p-0.5 bg-slate-800 border border-teal-500/40 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  PsyNurse CFS
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-800">
                  Flight Simulator
                </span>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Simulated OSCE
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Case 1: Marcus Vance (31yo) • Bipolar II vs. MDD Diagnostic & Titration Lab
              </p>
            </div>
          </div>

          {/* Phase Stepper Navigation */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {phases.map((phase) => {
              const Icon = phase.icon;
              const isActive = activePhase === phase.id;
              return (
                <button
                  key={phase.id}
                  onClick={() => setActivePhase(phase.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-teal-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{phase.label}</span>
                </button>
              );
            })}
          </div>

          {/* Diagnostic Discovery Counter & Reset Button */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                Hidden Clues Found
              </span>
              <span className="text-xs font-black text-teal-400">
                {revealedCluesCount} of {totalCluesCount} Discovered
              </span>
            </div>
            <button
              onClick={onResetCase}
              className="flex items-center gap-1.5 text-xs font-bold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl border border-slate-700 transition-all shadow-xs"
              title="Reset case to beginning"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Case</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
}
