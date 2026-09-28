import React, { useState } from 'react';
import { Sparkles, Wand2, Lightbulb, Clapperboard, HelpCircle } from 'lucide-react';
import { StoryGenerationInput } from '../types/story';

interface StoryInputFormProps {
  onGenerate: (input: StoryGenerationInput) => void;
  isLoading: boolean;
  initialValues?: Partial<StoryGenerationInput>;
}

export const StoryInputForm: React.FC<StoryInputFormProps> = ({
  onGenerate,
  isLoading,
  initialValues,
}) => {
  const [storyIdea, setStoryIdea] = useState(
    initialValues?.storyIdea ||
      'Four college friends forget that they have an exam tomorrow and realize it at the last moment.'
  );
  const [genre, setGenre] = useState(initialValues?.genre || 'Comedy');
  const [style, setStyle] = useState(initialValues?.style || 'Pixar-like 3D animation');
  const [orientation, setOrientation] = useState(initialValues?.orientation || '16:9 Landscape');
  const [targetDuration, setTargetDuration] = useState(initialValues?.targetDuration || '1 minute');
  const [customDuration, setCustomDuration] = useState('45 seconds');
  const [language, setLanguage] = useState(initialValues?.language || 'English');
  const [characterCount, setCharacterCount] = useState<number>(initialValues?.characterCount || 4);
  const [additionalInstructions, setAdditionalInstructions] = useState(
    initialValues?.additionalInstructions || 'Keep the same characters throughout all scenes.'
  );

  const genres = [
    'Comedy',
    'Romance',
    'Thriller',
    'Horror',
    'Action',
    'Drama',
    'Fantasy',
    'Sci-Fi',
    'Mystery',
    'Educational',
    'Slice of Life',
  ];

  const styles = [
    'Pixar-like 3D animation',
    'Cinematic',
    '3D Cartoon',
    'Realistic',
    'Anime',
    'Comic',
    'Documentary',
    'Clay Animation',
  ];

  const orientations = [
    { label: '16:9 Landscape', desc: 'YouTube, Web, TV', icon: '🖥' },
    { label: '9:16 Vertical', desc: 'TikTok, Shorts, Reels', icon: '📱' },
    { label: '1:1 Square', desc: 'Instagram, Feeds', icon: '⏹' },
  ];

  const durations = ['30 seconds', '1 minute', '2 minutes', '3 minutes', '5 minutes', 'Custom'];

  const languages = ['English', 'Telugu', 'Hindi', 'Tamil', 'Kannada', 'Malayalam'];

  const sampleIdeas = [
    {
      title: 'College Exam Panic',
      idea: 'Four college friends forget that they have an exam tomorrow and realize it at the last moment.',
      genre: 'Comedy',
      style: 'Pixar-like 3D animation',
      chars: 4,
    },
    {
      title: 'Neon Detective Noir',
      idea: 'A cybernetic private detective inspects a missing holographic memory chip inside a rain-soaked noodle bar.',
      genre: 'Sci-Fi',
      style: 'Cinematic',
      chars: 2,
    },
    {
      title: 'Grandma’s Secret Recipe',
      idea: 'A stubborn granddaughter attempts to replicate her grandmother’s traditional sweet recipe, only to trigger hilarious kitchen disasters.',
      genre: 'Drama',
      style: '3D Cartoon',
      chars: 2,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storyIdea.trim()) return;

    onGenerate({
      storyIdea: storyIdea.trim(),
      genre,
      style,
      orientation,
      targetDuration: targetDuration === 'Custom' ? customDuration : targetDuration,
      language,
      characterCount,
      additionalInstructions: additionalInstructions.trim(),
    });
  };

  return (
    <div className="card-glass rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-xl max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Clapperboard className="w-4 h-4" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white tracking-tight">
              Story & Production Brief
            </h2>
          </div>
          <p className="text-sm text-zinc-400 mt-1">
            Provide your story concept. The AI will engineer a complete scene-by-scene cinematic package.
          </p>
        </div>

        {/* Quick Demo Idea Pills */}
        <div className="hidden sm:flex items-center gap-2">
          <span className="text-xs font-medium text-zinc-400 flex items-center gap-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" /> Presets:
          </span>
          {sampleIdeas.map((preset) => (
            <button
              key={preset.title}
              type="button"
              onClick={() => {
                setStoryIdea(preset.idea);
                setGenre(preset.genre);
                setStyle(preset.style);
                setCharacterCount(preset.chars);
              }}
              className="text-xs px-2.5 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 transition-colors"
            >
              {preset.title}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Story Idea Large Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold text-zinc-200 flex items-center gap-1.5">
              <span>Story Idea</span>
              <span className="text-amber-400">*</span>
            </label>
            <span className="text-xs text-zinc-400">Enter a situation, synopsis, or raw script outline</span>
          </div>
          <textarea
            rows={4}
            value={storyIdea}
            onChange={(e) => setStoryIdea(e.target.value)}
            placeholder="Describe your story, characters, situation, or idea..."
            className="w-full px-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/20 text-zinc-100 placeholder-zinc-400 text-base resize-y transition-all outline-none"
            required
          />
        </div>

        {/* Primary Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Genre */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Genre
            </label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 outline-none"
            >
              {genres.map((g) => (
                <option key={g} value={g} className="bg-zinc-900 text-zinc-200">
                  {g}
                </option>
              ))}
            </select>
          </div>

          {/* Video Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Video Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 outline-none"
            >
              {styles.map((s) => (
                <option key={s} value={s} className="bg-zinc-900 text-zinc-200">
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Language Selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Spoken Dialogue Language
              </label>
              {language === 'Telugu' && (
                <span className="text-[11px] font-medium text-amber-400">తెలుగు స్క్రిప్ట్ ఆన్ చేయబడింది</span>
              )}
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-sm focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/40 outline-none"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang} className="bg-zinc-900 text-zinc-200">
                  {lang}
                </option>
              ))}
            </select>
          </div>

          {/* Number of Characters */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Number of Main Characters
              </label>
              <span className="text-xs font-mono text-amber-400">{characterCount} character(s)</span>
            </div>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setCharacterCount(num)}
                  className={`flex-1 py-2 text-sm font-semibold rounded-xl border transition-all ${
                    characterCount === num
                      ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                      : 'bg-zinc-900 text-zinc-400 border-zinc-800 hover:text-zinc-200 hover:bg-zinc-800'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Video Orientation Selector */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Video Orientation
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {orientations.map((item) => {
              const isSelected = orientation === item.label;
              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setOrientation(item.label)}
                  className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    isSelected
                      ? 'bg-amber-500/10 border-amber-500/50 text-zinc-100 shadow-sm shadow-amber-500/10'
                      : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200'
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <div>
                    <div className={`text-sm font-semibold ${isSelected ? 'text-amber-400' : 'text-zinc-200'}`}>
                      {item.label}
                    </div>
                    <div className="text-[11px] text-zinc-400">{item.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Target Duration */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
            Target Duration
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {durations.map((dur) => (
              <button
                key={dur}
                type="button"
                onClick={() => setTargetDuration(dur)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  targetDuration === dur
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                }`}
              >
                {dur}
              </button>
            ))}
          </div>
          {targetDuration === 'Custom' && (
            <input
              type="text"
              value={customDuration}
              onChange={(e) => setCustomDuration(e.target.value)}
              placeholder="e.g. 45 seconds or 90 seconds"
              className="mt-2 w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500 outline-none"
            />
          )}
        </div>

        {/* Additional Instructions */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Additional Directives & Constraints
            </label>
            <span className="text-xs text-zinc-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-zinc-400" /> Optional
            </span>
          </div>
          <input
            type="text"
            value={additionalInstructions}
            onChange={(e) => setAdditionalInstructions(e.target.value)}
            placeholder="e.g. Keep the same characters throughout all scenes; emphasize comic timing..."
            className="w-full px-4 py-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-400 focus:border-amber-500/80 outline-none"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !storyIdea.trim()}
            className="w-full relative group flex items-center justify-center gap-3 px-6 py-4 rounded-2xl font-bold text-base text-zinc-950 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30 transition-all duration-300"
          >
            {isLoading ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin text-zinc-950" />
                <span>Crafting Production Package with Gemini AI...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-5 h-5 text-zinc-950 transition-transform group-hover:rotate-12" />
                <span>Generate Story & Production Plan</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
