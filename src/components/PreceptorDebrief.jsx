import React from 'react';
import { Award, CheckCircle2, XCircle, AlertTriangle, BookOpen, RotateCcw, ArrowLeft, Star, ShieldCheck } from 'lucide-react';

export default function PreceptorDebrief({ caseData, orderData, revealedClues, onRestartCase, onBackToTimeJump }) {
  const patient = caseData.patient;
  const cluesList = Object.values(caseData.hiddenClinicalProfile);

  // Compute 4 Competency Scores
  // 1. Diagnostic Interviewing (25%)
  const cluesFoundCount = Object.values(revealedClues).filter(Boolean).length;
  const interviewingScore = Math.round((cluesFoundCount / cluesList.length) * 100);

  // 2. Diagnostic Accuracy (25%)
  const isBipolarDiagnosed = orderData.diagnosisId === 'bipolar_2_depressed';
  const diagnosticScore = isBipolarDiagnosed ? 100 : (orderData.diagnosisId === 'mdd_recurrent_mod' ? 40 : 20);

  // 3. Pharmacotherapy Safety (30%)
  const medId = orderData.medicationId;
  let pharmScore = 30;
  if (['med_quetiapine', 'med_lurasidone'].includes(medId)) {
    pharmScore = 100;
  } else if (medId === 'med_lamotrigine') {
    const isRapid = orderData.startingDose && (orderData.startingDose.includes('50') || orderData.startingDose.includes('100'));
    pharmScore = isRapid ? 45 : 95;
  } else if (['med_escitalopram', 'med_sertraline', 'med_bupropion'].includes(medId)) {
    pharmScore = 20; // Critical failure: antidepressant monotherapy in Bipolar II
  }

  // 4. Monitoring & Safety Counseling (20%)
  let safetyScore = 50;
  if (orderData.labsOrdered && orderData.labsOrdered.length >= 2) safetyScore += 30;
  if (revealedClues.clue_suicide) safetyScore += 20;
  safetyScore = Math.min(100, safetyScore);

  // Total Weighted Score
  const totalScore = Math.round(
    interviewingScore * 0.25 +
    diagnosticScore * 0.25 +
    pharmScore * 0.30 +
    safetyScore * 0.20
  );

  const getGrade = (score) => {
    if (score >= 93) return { letter: 'A+', color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-950/40', badge: 'High Distinction' };
    if (score >= 85) return { letter: 'A', color: 'text-emerald-400', border: 'border-emerald-500', bg: 'bg-emerald-950/40', badge: 'Honors Pass' };
    if (score >= 75) return { letter: 'B', color: 'text-teal-400', border: 'border-teal-500', bg: 'bg-teal-950/40', badge: 'Competent Pass' };
    if (score >= 65) return { letter: 'C', color: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-950/40', badge: 'Remediation Recommended' };
    return { letter: 'F', color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-950/40', badge: 'Critical Safety Failure' };
  };

  const grade = getGrade(totalScore);

  return (
    <div className="space-y-6">
      
      {/* Score Header Card */}
      <div className={`p-6 rounded-2xl border ${grade.border} ${grade.bg} shadow-xl flex flex-col md:flex-row items-center justify-between gap-6`}>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-slate-900/90 border border-slate-700 flex flex-col items-center justify-center text-center shadow-inner">
            <span className={`text-3xl font-black ${grade.color}`}>{grade.letter}</span>
            <span className="text-[10px] uppercase font-bold text-slate-400">{totalScore}%</span>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs uppercase font-black px-2.5 py-0.5 rounded-full border ${grade.border} ${grade.color}`}>
                {grade.badge}
              </span>
              <span className="text-xs text-slate-400">PMHNP Preceptor Evaluation</span>
            </div>
            <h2 className="text-xl font-black text-white">
              Clinical Competency &amp; Reasoning Debrief
            </h2>
            <p className="text-xs text-slate-300 max-w-xl mt-0.5">
              Simulated OSCE Evaluation for Case 1: Marcus Vance (31yo) • Adult Mood Disorders &amp; Psychopharmacology
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTimeJump}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Review Week 4 Follow-Up</span>
          </button>
          <button
            onClick={onRestartCase}
            className="flex items-center gap-2 text-xs font-bold text-white bg-teal-600 hover:bg-teal-500 px-4 py-2.5 rounded-xl transition-all shadow-md hover:shadow-teal-500/20"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Another Strategy</span>
          </button>
        </div>
      </div>

      {/* 4 Core Competency Breakdowns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Competency 1 */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">1. Diagnostic Interview</span>
            <span className="font-black text-teal-400">{interviewingScore}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${interviewingScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            {cluesFoundCount} of {cluesList.length} hidden clinical clues uncovered during the patient dialogue.
          </p>
        </div>

        {/* Competency 2 */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">2. DSM-5 Accuracy</span>
            <span className="font-black text-teal-400">{diagnosticScore}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${diagnosticScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            {isBipolarDiagnosed ? 'Correct: Bipolar II Depression identified.' : 'Missed: Fell into Unipolar MDD trap.'}
          </p>
        </div>

        {/* Competency 3 */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">3. Pharmacotherapy</span>
            <span className={`font-black ${pharmScore >= 75 ? 'text-teal-400' : 'text-red-400'}`}>{pharmScore}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${pharmScore >= 75 ? 'bg-teal-500' : 'bg-red-500'}`} style={{ width: `${pharmScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            {pharmScore >= 75 ? 'Guideline-concordant mood stabilizer/SGA.' : 'High-risk antidepressant monotherapy.'}
          </p>
        </div>

        {/* Competency 4 */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex justify-between items-center text-xs">
            <span className="text-slate-400 font-bold">4. Safety &amp; Labs</span>
            <span className="font-black text-teal-400">{safetyScore}%</span>
          </div>
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
            <div className="bg-teal-500 h-full rounded-full" style={{ width: `${safetyScore}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">
            Baseline labs ordered and suicide risk screening completed.
          </p>
        </div>

      </div>

      {/* Clinical Pearls & Preceptor Masterclass Card */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-md space-y-5">
        <div className="flex items-center gap-2.5 text-teal-400 border-b border-slate-800 pb-3">
          <BookOpen className="w-5 h-5" />
          <h3 className="text-base font-black text-white">
            Preceptor Masterclass: Key Clinical Takeaways for Board Certification &amp; Practice
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-300 block">
              1. Never Prescribe an Antidepressant Without Ruling Out Mania
            </span>
            <p className="text-slate-300 leading-relaxed">
              Patients presenting with depression rarely volunteer past hypomanic episodes because hypomania feels great and productive. Up to 20% of patients diagnosed with MDD actually have Bipolar Spectrum Disorder. Always ask: <em>"Have you ever had a multi-day streak of decreased need for sleep where you felt supercharged or spent money recklessly?"</em>
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-300 block">
              2. FDA-Approved Monotherapies for Acute Bipolar Depression
            </span>
            <p className="text-slate-300 leading-relaxed">
              Unlike unipolar depression, traditional SSRIs have poor efficacy in bipolar depression and carry risk of manic switch. First-line evidence-based treatments include <strong>Quetiapine</strong>, <strong>Lurasidone</strong>, <strong>Cariprazine</strong>, <strong>Lumateperone</strong>, and <strong>Olanzapine-Fluoxetine combination</strong>.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-300 block">
              3. The Lamotrigine "Start Low, Go Slow" Rule
            </span>
            <p className="text-slate-300 leading-relaxed">
              Lamotrigine is excellent for bipolar depression maintenance, but starting doses must NEVER exceed 25mg daily for the first 14 days. Rapid titration drastically spikes the risk of life-threatening Stevens-Johnson Syndrome (SJS).
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
            <span className="font-bold text-teal-300 block">
              4. Sleep &amp; Alcohol Interaction
            </span>
            <p className="text-slate-300 leading-relaxed">
              Marcus's night-time alcohol intake (3-4 IPAs) fragments sleep architecture, suppressing REM sleep and causing 3 AM rebound awakenings. Addressing sleep hygiene and reducing alcohol is an essential non-pharmacologic intervention.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
