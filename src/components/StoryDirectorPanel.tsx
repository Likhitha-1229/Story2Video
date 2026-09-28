import React, { useState } from 'react';
import {
  Wand2,
  Send,
  Sparkles,
  Bot,
  User,
  Loader2,
  Lightbulb,
  CheckCircle2,
  Film,
  Zap,
} from 'lucide-react';
import { StoryProject, DirectorMessage } from '../types/story';

interface StoryDirectorPanelProps {
  project: StoryProject;
  onApplyDirectorChanges: (instruction: string) => Promise<string>;
  isProcessing: boolean;
}

export const StoryDirectorPanel: React.FC<StoryDirectorPanelProps> = ({
  project,
  onApplyDirectorChanges,
  isProcessing,
}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<DirectorMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: `Hello! I'm your Story Director AI. I can refine your scenes, adjust camera cinematic angles, make dialogue funnier or punchier, translate into Telugu or other languages, or add suspense—all while strictly maintaining your Character Consistency Bible. What would you like to direct?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const presetInstructions = [
    'Make this story funnier and more comedic.',
    'Add more suspense and dramatic tension.',
    'Make the dialogue punchier and shorter.',
    'Make the video suitable for YouTube Shorts (9:16 vertical pacing).',
    'Convert the dialogue to natural Telugu script.',
    'Make the camera movements more cinematic and dynamic.',
    'Change the ending with an unexpected comic twist.',
    'Add another scene between Scene 2 and Scene 3.',
  ];

  const handleSend = async (instructionText: string) => {
    const textToSend = instructionText.trim();
    if (!textToSend || isProcessing) return;

    const userMsg: DirectorMessage = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    try {
      const directorNotes = await onApplyDirectorChanges(textToSend);

      const assistantMsg: DirectorMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: directorNotes,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appliedChanges: ['Story updated with preserved character consistency'],
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      const errorMsg: DirectorMessage = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'assistant',
        text: `Director Note: Could not apply changes (${err.message || 'Request failed'}). Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    }
  };

  return (
    <div className="card-glass rounded-3xl border border-zinc-800 flex flex-col h-[750px] shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-zinc-800 bg-zinc-900/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-amber-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-white tracking-tight">Story Director AI</h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Active
              </span>
            </div>
            <p className="text-xs text-zinc-400">
              Interactive script editor • Character Bible consistency locked
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Film className="w-3.5 h-3.5 text-amber-400" />
          <span>Project: {project.title}</span>
        </div>
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-5 py-3 border-b border-zinc-800/80 bg-zinc-950/40">
        <div className="flex items-center gap-1.5 text-xs font-medium text-zinc-400 mb-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span>Directorial Quick Actions:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {presetInstructions.map((preset, idx) => (
            <button
              key={idx}
              type="button"
              disabled={isProcessing}
              onClick={() => handleSend(preset)}
              className="text-xs px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-amber-300 border border-zinc-800 whitespace-nowrap transition-all shrink-0 disabled:opacity-50"
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                  isUser
                    ? 'bg-amber-500 text-zinc-950'
                    : 'bg-zinc-900 border border-amber-500/30 text-amber-400'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div>
                <div
                  className={`p-4 rounded-2xl text-xs md:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500/20 text-amber-100 border border-amber-500/30 rounded-tr-none'
                      : 'bg-zinc-900/90 text-zinc-200 border border-zinc-800 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {msg.appliedChanges && (
                    <div className="mt-3 pt-2.5 border-t border-zinc-800/80 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{msg.appliedChanges.join(' • ')}</span>
                    </div>
                  )}
                </div>
                <div
                  className={`text-[10px] text-zinc-400 mt-1 font-mono ${
                    isUser ? 'text-right' : 'text-left'
                  }`}
                >
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isProcessing && (
          <div className="flex gap-3 max-w-lg">
            <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="p-4 rounded-2xl bg-zinc-900/90 border border-zinc-800 text-xs text-amber-300 flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
              <span>Directing and updating scene package...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/80">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isProcessing}
            placeholder='Give instructions e.g., "Make Scene 2 more suspenseful", "Translate dialogue to Telugu"...'
            className="flex-1 px-4 py-3 rounded-2xl bg-zinc-950 border border-zinc-800 text-sm text-zinc-100 placeholder-zinc-400 focus:border-amber-500/80 focus:ring-1 focus:ring-amber-500/30 outline-none"
          />
          <button
            type="submit"
            disabled={isProcessing || !input.trim()}
            className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold transition-all disabled:opacity-50 shadow-md shadow-amber-500/20"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
};
