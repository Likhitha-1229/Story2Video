import React, { useState } from 'react';
import { Video, Copy, Check, Sparkles, Filter, Download, ArrowRight, Layers } from 'lucide-react';
import { StoryProject } from '../types/story';

interface VideoPromptsViewProps {
  project: StoryProject;
  onCopyText: (text: string, label: string) => void;
  copiedId: string | null;
}

export const VideoPromptsView: React.FC<VideoPromptsViewProps> = ({
  project,
  onCopyText,
  copiedId,
}) => {
  const [promptType, setPromptType] = useState<'video' | 'image'>('video');
  const [selectedSceneFilter, setSelectedSceneFilter] = useState<number | 'all'>('all');

  const filteredScenes =
    selectedSceneFilter === 'all'
      ? project.scenes
      : project.scenes.filter((s) => s.sceneNumber === selectedSceneFilter);

  const handleCopyAll = () => {
    const text = filteredScenes
      .map((s) => {
        const p = promptType === 'video' ? s.videoPrompt : s.imagePrompt;
        return `=== SCENE ${s.sceneNumber}: ${s.title.toUpperCase()} (${s.duration}) ===\n[Aspect Ratio: ${
          project.orientation
        } | Style: ${project.style}]\n${p}\n`;
      })
      .join('\n');

    onCopyText(text, `All Scene ${promptType === 'video' ? 'Video' : 'Image'} Prompts`);
  };

  const handleDownloadPrompts = () => {
    const text = project.scenes
      .map((s) => {
        return `// =========================================================================\n// SCENE ${s.sceneNumber}: ${s.title} (${s.duration})\n// Characters: ${s.charactersPresent.join(', ')}\n// Aspect Ratio: ${project.orientation} | Style: ${project.style}\n// =========================================================================\n\n[VIDEO GENERATION PROMPT]\n${s.videoPrompt}\n\n[REFERENCE IMAGE PROMPT]\n${s.imagePrompt}\n\n`;
      })
      .join('\n\n');

    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${project.title.toLowerCase().replace(/\s+/g, '_')}_prompts.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="card-glass rounded-3xl p-6 border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Video className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              AI Generation Prompts Studio
            </h2>
          </div>
          <p className="text-sm text-zinc-400">
            Engineered prompts with injected character consistency profiles, ready to paste into Google Flow, Veo, Sora, or Runway.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleCopyAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>Copy All Prompts</span>
          </button>

          <button
            onClick={handleDownloadPrompts}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>
        </div>
      </div>

      {/* Control bar: Switcher & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800">
        {/* Toggle Video vs Image Prompts */}
        <div className="flex items-center p-1 rounded-xl bg-zinc-950 border border-zinc-800">
          <button
            onClick={() => setPromptType('video')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              promptType === 'video'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Video className="w-3.5 h-3.5" />
            <span>Video Prompts (Text-to-Video)</span>
          </button>
          <button
            onClick={() => setPromptType('image')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
              promptType === 'image'
                ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Reference Frame Prompts</span>
          </button>
        </div>

        {/* Scene Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-xs text-zinc-400">Scene:</span>
          <select
            value={selectedSceneFilter}
            onChange={(e) =>
              setSelectedSceneFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))
            }
            className="px-3 py-1.5 rounded-xl bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none"
          >
            <option value="all">All Scenes ({project.scenes.length})</option>
            {project.scenes.map((s) => (
              <option key={s.sceneNumber} value={s.sceneNumber}>
                Scene {s.sceneNumber}: {s.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Prompts Cards */}
      <div className="space-y-4">
        {filteredScenes.map((scene) => {
          const promptText = promptType === 'video' ? scene.videoPrompt : scene.imagePrompt;
          const isCopied = copiedId === `prompt-${promptType}-${scene.sceneNumber}`;

          return (
            <div
              key={scene.sceneNumber}
              className="card-glass rounded-3xl p-6 border border-zinc-800 hover:border-zinc-700/80 transition-all shadow-lg"
            >
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-zinc-900 border border-amber-500/30 flex items-center justify-center font-bold text-amber-400 text-sm">
                    #{scene.sceneNumber}
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white tracking-tight">
                      {scene.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-0.5">
                      <span>{scene.duration}</span>
                      <span>•</span>
                      <span>{scene.cameraDirection.shotType}</span>
                      <span>•</span>
                      <span className="text-amber-400/90">{scene.charactersPresent.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() =>
                    onCopyText(promptText, `Scene ${scene.sceneNumber} ${promptType} prompt`)
                  }
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    isCopied
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-700'
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Copy {promptType === 'video' ? 'Video' : 'Image'} Prompt</span>
                    </>
                  )}
                </button>
              </div>

              {/* Prompt Text Box */}
              <div className="p-4 rounded-2xl bg-zinc-950 border border-zinc-800 font-mono text-xs text-zinc-200 leading-relaxed break-words whitespace-pre-wrap">
                {promptText}
              </div>

              {/* Tag footer */}
              <div className="flex items-center justify-between mt-3 text-[11px] text-zinc-400">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    Orientation: {project.orientation}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                    Style: {project.style}
                  </span>
                </div>
                <span className="font-mono text-amber-400/80">Google Flow & Veo Compatible</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
