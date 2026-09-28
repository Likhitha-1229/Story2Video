import React, { useState } from 'react';
import {
  X,
  Copy,
  Download,
  Share2,
  FileText,
  Video,
  Clapperboard,
  Check,
  Code,
  Sparkles,
} from 'lucide-react';
import { StoryProject } from '../types/story';

interface ExportModalProps {
  project: StoryProject;
  isOpen: boolean;
  onClose: () => void;
  onCopyText: (text: string, label: string) => void;
  copiedId: string | null;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  project,
  isOpen,
  onClose,
  onCopyText,
  copiedId,
}) => {
  const [activeTab, setActiveTab] = useState<'script' | 'prompts' | 'storyboard' | 'json'>('script');

  if (!isOpen) return null;

  // 1. Screenplay / Production Script Format
  const generateScriptText = (): string => {
    let out = `=========================================================================\n`;
    out += `TITLE: ${project.title.toUpperCase()}\n`;
    out += `GENRE: ${project.genre} | STYLE: ${project.style} | ORIENTATION: ${project.orientation}\n`;
    out += `LANGUAGE: ${project.language} | TARGET DURATION: ${project.targetDuration}\n`;
    out += `=========================================================================\n\n`;

    out += `SYNOPSIS:\n${project.summary}\n\n`;

    out += `--- CHARACTER BIBLE (CONSISTENCY PROFILES) ---\n`;
    project.characters.forEach((c) => {
      out += `\n[${c.name.toUpperCase()}] (${c.ageRange}, ${c.gender}) - ${c.role}\n`;
      out += `Appearance: ${c.appearance}\n`;
      out += `Hairstyle: ${c.hairstyle}\n`;
      out += `Fixed Outfit: ${c.clothing}\n`;
      out += `Personality: ${c.personality}\n`;
      out += `Visual Consistency Prompt: ${c.consistencyProfile}\n`;
    });

    out += `\n\n--- SCENE-BY-SCENE PRODUCTION SCREENPLAY ---\n\n`;

    project.scenes.forEach((s) => {
      out += `SCENE ${s.sceneNumber}: ${s.title.toUpperCase()} - ${s.location.toUpperCase()} - ${s.timeOfDay.toUpperCase()} (${s.duration})\n`;
      out += `Characters: ${s.charactersPresent.join(', ')}\n`;
      out += `Camera: ${s.cameraDirection.shotType} | ${s.cameraDirection.angle} | ${s.cameraDirection.movement}\n`;
      out += `Camera Note: ${s.cameraDirection.summary}\n`;
      out += `Environment: ${s.environment}\n\n`;

      out += `ACTIONS & EXPRESSIONS:\n`;
      s.characterActions.forEach((act) => {
        const exp = s.facialExpressions.find((e) => e.character === act.character);
        out += `- ${act.character}: ${act.action} [Expression: ${exp?.expression || 'Neutral'}]\n`;
      });

      out += `\nDIALOGUE (${project.language}):\n`;
      if (s.dialogues.length > 0) {
        s.dialogues.forEach((dlg) => {
          out += `    ${dlg.speaker.toUpperCase()}\n        "${dlg.line}"\n`;
        });
      } else {
        out += `    (NO SPOKEN DIALOGUE)\n`;
      }

      out += `\nAUDIO & SCORE:\n`;
      out += `- Sound FX: ${s.soundEffects.join(', ')}\n`;
      out += `- Music: ${s.backgroundMusic.mood} (${s.backgroundMusic.tempo}, ${s.backgroundMusic.instrumentation})\n\n`;

      out += `-------------------------------------------------------------------------\n\n`;
    });

    return out;
  };

  // 2. Video Prompts Format for Google Flow / Veo
  const generatePromptsText = (): string => {
    let out = `// AI VIDEO GENERATION PROMPTS FOR: ${project.title.toUpperCase()}\n`;
    out += `// Visual Style: ${project.style} | Orientation: ${project.orientation}\n`;
    out += `// Paste directly into Google Flow, Veo, Sora, or Runway Gen-3\n\n`;

    project.scenes.forEach((s) => {
      out += `// =========================================================================\n`;
      out += `// SCENE ${s.sceneNumber}: ${s.title} (${s.duration})\n`;
      out += `// Characters: ${s.charactersPresent.join(', ')}\n`;
      out += `// =========================================================================\n\n`;
      out += `[TEXT-TO-VIDEO PROMPT]\n${s.videoPrompt}\n\n`;
      out += `[REFERENCE IMAGE PROMPT]\n${s.imagePrompt}\n\n\n`;
    });

    return out;
  };

  // 3. Markdown Storyboard Format
  const generateMarkdownStoryboard = (): string => {
    let md = `# ${project.title}\n\n`;
    md += `**Genre:** ${project.genre} | **Style:** ${project.style} | **Format:** ${project.orientation} | **Language:** ${project.language}\n\n`;
    md += `## Synopsis\n${project.summary}\n\n`;

    md += `## Character Bible\n\n`;
    project.characters.forEach((c) => {
      md += `### ${c.name} (${c.role})\n`;
      md += `- **Age & Gender:** ${c.ageRange}, ${c.gender}\n`;
      md += `- **Outfit:** ${c.clothing}\n`;
      md += `- **Hairstyle:** ${c.hairstyle}\n`;
      md += `- **Consistency Description:** \`${c.consistencyProfile}\`\n\n`;
    });

    md += `## Storyboard\n\n`;
    project.scenes.forEach((s) => {
      md += `### Scene ${s.sceneNumber}: ${s.title} (${s.duration})\n`;
      md += `* **Location:** ${s.location} (${s.timeOfDay})\n`;
      md += `* **Camera:** ${s.cameraDirection.shotType}, ${s.cameraDirection.angle}, ${s.cameraDirection.movement}\n`;
      md += `* **Environment:** ${s.environment}\n\n`;

      md += `#### Dialogues\n`;
      s.dialogues.forEach((d) => {
        md += `> **${d.speaker}:** "${d.line}"\n`;
      });
      md += `\n`;

      md += `#### AI Video Prompt\n\`\`\`\n${s.videoPrompt}\n\`\`\`\n\n`;
      md += `#### Reference Image Prompt\n\`\`\`\n${s.imagePrompt}\n\`\`\`\n\n`;
      md += `---\n\n`;
    });

    return md;
  };

  const getActiveContent = (): string => {
    if (activeTab === 'script') return generateScriptText();
    if (activeTab === 'prompts') return generatePromptsText();
    if (activeTab === 'storyboard') return generateMarkdownStoryboard();
    return JSON.stringify(project, null, 2);
  };

  const handleDownload = (filename: string, text: string) => {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShareProject = () => {
    const jsonStr = JSON.stringify(project);
    navigator.clipboard.writeText(jsonStr);
    onCopyText(jsonStr, 'Project JSON Data');
  };

  const currentContent = getActiveContent();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Export Production Package</h3>
              <p className="text-xs text-zinc-400">
                Download screenplay, AI video prompts, or markdown storyboard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher & Quick Buttons */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveTab('script')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'script'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Screenplay Script</span>
            </button>
            <button
              onClick={() => setActiveTab('prompts')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'prompts'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Video Prompts</span>
            </button>
            <button
              onClick={() => setActiveTab('storyboard')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'storyboard'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Clapperboard className="w-3.5 h-3.5" />
              <span>Storyboard (.md)</span>
            </button>
            <button
              onClick={() => setActiveTab('json')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === 'json'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>JSON Raw</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCopyText(currentContent, `${activeTab} export`)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 text-xs font-semibold transition-all"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Current</span>
            </button>

            <button
              onClick={() => {
                const ext = activeTab === 'storyboard' ? 'md' : activeTab === 'json' ? 'json' : 'txt';
                handleDownload(`${project.title.toLowerCase().replace(/\s+/g, '_')}_${activeTab}.${ext}`, currentContent);
              }}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-md shadow-amber-500/20"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download File</span>
            </button>
          </div>
        </div>

        {/* Text Preview Area */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-950/70">
          <pre className="font-mono text-xs text-zinc-300 whitespace-pre-wrap leading-relaxed bg-zinc-900/60 p-4 rounded-2xl border border-zinc-800/80">
            {currentContent}
          </pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-zinc-400 font-mono">
            {project.scenes.length} Scenes • {project.characters.length} Characters • {project.orientation}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleShareProject}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Copy Shareable JSON</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-bold text-zinc-900 bg-amber-400 hover:bg-amber-300 transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
