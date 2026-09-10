import React, { useState } from 'react';
import { FastForward, AlertTriangle, CheckCircle2, TrendingDown, TrendingUp, Award, ArrowLeft, ShieldAlert, Sparkles, AlertOctagon, RotateCcw, ChevronRight } from 'lucide-react';

export default function TimeJumpEngine({ caseData, orderData, week8Action, setWeek8Action, onBackToChart, onProceedToDebrief }) {
  const [currentStep, setCurrentStep] = useState('week4'); // 'week4' or 'week8'
  const patient = caseData.patient;
  const outcomes = caseData.timeJumpOutcomes;
  const week8Outcomes = caseData.week8Outcomes;

  // Compute consequence outcome based on student's prescription
  const getWeek4Outcome = () => {
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
      if (orderData.startingDose && (orderData.startingDose.includes('50') || orderData.startingDose.includes('100'))) {
        return outcomes.failure_lamotrigine_rapid;
      }
      return outcomes.success_lamotrigine_safe;
    }
    return outcomes.trap_ssri_monotherapy;
  };

  const outcome4 = getWeek4Outcome();
  const isManicSwitch = outcome4.outcomeType === 'CRITICAL_ADVERSE_EVENT';
  const isLamotrigineSafe = outcome4 === outcomes.success_lamotrigine_safe;

  // Compute Week 8 Result
  const getWeek8Result = () => {
    if (isManicSwitch && week8Action) {
      return week8Outcomes.rescueFromMania.find(r => r.id === week8Action) || week8Outcomes.rescueFromMania[0];
    }
    if (isLamotrigineSafe && week8Action) {
      return week8Outcomes.maintenanceLamotrigine.find(m => m.id === week8Action) || week8Outcomes.maintenanceLamotrigine[0];
    }
    // Default routine surveillance for Quetiapine / Lurasidone
    return {
      resultTitle: "Sustained Remission & Prophylactic Mood Stability",
      patientQuote: "Marcus attends Week 8 looking rested, energized, and thriving: 'The last month has been the most consistent period of my adult life. I've finished a major deliverable at work and my relationship is in such a peaceful place.'",
      phq9Score: 5,
      salvagedGrade: "A+",
      salvagedScore: 97,
      preceptorFeedback: "EXEMPLARY CLINICAL CARE: You selected an evidence-based first-line agent, guided the patient into remission, and ensured sustained clinical stability at Week 8 with appropriate metabolic surveillance."
    };
  };

  const week8Result = getWeek8Result();

  return (
    <div className="space-y-6">
      
      {/* Time-Jump Transition Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-indigo-950 p-6 rounded-2xl border border-teal-800/60 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-300">
            <FastForward className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-teal-400">
                Longitudinal Consequence Simulator
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                {currentStep === 'week4' ? 'Phase 3A: Week 4' : 'Phase 3B: Week 8'}
              </span>
            </div>
            <h2 className="text-xl font-black text-white">
              {currentStep === 'week4' ? 'Week 4 Clinical Follow-Up Visit' : 'Week 8 Longitudinal Care & Evaluation'}
            </h2>
            <p className="text-xs text-slate-300">
              {currentStep === 'week4'
                ? 'Four weeks have elapsed since your initial order. Observe patient response and execute clinical management.'
                : 'Eight weeks post-intake. Observe long-term response, salvage efficacy, and stability.'}
            </p>
          </div>
        </div>

        {currentStep === 'week8' ? (
          <button
            onClick={onProceedToDebrief}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/30"
          >
            <Award className="w-4 h-4" />
            <span>View Preceptor Scorecard &amp; SOAP Note</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={onBackToChart}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg hover:bg-slate-800"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Edit Initial Order</span>
            </button>
          </div>
        )}
      </div>

      {/* STEP 1: WEEK 4 PRESENTATION */}
      {currentStep === 'week4' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Week 4 Status & Clinical Dialogue (7 cols) */}
            <div className="lg:col-span-7 bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`w-3 h-3 rounded-full ${isManicSwitch ? 'bg-red-500 animate-ping' : 'bg-emerald-500'}`} />
                  <h3 className="text-base font-black text-white">Patient Presentation: Week 4</h3>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                  isManicSwitch
                    ? 'bg-red-950 text-red-300 border-red-800'
                    : 'bg-emerald-950 text-emerald-300 border-emerald-800'
                }`}>
                  {outcome4.moodState}
                </span>
              </div>

              {/* Dialogue Quote */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed space-y-2 ${
                isManicSwitch
                  ? 'bg-red-950/30 border-red-800/80 text-red-200'
                  : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-100'
              }`}>
                <span className="font-bold block uppercase text-[10px] tracking-wider text-slate-400">
                  Telehealth Encounter Dialogue:
                </span>
                <p className="italic text-sm">
                  "{outcome4.patientStatusAtWeek4}"
                </p>
              </div>

              {/* Action Required */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="font-bold text-teal-400 block uppercase text-[10px]">
                  Clinical Challenge Ahead:
                </span>
                <p className="text-slate-300">{outcome4.actionRequired}</p>
              </div>
            </div>

            {/* Right Column: Screener Metrics & Trap Trigger (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
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
                    <span className={`text-2xl font-black ${isManicSwitch ? 'text-red-400' : 'text-emerald-400'}`}>
                      {outcome4.phq9ScoreWeek4}
                    </span>
                    <span className="text-[10px] text-slate-400 block">
                      {isManicSwitch ? 'Manic Switch' : 'Remission Range'}
                    </span>
                  </div>
                </div>

                <div className={`p-3 rounded-xl text-xs flex items-center gap-2 border ${
                  isManicSwitch
                    ? 'bg-red-950/40 border-red-800/60 text-red-300'
                    : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                }`}>
                  {isManicSwitch ? (
                    <>
                      <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0" />
                      <span>
                        <strong>Diagnostic Trap Triggered:</strong> Depressive score dropped because the antidepressant induced acute hypomania!
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>
                        <strong>True Therapeutic Response:</strong> Mood stabilizing without affective dysregulation.
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>

          {/* INTERACTIVE CLINICAL MANAGEMENT SECTION: WEEK 4 -> WEEK 8 */}
          {isManicSwitch && (
            <div className="bg-red-950/20 border-2 border-red-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <AlertOctagon className="w-6 h-6 text-red-400 animate-bounce" />
                <div>
                  <h3 className="text-base font-black text-white">
                    Emergency Clinical Rescue Challenge: Iatrogenic Hypomanic Switch
                  </h3>
                  <p className="text-xs text-red-300">
                    Marcus is in an acute antidepressant-induced switch. As his PMHNP, you must act immediately to prevent psychiatric hospitalization. What is your intervention?
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {week8Outcomes.rescueFromMania.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      week8Action === opt.id
                        ? 'bg-red-950/60 border-red-500 text-white shadow-md ring-1 ring-red-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="rescueAction"
                      value={opt.id}
                      checked={week8Action === opt.id}
                      onChange={() => setWeek8Action(opt.id)}
                      className="mt-1 text-red-600 focus:ring-red-500"
                    />
                    <div>
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {opt.isCorrect
                          ? 'Standard of Care: Discontinue antidepressant + add antimanic SGA/mood stabilizer.'
                          : 'High-risk or incomplete salvage strategy.'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setCurrentStep('week8')}
                  disabled={!week8Action}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg"
                >
                  <span>Commit Emergency Orders &amp; Advance to Week 8</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Lamotrigine Titration Challenge */}
          {isLamotrigineSafe && (
            <div className="bg-teal-950/20 border-2 border-teal-800/80 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-teal-400" />
                <div>
                  <h3 className="text-base font-black text-white">
                    Maintenance Titration Protocol (Weeks 5–8)
                  </h3>
                  <p className="text-xs text-teal-300">
                    Marcus reached 50mg daily safely with zero rash and a partial 40% response. How will you adjust his dosage for maintenance?
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                {week8Outcomes.maintenanceLamotrigine.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                      week8Action === opt.id
                        ? 'bg-teal-950/60 border-teal-500 text-white shadow-md ring-1 ring-teal-500'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="maintAction"
                      value={opt.id}
                      checked={week8Action === opt.id}
                      onChange={() => setWeek8Action(opt.id)}
                      className="mt-1 text-teal-600 focus:ring-teal-500"
                    />
                    <div>
                      <span className="text-xs font-bold block">{opt.label}</span>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {opt.isCorrect
                          ? 'Guideline target therapeutic dose for bipolar depression maintenance is 100-200mg daily.'
                          : 'Subtherapeutic dose risk.'}
                      </span>
                    </div>
                  </label>
                ))}
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setCurrentStep('week8')}
                  disabled={!week8Action}
                  className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg"
                >
                  <span>Commit Titration Plan &amp; Advance to Week 8</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Routine Surveillance for Quetiapine / Lurasidone */}
          {!isManicSwitch && !isLamotrigineSafe && (
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-white">Full Early Remission Achieved</p>
                <p className="text-[11px] text-slate-400">Advance to Week 8 to review metabolic surveillance and long-term mood stability.</p>
              </div>
              <button
                onClick={() => setCurrentStep('week8')}
                className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all"
              >
                <span>Advance to Week 8</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      )}

      {/* STEP 2: WEEK 8 OUTCOME EVALUATION */}
      {currentStep === 'week8' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <span className="text-[10px] uppercase font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                Week 8 Long-Term Trajectory
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                {week8Result.resultTitle}
              </h3>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-950 text-teal-400 border border-teal-800">
              Salvaged Score: {week8Result.salvagedGrade} ({week8Result.salvagedScore}%)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              Patient Dialogue at Week 8:
            </span>
            <p className="italic text-slate-200 text-sm leading-relaxed">
              "{week8Result.patientQuote}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-center">
              <span className="text-[10px] uppercase text-slate-500 block">PHQ-9 at Week 8</span>
              <span className="text-3xl font-black text-emerald-400">{week8Result.phq9Score}</span>
              <span className="text-[10px] text-slate-400 block mt-1">Full Remission: &lt; 10</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 md:col-span-2 space-y-1">
              <span className="text-[10px] uppercase font-bold text-teal-400 block">
                Preceptor Longitudinal Commentary:
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                {week8Result.preceptorFeedback}
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-between items-center">
            <button
              onClick={() => setCurrentStep('week4')}
              className="text-slate-400 hover:text-white text-xs font-semibold flex items-center gap-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Week 4 Decision</span>
            </button>
            <button
              onClick={onProceedToDebrief}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-indigo-500/30"
            >
              <Award className="w-4 h-4" />
              <span>Proceed to Preceptor Scorecard &amp; EHR SOAP Note</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
