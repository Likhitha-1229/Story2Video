import React, { useState } from 'react';
import {
  Clapperboard,
  ChevronDown,
  ChevronUp,
  Clock,
  MapPin,
  Users,
  Camera,
  MessageSquare,
  Volume2,
  Music,
  Copy,
  Check,
  Edit3,
  Video,
  Sparkles,
  ArrowDown,
  Sun,
} from 'lucide-react';
import { Scene, StoryProject } from '../types/story';

interface StoryboardViewProps {
  project: StoryProject;
  onEditScene: (scene: Scene) => void;
  onCopyText: (text: string, label: string) => void;
  copiedId: string | null;
  onNavigateToStudio?: () => void;
}

export const StoryboardView: React.FC<StoryboardViewProps> = ({
  project,
  onEditScene,
  onCopyText,
  copiedId,
  onNavigateToStudio,
}) => {
  // Keep track of which scenes are expanded. By default, open first scene.
  const [expandedScenes, setExpandedScenes] = useState<Record<number, boolean>>({
    1: true,
  });

  const toggleExpand = (sceneNum: number) => {
    setExpandedScenes((prev) => ({
      ...prev,
      [sceneNum]: !prev[sceneNum],
    }));
  };

  const expandAll = () => {
    const all: Record<number, boolean> = {};
    project.scenes.forEach((s) => {
      all[s.sceneNumber] = true;
    });
    setExpandedScenes(all);
  };

  const collapseAll = () => {
    setExpandedScenes({});
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="card-glass rounded-3xl p-6 border border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Visual Storyboard & Shot Sequence
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            {project.scenes.length} sequential scenes • {project.orientation} • {project.style}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onNavigateToStudio && (
            <button
              onClick={onNavigateToStudio}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-bold text-xs shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-zinc-950" />
              <span>🎬 Generate Video</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 border-l border-zinc-800 pl-3">
            <button
              onClick={expandAll}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-300 border border-zinc-800 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-xs font-medium text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
            >
              Collapse All
            </button>
          </div>
        </div>
      </div>

      {/* Sequential Scene Cards List with Connecting Arrows */}
      <div className="space-y-6 relative">
        {project.scenes.map((scene, idx) => {
          const isExpanded = Boolean(expandedScenes[scene.sceneNumber]);
          const isLast = idx === project.scenes.length - 1;
          const isPromptCopied = copiedId === `vp-${scene.sceneNumber}`;
          const isImageCopied = copiedId === `ip-${scene.sceneNumber}`;

          return (
            <div key={scene.sceneNumber} className="relative">
              {/* Scene Card */}
              <div
                className={`card-glass rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isExpanded
                    ? 'border-amber-500/40 shadow-xl shadow-amber-500/5'
                    : 'border-zinc-800/80 hover:border-zinc-700/80 shadow-md'
                }`}
              >
                {/* Collapsed / Top Bar */}
                <div className="p-5 md:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Number & Title & Metadata */}
                  <div
                    onClick={() => toggleExpand(scene.sceneNumber)}
                    className="flex items-start gap-4 flex-1 cursor-pointer select-none"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-amber-500/30 flex flex-col items-center justify-center shrink-0 shadow-sm">
                      <span className="text-[10px] uppercase font-mono text-amber-400 font-bold">
                        Scene
                      </span>
                      <span className="text-lg font-black text-white leading-none">
                        {scene.sceneNumber}
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg md:text-xl font-bold text-white tracking-tight">
                          {scene.title}
                        </h3>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          {scene.duration}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 text-xs text-zinc-400 flex-wrap">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                          <span className="text-zinc-300">{scene.location}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Sun className="w-3.5 h-3.5 text-amber-400" />
                          <span>{scene.timeOfDay}</span>
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="text-zinc-300">
                            {scene.charactersPresent.join(', ')}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end md:self-center">
                    <button
                      onClick={() => onEditScene(scene)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700/80 text-xs font-semibold transition-all"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                      <span>Edit Scene</span>
                    </button>

                    <button
                      onClick={() => toggleExpand(scene.sceneNumber)}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4 text-amber-400" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="px-5 pb-6 md:px-6 md:pb-6 pt-2 border-t border-zinc-800/80 space-y-6">
                    {/* Character Actions & Expressions Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Character Actions */}
                      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                        <div className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2.5 flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5" /> Character Actions
                        </div>
                        <div className="space-y-2 text-xs">
                          {scene.characterActions.map((act, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-semibold text-zinc-200 shrink-0">
                                {act.character}:
                              </span>
                              <span className="text-zinc-300 leading-relaxed">{act.action}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Facial Expressions */}
                      <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
                        <div className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-2.5 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" /> Facial Expressions
                        </div>
                        <div className="space-y-2 text-xs">
                          {scene.facialExpressions.map((exp, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <span className="px-2 py-0.5 rounded-md bg-zinc-800 font-semibold text-zinc-200 shrink-0">
                                {exp.character}:
                              </span>
                              <span className="text-amber-200/90 font-medium leading-relaxed">
                                {exp.expression}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Camera Direction Details */}
                    <div className="p-4 rounded-2xl bg-zinc-900/80 border border-zinc-800">
                      <div className="flex items-center justify-between mb-2">
                        <div className="text-xs font-bold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5">
                          <Camera className="w-3.5 h-3.5 text-amber-400" /> Camera Direction
                        </div>
                        <span className="text-[11px] font-mono text-zinc-400">
                          {scene.cameraDirection.shotType}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-2 text-xs">
                        <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                          <span className="text-[10px] uppercase text-zinc-400 block">Angle</span>
                          <span className="font-semibold text-zinc-200">{scene.cameraDirection.angle}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                          <span className="text-[10px] uppercase text-zinc-400 block">Movement</span>
                          <span className="font-semibold text-zinc-200">{scene.cameraDirection.movement}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                          <span className="text-[10px] uppercase text-zinc-400 block">Shot Type</span>
                          <span className="font-semibold text-zinc-200">{scene.cameraDirection.shotType}</span>
                        </div>
                        <div className="p-2 rounded-xl bg-zinc-950 border border-zinc-800/60">
                          <span className="text-[10px] uppercase text-zinc-400 block">Distance</span>
                          <span className="font-semibold text-zinc-200">{scene.cameraDirection.distance}</span>
                        </div>
                      </div>
                      <p className="text-xs text-zinc-400 italic">
                        "{scene.cameraDirection.summary}"
                      </p>
                    </div>

                    {/* Environment & Dialogue */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Environment & Objects */}
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 text-xs">
                        <div className="font-bold uppercase tracking-wider text-zinc-400 mb-1.5">
                          Environment & Props
                        </div>
                        <p className="text-zinc-300 leading-relaxed">{scene.environment}</p>
                      </div>

                      {/* Dialogue Section */}
                      <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 text-xs">
                        <div className="font-bold uppercase tracking-wider text-zinc-400 mb-2 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <MessageSquare className="w-3.5 h-3.5 text-indigo-400" /> Spoken Dialogue
                          </span>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {project.language}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {scene.dialogues.length > 0 ? (
                            scene.dialogues.map((dlg, i) => (
                              <div key={i} className="p-2 rounded-xl bg-zinc-950/80 border border-zinc-800/60">
                                <span className="font-bold text-amber-400 block mb-0.5">
                                  {dlg.speaker}:
                                </span>
                                <span className="text-zinc-200 text-xs italic">
                                  "{dlg.line}"
                                </span>
                              </div>
                            ))
                          ) : (
                            <p className="text-zinc-400 italic">Silent or action scene.</p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Audio & Music */}
                    <div className="p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/70 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                          <Volume2 className="w-3.5 h-3.5 text-rose-400" /> Sound Effects:
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {scene.soundEffects.map((sfx, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-lg bg-zinc-800 text-zinc-300 text-[11px]"
                            >
                              {sfx}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="sm:border-l sm:border-zinc-800 sm:pl-4">
                        <span className="font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 mb-1">
                          <Music className="w-3.5 h-3.5 text-emerald-400" /> Background Music:
                        </span>
                        <p className="text-zinc-300 text-[11px]">
                          <span className="font-semibold text-emerald-300">{scene.backgroundMusic.mood}</span> •{' '}
                          {scene.backgroundMusic.tempo}
                        </p>
                      </div>
                    </div>

                    {/* Prompts Section (Image & Video) */}
                    <div className="space-y-3 pt-2 border-t border-zinc-800/80">
                      {/* Video Prompt */}
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-zinc-950 to-zinc-900 border border-amber-500/30">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Video className="w-4 h-4 text-amber-400" />
                            <span className="text-xs font-bold text-white uppercase tracking-wider">
                              AI Video Generation Prompt (Google Flow / Veo / Runway)
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              onCopyText(scene.videoPrompt, `Scene ${scene.sceneNumber} Video Prompt`)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all"
                          >
                            {isPromptCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Video Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-3 rounded-xl bg-black/60 border border-zinc-800/80 text-[11px] font-mono text-zinc-200 leading-relaxed">
                          {scene.videoPrompt}
                        </div>
                      </div>

                      {/* Reference Image Prompt */}
                      <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-indigo-400" />
                            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                              Scene Reference Image Prompt (Consistency Frame)
                            </span>
                          </div>
                          <button
                            onClick={() =>
                              onCopyText(scene.imagePrompt, `Scene ${scene.sceneNumber} Image Prompt`)
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
                          >
                            {isImageCopied ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-400" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>Copy Image Prompt</span>
                              </>
                            )}
                          </button>
                        </div>
                        <div className="p-3 rounded-xl bg-black/40 border border-zinc-800 text-[11px] font-mono text-zinc-400 leading-relaxed">
                          {scene.imagePrompt}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Connecting arrow indicator between scenes */}
              {!isLast && (
                <div className="flex items-center justify-center my-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-amber-400/80 shadow-sm">
                    <ArrowDown className="w-4 h-4" />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
