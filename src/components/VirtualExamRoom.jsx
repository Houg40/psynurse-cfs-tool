import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, AlertCircle, HeartPulse, User, HelpCircle, CheckCircle2, ChevronRight, Activity } from 'lucide-react';

export default function VirtualExamRoom({ caseData, messages, onSendMessage, onAskProbe, revealedClues, onAdvanceToCharting }) {
  const [customInput, setCustomInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!customInput.trim()) return;
    onSendMessage(customInput);
    setCustomInput('');
  };

  const patient = caseData.patient;
  const cluesList = Object.values(caseData.hiddenClinicalProfile);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* Left Column: Patient Telehealth Video Feed & Non-Verbal Observations (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        
        {/* Telehealth Video Card */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="relative aspect-video bg-slate-950 flex items-center justify-center">
            <img
              src={patient.avatar}
              alt={patient.name}
              className="w-full h-full object-cover opacity-85"
            />
            {/* Live Indicator Overlay */}
            <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-xs border border-slate-700/60 text-[11px] font-bold text-white">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Telehealth Room • Live</span>
            </div>
            {/* Patient Name Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-xs border border-slate-700/60">
              <div>
                <p className="text-xs font-bold text-white leading-tight">{patient.name}</p>
                <p className="text-[10px] text-slate-400">{patient.age}yo • {patient.occupation}</p>
              </div>
              <span className="text-[10px] font-semibold text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800/60">
                Patient Intake
              </span>
            </div>
          </div>

          {/* Non-Verbal & Mental Status Observations */}
          <div className="p-4 space-y-3 bg-slate-900/90 text-xs">
            <div className="flex items-center gap-2 text-teal-400 font-bold border-b border-slate-800 pb-2">
              <Activity className="w-4 h-4" />
              <span>Real-Time Clinical Observations (MSE)</span>
            </div>
            
            <div className="space-y-1.5 text-slate-300">
              <p><strong className="text-slate-400">Affect:</strong> Constricted, blunted; minimal spontaneous smile.</p>
              <p><strong className="text-slate-400">Eye Contact:</strong> Intermittent, tends to look down at hands.</p>
              <p><strong className="text-slate-400">Latency:</strong> Noticeable 2-3 second pause before answering.</p>
              <p><strong className="text-slate-400">Speech:</strong> Soft volume, monotonous tone.</p>
            </div>

            {/* Vital Signs Glance */}
            <div className="mt-3 pt-3 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Blood Pressure</span>
                <span className="font-bold text-white">{patient.vitals.bp}</span>
              </div>
              <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                <span className="text-slate-400 block">Heart Rate</span>
                <span className="font-bold text-white">{patient.vitals.hr}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Hidden Clues Discovery Panel */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Diagnostic Objectives
            </h4>
            <span className="text-[10px] text-teal-400 font-bold">
              {Object.values(revealedClues).filter(Boolean).length} / {cluesList.length} Uncovered
            </span>
          </div>

          <div className="space-y-2">
            {cluesList.map((clue) => {
              const isFound = revealedClues[clue.id];
              return (
                <div
                  key={clue.id}
                  className={`p-2.5 rounded-xl border text-xs transition-all ${
                    isFound
                      ? 'bg-emerald-950/30 border-emerald-800/70 text-emerald-200'
                      : 'bg-slate-950/40 border-slate-800/70 text-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {isFound ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-slate-600 flex-shrink-0" />
                    )}
                    <span className="font-semibold">{clue.title}</span>
                  </div>
                  {isFound && (
                    <p className="text-[11px] text-slate-300 mt-1 pl-6 leading-relaxed">
                      {clue.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Right Column: Interactive Chat & Clinical Probing Suite (8 cols) */}
      <div className="lg:col-span-8 flex flex-col h-[700px] bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-300">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Clinical Diagnostic Interview</h3>
              <p className="text-[11px] text-slate-400">Ask clinical questions to explore symptoms, rule out mania, and assess safety.</p>
            </div>
          </div>

          <button
            onClick={onAdvanceToCharting}
            className="flex items-center gap-1.5 text-xs font-bold bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>Proceed to Chart &amp; Orders</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Message Transcript Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, idx) => {
            const isClinician = msg.sender === 'clinician';
            return (
              <div
                key={idx}
                className={`flex flex-col ${isClinician ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-500 mb-1 px-1">
                  {isClinician ? 'You (Clinician)' : `${patient.name} (Patient)`}
                </span>
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs leading-relaxed shadow-sm ${
                    isClinician
                      ? 'bg-teal-600 text-white rounded-tr-xs'
                      : 'bg-slate-800 border border-slate-700 text-slate-200 rounded-tl-xs'
                  }`}
                >
                  <p>{msg.text}</p>
                  {msg.revealedBadge && (
                    <div className="mt-2.5 pt-2 border-t border-emerald-500/30 flex items-center gap-1.5 text-[11px] font-bold text-emerald-300">
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>Diagnostic Insight Unlocked: {msg.revealedBadge}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Clinical Probes Action Dock */}
        <div className="p-3 bg-slate-950 border-t border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-teal-400" />
              Quick-Action Clinical Probes (Click to Ask)
            </span>
            <span className="text-[10px] text-slate-500">
              Explore key diagnostic domains
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
            {caseData.dialogueLibrary.probes.map((probe) => {
              const clueRevealed = probe.revealsClue && revealedClues[probe.revealsClue];
              return (
                <button
                  key={probe.id}
                  onClick={() => onAskProbe(probe)}
                  className={`text-[11px] font-medium px-2.5 py-1.5 rounded-lg border transition-all text-left flex items-center gap-1.5 ${
                    clueRevealed
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:border-teal-500'
                  }`}
                >
                  <span className="font-bold text-teal-400">[{probe.category}]</span>
                  <span className="truncate max-w-[280px]">{probe.question}</span>
                </button>
              );
            })}
          </div>

          {/* Free-form Text Entry Form */}
          <form onSubmit={handleSend} className="flex gap-2 pt-1">
            <input
              type="text"
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              placeholder="Or type your own clinical question to Marcus..."
              className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500"
            />
            <button
              type="submit"
              disabled={!customInput.trim()}
              className="bg-teal-600 hover:bg-teal-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
}
