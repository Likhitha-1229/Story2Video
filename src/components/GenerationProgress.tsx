import React, { useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Film, Loader2 } from 'lucide-react';

interface GenerationProgressProps {
  currentStage?: number;
}

const STAGES = [
  'Understanding your story...',
  'Creating characters...',
  'Building the storyboard...',
  'Writing dialogue...',
  'Creating camera directions...',
  'Generating video prompts...',
  'Finalizing your production plan...',
];

export const GenerationProgress: React.FC<GenerationProgressProps> = () => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 2400);

    return () => clearInterval(interval);
  }, []);

  const progressPercent = Math.min(100, Math.round(((activeStep + 1) / STAGES.length) * 100));

  return (
    <div className="card-glass rounded-3xl p-8 max-w-xl mx-auto border border-amber-500/30 shadow-2xl relative overflow-hidden text-center my-8">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Clapperboard Animation */}
      <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-xl shadow-amber-500/25 flex items-center justify-center animate-pulse">
        <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
          <Film className="w-8 h-8 text-amber-400" />
        </div>
      </div>

      <h3 className="text-2xl font-extrabold text-white tracking-tight mb-2">
        Directing Your Film
      </h3>
      <p className="text-sm text-zinc-400 mb-6">
        Gemini AI is analyzing your narrative, generating characters, and framing camera shots.
      </p>

      {/* Progress Bar */}
      <div className="w-full bg-zinc-900 rounded-full h-2.5 mb-6 overflow-hidden p-0.5 border border-zinc-800">
        <div
          className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 h-full rounded-full transition-all duration-700 ease-out shadow-sm shadow-amber-400/50"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="space-y-2.5 text-left max-w-sm mx-auto">
        {STAGES.map((stage, idx) => {
          const isDone = idx < activeStep;
          const isCurrent = idx === activeStep;
          return (
            <div
              key={stage}
              className={`flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs transition-all duration-300 ${
                isCurrent
                  ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 font-semibold'
                  : isDone
                  ? 'text-zinc-400 line-through opacity-70'
                  : 'text-zinc-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-amber-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-zinc-700 shrink-0" />
              )}
              <span className="truncate">{stage}</span>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-zinc-800/80 text-[11px] text-zinc-400 flex items-center justify-center gap-1.5 font-mono">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>Optimizing prompt coherence for Google Flow, Veo & Runway</span>
      </div>
    </div>
  );
};
