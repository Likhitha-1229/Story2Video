import React, { useState } from 'react';
import {
  FolderOpen,
  Plus,
  Copy,
  Trash2,
  Check,
  Calendar,
  Layers,
  X,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { StoryProject } from '../types/story';
import { DEMO_PROJECT } from '../data/demoProject';

interface ProjectManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: StoryProject[];
  currentProjectId: string;
  onSelectProject: (project: StoryProject) => void;
  onStartNewProject: () => void;
  onDuplicateProject: (project: StoryProject) => void;
  onDeleteProject: (projectId: string) => void;
  onResetToDemo: () => void;
}

export const ProjectManagerModal: React.FC<ProjectManagerModalProps> = ({
  isOpen,
  onClose,
  projects,
  currentProjectId,
  onSelectProject,
  onStartNewProject,
  onDuplicateProject,
  onDeleteProject,
  onResetToDemo,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filtered = projects.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.genre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.style.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <FolderOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Project Management</h3>
              <p className="text-xs text-zinc-400">
                Saved in your browser local storage ({projects.length} project{projects.length === 1 ? '' : 's'})
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

        {/* Toolbar */}
        <div className="px-6 py-3 border-b border-zinc-800/80 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search projects by title, genre, style..."
            className="px-3.5 py-1.5 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 placeholder-zinc-400 outline-none w-64 focus:border-amber-500"
          />

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onResetToDemo();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-medium transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Load Demo Exam Story</span>
            </button>

            <button
              onClick={() => {
                onStartNewProject();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-zinc-950 font-bold text-xs hover:bg-amber-400 transition-all shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Start New Project</span>
            </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {filtered.length === 0 ? (
            <div className="text-center py-12 text-zinc-400">
              <FolderOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-amber-400" />
              <p className="text-sm font-semibold">No matching projects found</p>
              <p className="text-xs text-zinc-400 mt-1">Start a new project or reset to the demo.</p>
            </div>
          ) : (
            filtered.map((proj) => {
              const isCurrent = proj.id === currentProjectId;
              return (
                <div
                  key={proj.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-amber-500/10 border-amber-500/40'
                      : 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="text-sm font-bold text-white tracking-tight truncate max-w-sm">
                        {proj.title}
                      </h4>
                      {isCurrent && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          Active
                        </span>
                      )}
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-zinc-800 text-zinc-300">
                        {proj.genre}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-1 mb-1">
                      {proj.summary}
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-zinc-400 flex-wrap">
                      <span>{proj.scenes.length} Scenes</span>
                      <span>•</span>
                      <span>{proj.characters.length} Characters</span>
                      <span>•</span>
                      <span>{proj.style}</span>
                      <span>•</span>
                      <span>{proj.orientation}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    {!isCurrent && (
                      <button
                        onClick={() => {
                          onSelectProject(proj);
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition-colors flex items-center gap-1"
                      >
                        <span>Open</span>
                        <ArrowRight className="w-3 h-3 text-amber-400" />
                      </button>
                    )}

                    <button
                      title="Duplicate Project"
                      onClick={() => onDuplicateProject(proj)}
                      className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>

                    {projects.length > 1 && (
                      <button
                        title="Delete Project"
                        onClick={() => onDeleteProject(proj.id)}
                        className="p-2 rounded-xl bg-zinc-800 hover:bg-rose-900/40 text-zinc-400 hover:text-rose-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
