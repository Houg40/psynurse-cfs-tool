import React from 'react';
import { FastForward, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Award, ArrowLeft, ShieldAlert } from 'lucide-react';

export default function TimeJumpEngine({ caseData, orderData, onBackToChart, onProceedToDebrief }) {
  const patient = caseData.patient;
  const outcomes = caseData.timeJumpOutcomes;

  // Compute consequence outcome based on student's prescription
  const getOutcome = () => {
    const medId = orderData.medicationId;
    if (['med_escitalopram', 'med_sertraline', 'med_bupropion'].includes(medId)) {
      return outcomes.trap_ssri_monotherapy;
    }
    if (medId === 'med_quetiapine') {
      return outcomes.success_quetiapine;
    }
    if (medId === 'med_lurasidone') {
      return outcomes.success_lurasidone;
    }
    if (medId === 'med_lamotrigine') {
      // Check if starting dose exceeded 25mg
      if (orderData.startingDose && (orderData.startingDose.includes('50') || orderData.startingDose.includes('100'))) {
        return outcomes.failure_lamotrigine_rapid;
      }
      return outcomes.success_lamotrigine_safe;
    }
    return outcomes.trap_ssri_monotherapy;
  };

  const outcome = getOutcome();
  const isAdverse = outcome.outcomeType === 'CRITICAL_ADVERSE_EVENT' || outcome.outcomeType === 'SAFETY_HAZARD';

  return (
    <div className="space-y-6">
      
      {/* Time-Jump Transition Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-teal-800/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <FastForward className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
              Longitudinal Simulation Engine
            </span>
            <h2 className="text-xl font-black text-white">
              Week 4 Clinical Follow-Up Encounter
            </h2>
            <p className="text-xs text-slate-300">
              Four weeks have elapsed since your initial prescription order. Marcus returns for his scheduled follow-up.
            </p>
          </div>
        </div>

        <button
          onClick={onProceedToDebrief}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/30"
        >
          <Award className="w-4 h-4" />
          <span>View Preceptor Competency Scorecard</span>
        </button>
      </div>

      {/* Main Follow-up Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Follow-Up Video & Status Card (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md space-y-5">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isAdverse ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
              <h3 className="text-base font-black text-white">Patient Presentation: Week 4</h3>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
              isAdverse
                ? 'bg-red-950 text-red-300 border-red-800'
                : 'bg-emerald-950 text-emerald-300 border-emerald-800'
            }`}>
              {outcome.moodState}
            </span>
          </div>

          {/* Clinical Narrative Quote */}
          <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
            isAdverse
              ? 'bg-red-950/30 border-red-800/80 text-red-200'
              : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-100'
          }`}>
            <span className="font-bold block uppercase text-[10px] tracking-wider text-slate-400">
              Clinical Telehealth Dialogue:
            </span>
            <p className="italic text-sm">
              "{outcome.patientStatusAtWeek4}"
            </p>
          </div>

          {/* Action Required Callout */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
            <span className="font-bold text-teal-400 block uppercase text-[10px]">
              Next Provider Clinical Step:
            </span>
            <p className="text-slate-300">{outcome.actionRequired}</p>
          </div>

          <div className="pt-2 flex justify-between items-center text-xs">
            <button
              onClick={onBackToChart}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-semibold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Modify Previous Prescription Order</span>
            </button>
          </div>
        </div>

        {/* Right Column: Longitudinal Objective Metrics & Score comparison (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* PHQ-9 Comparison Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-3">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Longitudinal Screener Tracking
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Baseline (Week 0)</span>
                <span className="text-2xl font-black text-amber-400">19</span>
                <span className="text-[10px] text-slate-400 block">Mod. Severe Depression</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-center">
                <span className="text-[10px] text-slate-500 block uppercase">Follow-Up (Week 4)</span>
                <span className={`text-2xl font-black ${isAdverse ? 'text-red-400' : 'text-emerald-400'}`}>
                  {outcome.phq9ScoreWeek4}
                </span>
                <span className="text-[10px] text-slate-400 block">
                  {isAdverse ? 'Hypomanic / Mixed' : 'Remission Range'}
                </span>
              </div>
            </div>

            <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
              isAdverse
                ? 'bg-red-950/40 border-red-800/60 text-red-300'
                : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
            }`}>
              {isAdverse ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>
                    <strong>Clinical Trap Triggered:</strong> Depressive score dropped because patient switched into acute hypomania!
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    <strong>True Remission:</strong> Mood stabilized without destabilizing sleep or inducing affective switch.
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Preceptor Early Feedback Card */}
          <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-sm space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Preceptor Summary Preview
              </span>
              <span className={`text-sm font-black px-2 py-0.5 rounded ${
                outcome.preceptorGrade.startsWith('A')
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  : 'bg-red-950 text-red-300 border border-red-800'
              }`}>
                Grade: {outcome.preceptorGrade} ({outcome.preceptorScore}%)
              </span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed pt-1">
              {outcome.preceptorNotes}
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}
