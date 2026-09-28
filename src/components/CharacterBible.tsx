import React from 'react';
import {
  Users,
  Copy,
  Check,
  Sparkles,
  Shirt,
  Scissors,
  Eye,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { Character } from '../types/story';

interface CharacterBibleProps {
  characters: Character[];
  onCopyText: (text: string, label: string) => void;
  copiedId: string | null;
}

export const CharacterBible: React.FC<CharacterBibleProps> = ({
  characters,
  onCopyText,
  copiedId,
}) => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl card-glass border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Character Bible & Consistency Engine
            </h2>
          </div>
          <p className="text-sm text-zinc-400 max-w-2xl">
            Strict appearance definitions ensure your characters look identical across every scene, frame, and prompt in Google Flow, Veo, and Runway.
          </p>
        </div>

        <button
          onClick={() => {
            const allDescriptions = characters
              .map((c) => `[${c.name.toUpperCase()}]\n${c.consistencyProfile}`)
              .join('\n\n');
            onCopyText(allDescriptions, 'All Character Profiles');
          }}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 text-xs font-semibold shadow-sm transition-all"
        >
          <Copy className="w-3.5 h-3.5" />
          <span>Copy All Character Descriptions</span>
        </button>
      </div>

      {/* Character Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {characters.map((char, index) => {
          const isCopied = copiedId === `char-${char.id}`;
          return (
            <div
              key={char.id || index}
              className="card-glass rounded-3xl p-6 border border-zinc-800 hover:border-zinc-700/80 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Header with Avatar & Meta */}
                <div className="flex items-start gap-4 mb-5">
                  {/* Stylized Avatar Placeholder */}
                  <div
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${
                      char.avatarColor || 'from-amber-500 to-yellow-600'
                    } p-0.5 shadow-lg shrink-0`}
                  >
                    <div className="w-full h-full bg-zinc-950 rounded-[14px] flex flex-col items-center justify-center text-zinc-200">
                      <span className="text-xl font-black text-amber-400">
                        {char.name.charAt(0)}
                      </span>
                      <span className="text-[9px] uppercase font-mono text-zinc-400">
                        {char.gender.charAt(0) || 'C'}
                      </span>
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-bold text-white tracking-tight truncate">
                        {char.name}
                      </h3>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">
                        {char.role || 'Main Cast'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                      <span>{char.ageRange}</span>
                      <span>•</span>
                      <span>{char.gender}</span>
                    </div>
                  </div>
                </div>

                {/* Traits Matrix */}
                <div className="space-y-3 text-xs mb-5">
                  {/* Appearance */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <Eye className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-300 block mb-0.5">Physical Appearance:</span>
                      <span className="text-zinc-400 leading-relaxed">{char.appearance}</span>
                    </div>
                  </div>

                  {/* Hairstyle */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <Scissors className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-300 block mb-0.5">Hairstyle:</span>
                      <span className="text-zinc-400 leading-relaxed">{char.hairstyle}</span>
                    </div>
                  </div>

                  {/* Outfit */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <Shirt className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-300 block mb-0.5">Fixed Outfit:</span>
                      <span className="text-zinc-400 leading-relaxed">{char.clothing}</span>
                    </div>
                  </div>

                  {/* Personality */}
                  <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                    <Smile className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-zinc-300 block mb-0.5">Personality:</span>
                      <span className="text-zinc-400 leading-relaxed">{char.personality}</span>
                    </div>
                  </div>
                </div>

                {/* Fixed Visual Consistency Profile */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-amber-400/90 mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Fixed Consistency Description
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono">Prompt Reusable</span>
                  </div>
                  <div className="p-3 rounded-xl bg-zinc-950 border border-zinc-800 font-mono text-[11px] text-zinc-300 leading-relaxed">
                    {char.consistencyProfile}
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={() => onCopyText(char.consistencyProfile, `${char.name}'s Profile`)}
                className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                  isCopied
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border-zinc-800 hover:border-zinc-700'
                }`}
              >
                {isCopied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Copied Character Description!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-zinc-400" />
                    <span>Copy Character Description</span>
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
