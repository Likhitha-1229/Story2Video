import React from 'react';
import { Volume2, Music, Disc, Radio, Clock, Copy, Download } from 'lucide-react';
import { StoryProject } from '../types/story';

interface AudioViewProps {
  project: StoryProject;
  onCopyText: (text: string, label: string) => void;
}

export const AudioView: React.FC<AudioViewProps> = ({ project, onCopyText }) => {
  const handleCopyCueSheet = () => {
    const sheet = project.scenes
      .map((s) => {
        return `[SCENE ${s.sceneNumber}: ${s.title.toUpperCase()} (${s.duration})]\n- MUSIC MOOD: ${
          s.backgroundMusic.mood
        }\n- TEMPO: ${s.backgroundMusic.tempo}\n- INSTRUMENTATION: ${
          s.backgroundMusic.instrumentation
        }\n- SFX: ${s.soundEffects.join(', ')}\n`;
      })
      .join('\n');

    onCopyText(sheet, 'Audio Cue Sheet');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card-glass rounded-3xl p-6 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Volume2 className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Sound Design & Musical Score Plan
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Foley cues, sound effects, and musical tempo directions designed to accompany your generated video clips.
          </p>
        </div>

        <button
          onClick={handleCopyCueSheet}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Full Audio Cue Sheet</span>
        </button>
      </div>

      {/* Scene by scene audio timeline */}
      <div className="space-y-4">
        {project.scenes.map((scene) => (
          <div
            key={scene.sceneNumber}
            className="card-glass rounded-3xl p-6 border border-zinc-800 hover:border-zinc-700/80 transition-all shadow-lg"
          >
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
              <div className="flex items-center gap-3">
                <span className="w-8 h-8 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-xs">
                  #{scene.sceneNumber}
                </span>
                <div>
                  <h3 className="text-base font-bold text-white tracking-tight">{scene.title}</h3>
                  <span className="text-xs text-zinc-400 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-zinc-400" /> {scene.duration}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Background Music Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2">
                  <Music className="w-4 h-4" />
                  <span>Musical Score Cue</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Mood & Atmosphere:</span>
                    <span className="text-zinc-200 font-medium">{scene.backgroundMusic.mood}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Tempo / Pace:</span>
                    <span className="text-amber-300 font-mono">{scene.backgroundMusic.tempo}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[11px]">Instrumentation:</span>
                    <span className="text-zinc-300">{scene.backgroundMusic.instrumentation}</span>
                  </div>
                </div>
              </div>

              {/* Sound Effects & Foley Card */}
              <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-400 mb-2">
                  <Volume2 className="w-4 h-4" />
                  <span>Sound Effects & Foley</span>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {scene.soundEffects.map((sfx, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 flex items-center gap-1.5 shadow-sm"
                    >
                      <Disc className="w-3 h-3 text-rose-400" />
                      <span>{sfx}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
