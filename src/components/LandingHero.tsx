import React from 'react';
import { Film, Sparkles, Video, Users, Clapperboard, Play, ArrowRight, Layers, Wand2 } from 'lucide-react';

interface LandingHeroProps {
  onCreateClick: () => void;
  onLoadDemoClick: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onCreateClick, onLoadDemoClick }) => {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-zinc-800/80 bg-gradient-to-b from-zinc-900/90 via-zinc-950 to-zinc-950 p-8 md:p-12 mb-8 shadow-2xl">
      {/* Background cinematic lighting effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b from-amber-500/15 via-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-80 h-80 rounded-full bg-indigo-600/10 blur-3xl pointer-events-none" />

      {/* Decorative film reel perforation border */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-amber-500/30 via-yellow-400/50 to-amber-500/30 opacity-70" />

      <div className="relative z-10 max-w-4xl mx-auto text-center">
        {/* Top Eyebrow Tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 animate-spin" />
          <span>Next-Gen AI Filmmaking & Production Architecture</span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6 leading-[1.1]">
          Turn Your Story <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 bg-clip-text text-transparent">
            Into a Video
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-zinc-300 max-w-2xl mx-auto mb-8 font-normal leading-relaxed">
          Transform your imagination into scenes, characters, dialogue, and AI-ready video prompts.
        </p>

        {/* Actions */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
          <button
            onClick={onCreateClick}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-xl font-bold text-base text-zinc-950 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Video className="w-5 h-5 text-zinc-950 transition-transform group-hover:scale-110" />
            <span>Create My Video</span>
            <ArrowRight className="w-4 h-4 text-zinc-950 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onLoadDemoClick}
            className="inline-flex items-center gap-2.5 px-6 py-4 rounded-xl font-semibold text-base text-zinc-200 bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-700/80 hover:border-zinc-600 shadow-lg transition-all duration-300 transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span>Load Demo: Exam Panic</span>
          </button>
        </div>

        {/* Cinematic Pipeline Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center mb-2 text-amber-400">
              <Users className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-zinc-200">Character Bible</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Strict appearance & outfit consistency across all scenes</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-2 text-indigo-400">
              <Clapperboard className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-zinc-200">Scene Cinematography</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Camera angles, shot distances, and camera movements</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center mb-2 text-emerald-400">
              <Layers className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-zinc-200">Multilingual Dialogue</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">English, Telugu, Hindi, Tamil, Kannada, Malayalam</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-zinc-900/70 border border-zinc-800/80 backdrop-blur-md">
            <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center mb-2 text-rose-400">
              <Wand2 className="w-4 h-4" />
            </div>
            <div className="text-xs font-bold text-zinc-200">Ready for Google Flow</div>
            <div className="text-[11px] text-zinc-400 mt-0.5">Veo, Sora, and Runway-optimized prompts with 1-click copy</div>
          </div>
        </div>
      </div>
    </div>
  );
};
