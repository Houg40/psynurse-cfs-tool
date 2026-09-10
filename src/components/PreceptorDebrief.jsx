import React, { useState } from 'react';
import { Award, CheckCircle2, XCircle, AlertTriangle, BookOpen, RotateCcw, ArrowLeft, Star, ShieldCheck, FileText, Copy, Check, ClipboardCheck } from 'lucide-react';

export default function PreceptorDebrief({ caseData, orderData, revealedClues, week8Action, onRestartCase, onBackToTimeJump }) {
  const [activeTab, setActiveTab] = useState('scorecard'); // 'scorecard' | 'soap'
  const [copied, setCopied] = useState(false);

  const patient = caseData.patient;
  const cluesList = Object.values(caseData.hiddenClinicalProfile);

  // Compute 4 Competency Scores
  // 1. Diagnostic Interviewing (25%)
  const cluesFoundCount = Object.values(revealedClues).filter(Boolean).length;
  const interviewingScore = Math.round((cluesFoundCount / cluesList.length) * 100);

  // 2. Diagnostic Accuracy (25%)
  const isBipolarDiagnosed = orderData.diagnosisId === 'bipolar_2_depressed';
  const diagnosticScore = isBipolarDiagnosed ? 100 : (orderData.diagnosisId === 'mdd_recurrent_mod' ? 40 : 20);

  // 3. Pharmacotherapy Safety & Salvage (30%)
  const medId = orderData.medicationId;
  let pharmScore = 30;
  let isSalvaged = false;

  if (['med_quetiapine', 'med_lurasidone'].includes(medId)) {
    pharmScore = 100;
  } else if (medId === 'med_lamotrigine') {
    const isRapid = orderData.startingDose && (orderData.startingDose.includes('50') || orderData.startingDose.includes('100'));
    if (isRapid) {
      pharmScore = 45;
    } else {
      pharmScore = week8Action === 'maint_titrate_100mg' ? 100 : 90;
    }
  } else if (['med_escitalopram', 'med_sertraline', 'med_bupropion'].includes(medId)) {
    if (week8Action === 'rescue_sg_quetiapine') {
      pharmScore = 78; // Salvaged through emergency crisis intervention
      isSalvaged = true;
    } else if (week8Action === 'rescue_benzo_prn') {
      pharmScore = 45;
    } else {
      pharmScore = 15;
    }
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
    if (score >= 75) return { letter: isSalvaged ? 'B+' : 'B', color: 'text-teal-400', border: 'border-teal-500', bg: 'bg-teal-950/40', badge: isSalvaged ? 'Crisis Salvage Pass' : 'Competent Pass' };
    if (score >= 65) return { letter: 'C', color: 'text-amber-400', border: 'border-amber-500', bg: 'bg-amber-950/40', badge: 'Remediation Recommended' };
    return { letter: 'F', color: 'text-red-400', border: 'border-red-500', bg: 'bg-red-950/40', badge: 'Critical Safety Failure' };
  };

  const grade = getGrade(totalScore);

  // Selected Medication Name
  const selectedMed = caseData.prescribingOptions.find(m => m.id === orderData.medicationId);

  // Generate Defensible Psychiatric SOAP Progress Note
  const generateSoapNote = () => {
    return `PSYCHIATRIC INTAKE & EVALUATION PROGRESS NOTE
Patient: Marcus Vance | DOB: Approx. 31yo Male | Date of Service: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
Encounter Type: Outpatient Telehealth Video Intake

SUBJECTIVE (HPI):
Marcus Vance, a 31-year-old male Senior Data Analyst, presents for psychiatric evaluation with a chief complaint of severe persistent exhaustion, loss of motivation, early morning awakenings, and cognitive fog impacting work performance over the past 6-8 weeks.
• Sleep Architecture: Difficulty initiating sleep with terminal insomnia (3:30 AM awakenings with rumination).
• Anhedonia: Discontinued guitar playing (primary creative outlet) for past 2 months.
• Psychiatric Screen / Bipolar Rule-Out: Patient endorses a discrete 5-day episode 2 years ago characterized by decreased need for sleep (2 hrs/night without fatigue), hyper-productivity, rapid speech, and impulsive spending ($8,000 on studio gear). Meets DSM-5-TR criteria for a past hypomanic episode.
• Safety Assessment: Reports passive thoughts that life is overwhelming ('wish I wouldn't wake up'), but explicitly denies active intent, plan, preparation, or history of self-harm. Protective factors: partner and dog.
• Substances: Drinks 3-4 craft beers nightly to assist with sleep latency; consumes 4 cups of coffee daily.
• Family History: Positive for bipolar disorder in maternal aunt (two psychiatric hospitalizations); recurrent unipolar depression in mother.

OBJECTIVE:
• Vital Signs: BP ${patient.vitals.bp}, HR ${patient.vitals.hr}, BMI ${patient.vitals.bmi}, Afebrile.
• Diagnostic Screeners:
  - PHQ-9: 19 / 27 (Moderately Severe Depression; Question 9 endorsed at +1 passive).
  - MDQ: Positive screen for Bipolar Spectrum Disorder (5 co-occurring hypomanic criteria endorsed with moderate impairment).
• Mental Status Exam (MSE):
  - Appearance: Clean, casually dressed in hoodie, slightly slumped posture.
  - Behavior: Cooperative, eye contact intermittent, mild psychomotor slowing.
  - Speech: Soft, decreased rate with 2-3 second response latency, regular rhythm.
  - Mood: "Exhausted, hopeless, just heavy."
  - Affect: Blunted, constricted, mood-congruent.
  - Thought Process: Linear, logical, goal-directed.
  - Thought Content: Free of delusions, paranoia, or active perceptual disturbances.
  - Cognition: Grossly intact, alert and oriented x4. Subjective concentration complaints.
  - Insight & Judgment: Intact to fair.

ASSESSMENT:
Primary DSM-5-TR Diagnosis:
${isBipolarDiagnosed ? '• Bipolar II Disorder, current episode depressed (296.89 / F31.81)' : '• Major Depressive Disorder, recurrent, moderate (296.32 / F33.1)'}
Diagnostic Rationale: While presentation mimics unipolar depression, the prior 5-day hypomanic episode and positive MDQ confirm Bipolar II. Prescribing unipolar antidepressant monotherapy without a mood stabilizer is strictly contraindicated due to risk of manic/mixed switch. Medical rule-outs (TSH, CBC, CMP) are normal.

PLAN:
1. Pharmacotherapy:
   • ${selectedMed ? `${selectedMed.name}: ${orderData.startingDose || selectedMed.defaultStartingDose}` : 'Pharmacotherapy deferred'}
   • Titration Protocol: ${orderData.titrationSchedule || 'Per clinical protocol'}
2. Laboratory Surveillance:
   • Ordered: ${orderData.labsOrdered.join(', ')}
3. Patient Education & Safety:
   • Counseled on black-box warnings, medication side-effect profiles, and signs of affective destabilization.
   • Counseled on alcohol reduction to preserve sleep architecture.
   • Lethal means restriction reviewed; patient provided with 988 Suicide & Crisis Lifeline contact info.
4. Disposition & Follow-Up:
   • Return to clinic in 4 weeks for longitudinal efficacy and tolerability assessment. Emergency contact protocol established.

Provider Signature: ____________________________, ARNP, PMHNP-BC`;
  };

  const handleCopySoap = () => {
    navigator.clipboard.writeText(generateSoapNote());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
              Case 1: Marcus Vance (31yo) • Adult Mood Disorders &amp; Psychopharmacology Lab
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToTimeJump}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 px-4 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Review Longitudinal Timeline</span>
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

      {/* Tab Switcher: Scorecard vs SOAP Note */}
      <div className="flex border-b border-slate-800 bg-slate-900 rounded-t-2xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('scorecard')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'scorecard'
              ? 'border-teal-500 text-teal-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>Competency Scorecard &amp; Clinical Pearls</span>
        </button>

        <button
          onClick={() => setActiveTab('soap')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'soap'
              ? 'border-teal-500 text-teal-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>EHR Psychiatric SOAP Progress Note</span>
        </button>
      </div>

      {/* TAB 1: COMPETENCY SCORECARD */}
      {activeTab === 'scorecard' && (
        <div className="space-y-6">
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
                {cluesFoundCount} of {cluesList.length} hidden clues uncovered during dialogue.
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
                {isSalvaged ? 'Salvaged through proper antimanic crisis intervention.' : (pharmScore >= 75 ? 'Guideline-concordant mood stabilizer/SGA.' : 'High-risk antidepressant monotherapy.')}
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
                  4. Managing an Antidepressant Manic Switch
                </span>
                <p className="text-slate-300 leading-relaxed">
                  If an antidepressant switch occurs, the first and most critical action is to <strong>immediately discontinue the antidepressant</strong>. Merely adding a sedative or sleep aid is malpractice—you must introduce an antimanic SGA (Quetiapine, Olanzapine, or Aripiprazole) to restore neurotransmitter equilibrium.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EHR PSYCHIATRIC SOAP NOTE GENERATOR */}
      {activeTab === 'soap' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-black text-white">
                Defensible Clinical Documentation: Psychiatric Intake SOAP Note
              </h3>
              <p className="text-xs text-slate-400">
                Generated from your clinical interview, administered screeners, and finalized prescription orders.
              </p>
            </div>

            <button
              onClick={handleCopySoap}
              className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy Note for EHR'}</span>
            </button>
          </div>

          <pre className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap select-all">
            {generateSoapNote()}
          </pre>
        </div>
      )}

    </div>
  );
}
