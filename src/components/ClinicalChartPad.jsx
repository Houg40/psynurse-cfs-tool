import React, { useState } from 'react';
import { FileText, ClipboardList, Pill, ShieldAlert, FastForward, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function ClinicalChartPad({ caseData, orderData, setOrderData, onBackToInterview, onCommitOrderAndJump }) {
  const [activeTab, setActiveTab] = useState('screeners');
  const patient = caseData.patient;
  const screeners = caseData.screeners;
  const prescribingOptions = caseData.prescribingOptions;

  const diagnoses = [
    { id: 'bipolar_2_depressed', label: 'Bipolar II Disorder, current episode depressed (DSM-5 296.89 / F31.81)', isCorrect: true },
    { id: 'mdd_recurrent_mod', label: 'Major Depressive Disorder, recurrent, moderate (DSM-5 296.32 / F33.1) [The Common Trap]', isCorrect: false },
    { id: 'gad', label: 'Generalized Anxiety Disorder (DSM-5 300.02 / F41.1)', isCorrect: false },
    { id: 'alcohol_induced', label: 'Substance/Medication-Induced Depressive Disorder (DSM-5 291.89 / F10.14)', isCorrect: false },
    { id: 'adhd_combined', label: 'Attention-Deficit/Hyperactivity Disorder, Adult, Combined (DSM-5 314.01 / F90.2)', isCorrect: false },
  ];

  const handleMedChange = (medId) => {
    const med = prescribingOptions.find(m => m.id === medId);
    if (med) {
      setOrderData(prev => ({
        ...prev,
        medicationId: medId,
        startingDose: med.defaultStartingDose,
        titrationSchedule: med.titrationGuidance
      }));
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header Card */}
      <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <button
              onClick={onBackToInterview}
              className="text-slate-400 hover:text-white flex items-center gap-1 text-xs font-semibold mr-2 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Interview</span>
            </button>
            <span className="text-[10px] uppercase font-bold text-teal-400 bg-teal-950 px-2 py-0.5 rounded border border-teal-800">
              Provider EHR Order Suite
            </span>
          </div>
          <h2 className="text-lg font-black text-white">
            Clinical Diagnostic Formulation &amp; Prescription Pad
          </h2>
          <p className="text-xs text-slate-400">
            Review objective screeners, commit to your DSM-5 diagnosis, and write your medication orders for Marcus Vance.
          </p>
        </div>

        <button
          onClick={onCommitOrderAndJump}
          disabled={!orderData.diagnosisId || !orderData.medicationId}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-5 py-3 rounded-xl font-bold text-xs transition-all shadow-lg hover:shadow-teal-500/20"
        >
          <FastForward className="w-4 h-4" />
          <span>Sign Order &amp; Jump to Week 4 Follow-Up</span>
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800 bg-slate-900 rounded-t-2xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveTab('screeners')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'screeners'
              ? 'border-teal-500 text-teal-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ClipboardList className="w-4 h-4" />
          <span>1. Objective Screeners (PHQ-9 &amp; MDQ)</span>
        </button>

        <button
          onClick={() => setActiveTab('diagnosis')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'diagnosis'
              ? 'border-teal-500 text-teal-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>2. DSM-5 Diagnostic Formulation</span>
        </button>

        <button
          onClick={() => setActiveTab('prescribing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-xl text-xs font-bold transition-all border-b-2 ${
            activeTab === 'prescribing'
              ? 'border-teal-500 text-teal-400 bg-slate-950/60'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Pill className="w-4 h-4" />
          <span>3. Pharmacotherapy Order Pad</span>
        </button>
      </div>

      {/* Tab Content 1: Objective Screeners */}
      {activeTab === 'screeners' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* PHQ-9 Card */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{screeners.phq9.name}</h3>
                <p className="text-[11px] text-slate-400">{screeners.phq9.purpose}</p>
              </div>
              <div className="text-right">
                <span className="text-lg font-black text-amber-400">{screeners.phq9.totalScore} / 27</span>
                <span className="text-[10px] block text-slate-400">{screeners.phq9.severity}</span>
              </div>
            </div>

            <div className="space-y-2">
              {screeners.phq9.scores.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs p-2 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="text-slate-300 pr-2">{idx + 1}. {item.q}</span>
                  <span className={`font-bold px-2 py-0.5 rounded text-[10px] ${
                    item.val >= 2 ? 'bg-amber-950/80 text-amber-300 border border-amber-800/60' : 'bg-slate-800 text-slate-400'
                  }`}>
                    +{item.val} ({item.label})
                  </span>
                </div>
              ))}
            </div>

            {/* Suicide Alert */}
            <div className="p-3 bg-red-950/40 border border-red-800/70 rounded-xl text-xs text-red-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Question 9 Endorsed (+1):</strong> Passive suicidal thoughts acknowledged. No active plan or intent, but requires ongoing safety assessment and lethal means restriction.
              </span>
            </div>
          </div>

          {/* MDQ Bipolar Screen Card */}
          <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-white">{screeners.mdq.name}</h3>
                <p className="text-[11px] text-slate-400">{screeners.mdq.purpose}</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-950 text-red-300 border border-red-800">
                POSITIVE BIPOLAR SCREEN
              </span>
            </div>

            <div className="p-3.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-300 space-y-2">
              <p className="font-semibold text-teal-300">{screeners.mdq.summary}</p>
              <div className="space-y-1.5 pt-2">
                {screeners.mdq.responses.map((resp, idx) => (
                  <div key={idx} className="flex justify-between items-center text-[11px] border-b border-slate-800/60 pb-1">
                    <span className="text-slate-300">{resp.symptom}</span>
                    <span className="font-bold text-emerald-400">
                      {resp.endorsed ? 'YES' : resp.answer}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-amber-950/40 border border-amber-800/70 rounded-xl text-xs text-amber-200">
              <div className="flex items-center gap-2 font-bold mb-1">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Preceptor Clinical Advisory</span>
              </div>
              <p className="text-[11px] text-amber-300/90 leading-relaxed">
                A positive MDQ in a patient presenting with depression indicates <strong>Bipolar Spectrum Disorder</strong> until proven otherwise. Antidepressant monotherapy without a mood stabilizer is dangerous.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* Tab Content 2: DSM-5 Diagnosis Selection */}
      {activeTab === 'diagnosis' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Primary Diagnostic Commitment</h3>
            <p className="text-xs text-slate-400">
              Select the primary DSM-5-TR diagnosis that will drive your treatment planning and pharmacotherapy.
            </p>
          </div>

          <div className="space-y-3">
            {diagnoses.map((d) => (
              <label
                key={d.id}
                className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  orderData.diagnosisId === d.id
                    ? 'bg-teal-950/50 border-teal-500 text-white shadow-md'
                    : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <input
                  type="radio"
                  name="diagnosis"
                  value={d.id}
                  checked={orderData.diagnosisId === d.id}
                  onChange={() => setOrderData(prev => ({ ...prev, diagnosisId: d.id }))}
                  className="mt-1 text-teal-600 focus:ring-teal-500"
                />
                <div>
                  <span className="text-xs font-bold block">{d.label}</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    {d.isCorrect
                      ? 'Supported by MDQ positive screen and prior 5-day hypomanic episode.'
                      : 'Common misdiagnosis if hypomania is not specifically screened.'}
                  </span>
                </div>
              </label>
            ))}
          </div>

          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Clinical Rationale &amp; Differential Considerations (Optional EHR Note):
            </label>
            <textarea
              rows={3}
              value={orderData.rationale}
              onChange={(e) => setOrderData(prev => ({ ...prev, rationale: e.target.value }))}
              placeholder="e.g., Patient endorses unipolar-appearing depressive symptoms, but positive MDQ and history of hypomania 2 years ago confirm Bipolar II. Ruled out thyroid disease via normal TSH."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>
      )}

      {/* Tab Content 3: Pharmacotherapy Order Pad */}
      {activeTab === 'prescribing' && (
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-1">Psychiatric Pharmacotherapy Order Pad</h3>
            <p className="text-xs text-slate-400">
              Select your initial medication, starting dose, titration plan, and baseline lab orders.
            </p>
          </div>

          {/* Medication Selector Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {prescribingOptions.map((med) => {
              const isSelected = orderData.medicationId === med.id;
              return (
                <div
                  key={med.id}
                  onClick={() => handleMedChange(med.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-teal-950/50 border-teal-500 text-white shadow-md ring-1 ring-teal-500'
                      : 'bg-slate-950/50 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-xs font-black">{med.name}</span>
                    <span className="text-[10px] font-semibold text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                      {med.class}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Default start: {med.defaultStartingDose}</p>
                </div>
              );
            })}
          </div>

          {/* Dosing & Titration Inputs */}
          {orderData.medicationId && (
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Starting Dose &amp; Route:</label>
                  <input
                    type="text"
                    value={orderData.startingDose}
                    onChange={(e) => setOrderData(prev => ({ ...prev, startingDose: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-400 block mb-1">Titration Protocol:</label>
                  <input
                    type="text"
                    value={orderData.titrationSchedule}
                    onChange={(e) => setOrderData(prev => ({ ...prev, titrationSchedule: e.target.value }))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-white focus:outline-none focus:border-teal-500"
                  />
                </div>
              </div>

              {/* Baseline Labs to Order */}
              <div className="pt-2">
                <span className="text-[11px] font-bold text-slate-400 block mb-2">Baseline Labs &amp; Monitoring to Order:</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {['Fasting Lipid Panel & Glucose', 'Comprehensive Metabolic Panel (CMP)', 'Baseline ECG (QTc interval)', 'Urine Toxicology Screen'].map((lab) => {
                    const isChecked = orderData.labsOrdered.includes(lab);
                    return (
                      <label key={lab} className="flex items-center gap-2 p-2 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer text-[11px]">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setOrderData(prev => ({
                              ...prev,
                              labsOrdered: isChecked
                                ? prev.labsOrdered.filter(l => l !== lab)
                                : [...prev.labsOrdered, lab]
                            }));
                          }}
                          className="rounded text-teal-600 focus:ring-teal-500"
                        />
                        <span className="text-slate-300">{lab}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
}
