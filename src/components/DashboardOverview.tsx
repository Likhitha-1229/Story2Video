import React from 'react';
import {
  Film,
  Users,
  Clapperboard,
  Video,
  Volume2,
  Wand2,
  Share2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { StoryProject } from '../types/story';
import { ActiveTab } from './Sidebar';

interface DashboardOverviewProps {
  project: StoryProject;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenExport: () => void;
  onOpenProjects: () => void;
  onCreateNewStory: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  project,
  setActiveTab,
  onOpenExport,
  onOpenProjects,
  onCreateNewStory,
}) => {
  return (
    <div className="space-y-6">
      {/* Hero Summary Card */}
      <div className="relative overflow-hidden rounded-3xl border border-zinc-800 bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-950 p-6 md:p-8 shadow-xl">
        <div className="relative z-10">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {project.genre}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                {project.style}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800">
                {project.orientation}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenExport}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 text-xs font-semibold transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Export Package</span>
              </button>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mb-3">
            {project.title}
          </h2>

          <p className="text-sm md:text-base text-zinc-300 max-w-3xl leading-relaxed mb-6">
            {project.summary}
          </p>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80">
            <div
              onClick={() => setActiveTab('characters')}
              className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Characters</span>
                <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {project.characters.length}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5 truncate">
                {project.characters.map((c) => c.name).join(', ')}
              </div>
            </div>

            <div
              onClick={() => setActiveTab('storyboard')}
              className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Scenes</span>
                <Clapperboard className="w-4 h-4 text-indigo-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {project.scenes.length}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">
                Target: {project.targetDuration}
              </div>
            </div>

            <div
              onClick={() => setActiveTab('prompts')}
              className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>AI Prompts</span>
                <Video className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight">
                {project.scenes.length * 2}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">Video & Ref Images</div>
            </div>

            <div
              onClick={() => setActiveTab('director')}
              className="p-3.5 rounded-2xl bg-zinc-950/60 border border-zinc-800/80 hover:border-amber-500/40 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between text-zinc-400 text-xs mb-1">
                <span>Dialogue</span>
                <Wand2 className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
              </div>
              <div className="text-2xl font-bold text-white tracking-tight truncate">
                {project.language}
              </div>
              <div className="text-[11px] text-zinc-400 mt-0.5">AI Director Ready</div>
            </div>
          </div>
        </div>
      </div>

      {/* Production Quick Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Video Generation Card */}
        <div
          onClick={() => setActiveTab('studio')}
          className="card-glass rounded-3xl p-5 border border-amber-500/40 hover:border-amber-400 transition-all cursor-pointer group flex flex-col justify-between shadow-lg shadow-amber-500/5 bg-gradient-to-b from-amber-500/10 to-transparent"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-bold mb-4 group-hover:scale-105 transition-transform shadow-md">
              <Film className="w-5 h-5 text-zinc-950" />
            </div>
            <div className="flex items-center gap-1.5 mb-1">
              <h3 className="text-base font-bold text-white tracking-tight">
                🎬 Video Studio
              </h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono">
                Veo
              </span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Generate actual video clips, track queue status, play in HTML5 player, and combine scenes.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Open Video Studio</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Character Consistency Card */}
        <div
          onClick={() => setActiveTab('characters')}
          className="card-glass rounded-3xl p-5 border border-zinc-800 hover:border-amber-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mb-1">
              Character Bible
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Inspect defined visual prompt anchors for {project.characters.length} characters to maintain consistency.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 group-hover:translate-x-1 transition-transform">
            <span>Explore Bible</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Storyboard Card */}
        <div
          onClick={() => setActiveTab('storyboard')}
          className="card-glass rounded-3xl p-5 border border-zinc-800 hover:border-indigo-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-105 transition-transform">
              <Clapperboard className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mb-1">
              Storyboard & Camera
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Full breakdown with camera angles, movements, dialogue, and edit controls.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-400 group-hover:translate-x-1 transition-transform">
            <span>Open Storyboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Story Director AI Card */}
        <div
          onClick={() => setActiveTab('director')}
          className="card-glass rounded-3xl p-5 border border-zinc-800 hover:border-rose-500/40 transition-all cursor-pointer group flex flex-col justify-between"
        >
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-400 mb-4 group-hover:scale-105 transition-transform">
              <Wand2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight mb-1">
              Story Director AI
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Instruct the AI to rewrite scenes, add suspense, switch to Telugu dialogue, or alter pacing.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 group-hover:translate-x-1 transition-transform">
            <span>Direct Scenes</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Sequential Scene Previews */}
      <div className="card-glass rounded-3xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Production Sequence Overview</h3>
            <p className="text-xs text-zinc-400">Chronological flow from establishing shot to resolution</p>
          </div>
          <button
            onClick={() => setActiveTab('storyboard')}
            className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <span>View All Details</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {project.scenes.map((scene) => (
            <div
              key={scene.sceneNumber}
              onClick={() => setActiveTab('storyboard')}
              className="p-4 rounded-2xl bg-zinc-950/70 border border-zinc-800 hover:border-amber-500/30 transition-all cursor-pointer group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 font-mono">
                  Scene {scene.sceneNumber}
                </span>
                <span className="text-[10px] text-zinc-400">{scene.duration}</span>
              </div>
              <h4 className="text-sm font-bold text-zinc-200 group-hover:text-amber-300 transition-colors line-clamp-1 mb-1">
                {scene.title}
              </h4>
              <p className="text-[11px] text-zinc-400 line-clamp-2 mb-2">
                {scene.environment}
              </p>
              <div className="text-[10px] font-mono text-zinc-400 truncate">
                📹 {scene.cameraDirection.shotType}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
