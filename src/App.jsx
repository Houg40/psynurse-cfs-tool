import React, { useState } from 'react';
import Navbar from './components/Navbar';
import VirtualExamRoom from './components/VirtualExamRoom';
import ClinicalChartPad from './components/ClinicalChartPad';
import TimeJumpEngine from './components/TimeJumpEngine';
import PreceptorDebrief from './components/PreceptorDebrief';
import casesData from './data/cases.json';

export default function App() {
  const currentCase = casesData[0]; // Case 1: Marcus Vance

  const initialMessages = [
    {
      sender: 'patient',
      text: currentCase.dialogueLibrary.greeting,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ];

  const initialOrder = {
    diagnosisId: '',
    rationale: '',
    medicationId: '',
    startingDose: '',
    titrationSchedule: '',
    labsOrdered: ['Comprehensive Metabolic Panel (CMP)']
  };

  const initialClues = {
    clue_hypomania: false,
    clue_suicide: false,
    clue_alcohol: false,
    clue_family: false
  };

  const [activePhase, setActivePhase] = useState('interview');
  const [messages, setMessages] = useState(initialMessages);
  const [revealedClues, setRevealedClues] = useState(initialClues);
  const [orderData, setOrderData] = useState(initialOrder);

  // Handle probe button click
  const handleAskProbe = (probe) => {
    // Add clinician message
    const clinicianMsg = {
      sender: 'clinician',
      text: probe.question,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // Check if clue revealed
    let badge = null;
    if (probe.revealsClue) {
      setRevealedClues(prev => ({ ...prev, [probe.revealsClue]: true }));
      badge = currentCase.hiddenClinicalProfile[probe.revealsClue]?.title;
    }

    // Add patient response with slight natural delay
    setTimeout(() => {
      const patientMsg = {
        sender: 'patient',
        text: probe.answer,
        revealedBadge: badge,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, patientMsg]);
    }, 400);

    setMessages(prev => [...prev, clinicianMsg]);
  };

  // Handle free-form typed input with natural NLP intent matching
  const handleSendCustomMessage = (userText) => {
    const textLower = userText.toLowerCase();

    // Match keywords to library
    let matchedProbe = null;
    if (textLower.includes('mania') || textLower.includes('hyper') || textLower.includes('supercharged') || textLower.includes('less sleep') || textLower.includes('energetic') || textLower.includes('spending') || textLower.includes('credit card')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_hypomania');
    } else if (textLower.includes('suicid') || textLower.includes('kill') || textLower.includes('die') || textLower.includes('harm') || textLower.includes('worth living') || textLower.includes('not wake up') || textLower.includes('end it')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_suicide');
    } else if (textLower.includes('sleep') || textLower.includes('insomnia') || textLower.includes('night') || textLower.includes('bed') || textLower.includes('wake')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_sleep');
    } else if (textLower.includes('alcohol') || textLower.includes('drink') || textLower.includes('beer') || textLower.includes('wine') || textLower.includes('substance') || textLower.includes('drugs') || textLower.includes('caffeine') || textLower.includes('coffee')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_alcohol');
    } else if (textLower.includes('family') || textLower.includes('mom') || textLower.includes('dad') || textLower.includes('mother') || textLower.includes('father') || textLower.includes('sister') || textLower.includes('aunt') || textLower.includes('relative') || textLower.includes('genes')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_family');
    } else if (textLower.includes('hobby') || textLower.includes('guitar') || textLower.includes('fun') || textLower.includes('enjoy') || textLower.includes('interest')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_anhedonia');
    } else if (textLower.includes('medical') || textLower.includes('health') || textLower.includes('thyroid') || textLower.includes('doctor') || textLower.includes('labs')) {
      matchedProbe = currentCase.dialogueLibrary.probes.find(p => p.id === 'probe_medical');
    }

    const clinicianMsg = {
      sender: 'clinician',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, clinicianMsg]);

    setTimeout(() => {
      if (matchedProbe) {
        let badge = null;
        if (matchedProbe.revealsClue) {
          setRevealedClues(prev => ({ ...prev, [matchedProbe.revealsClue]: true }));
          badge = currentCase.hiddenClinicalProfile[matchedProbe.revealsClue]?.title;
        }
        const patientMsg = {
          sender: 'patient',
          text: matchedProbe.answer,
          revealedBadge: badge,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, patientMsg]);
      } else {
        // Natural in-character conversational fallback
        const fallbackMsg = {
          sender: 'patient',
          text: "Yeah, it's just been really overwhelming trying to keep up at work while feeling like my battery is at 5%. My brain feels foggy, and I really want to find a medication or plan that can pull me out of this hole without making me feel like a zombie.",
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, fallbackMsg]);
      }
    }, 500);
  };

  // Reset entire case
  const handleResetCase = () => {
    setActivePhase('interview');
    setMessages(initialMessages);
    setRevealedClues(initialClues);
    setOrderData(initialOrder);
  };

  const revealedCount = Object.values(revealedClues).filter(Boolean).length;
  const totalClues = Object.keys(currentCase.hiddenClinicalProfile).length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Navbar
          activePhase={activePhase}
          setActivePhase={setActivePhase}
          onResetCase={handleResetCase}
          revealedCluesCount={revealedCount}
          totalCluesCount={totalClues}
        />

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {activePhase === 'interview' && (
            <VirtualExamRoom
              caseData={currentCase}
              messages={messages}
              onSendMessage={handleSendCustomMessage}
              onAskProbe={handleAskProbe}
              revealedClues={revealedClues}
              onAdvanceToCharting={() => setActivePhase('charting')}
            />
          )}

          {activePhase === 'charting' && (
            <ClinicalChartPad
              caseData={currentCase}
              orderData={orderData}
              setOrderData={setOrderData}
              onBackToInterview={() => setActivePhase('interview')}
              onCommitOrderAndJump={() => setActivePhase('timejump')}
            />
          )}

          {activePhase === 'timejump' && (
            <TimeJumpEngine
              caseData={currentCase}
              orderData={orderData}
              onBackToChart={() => setActivePhase('charting')}
              onProceedToDebrief={() => setActivePhase('debrief')}
            />
          )}

          {activePhase === 'debrief' && (
            <PreceptorDebrief
              caseData={currentCase}
              orderData={orderData}
              revealedClues={revealedClues}
              onRestartCase={handleResetCase}
              onBackToTimeJump={() => setActivePhase('timejump')}
            />
          )}
        </main>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 space-y-1">
          <p className="font-semibold text-slate-400">
            PsyNurse CFS (Clinical Flight Simulator) • Standardized Psychiatric OSCE &amp; Pharmacotherapy Lab
          </p>
          <p>
            Zero-PHI Simulated Training Environment • Built for PMHNPs, Psychiatric Residents &amp; Clinicians
          </p>
        </div>
      </footer>
    </div>
  );
}
