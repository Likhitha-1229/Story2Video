import React from 'react';
import {
  Film,
  Sparkles,
  BookOpen,
  Users,
  Clapperboard,
  Video,
  Volume2,
  FolderOpen,
  Share2,
  Wand2,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';
import { StoryProject } from '../types/story';

export type ActiveTab =
  | 'dashboard'
  | 'story'
  | 'characters'
  | 'storyboard'
  | 'studio'
  | 'prompts'
  | 'audio'
  | 'director'
  | 'projects'
  | 'export';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  currentProject: StoryProject | null;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  currentProject,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: Sparkles, badge: null },
    { id: 'story' as ActiveTab, label: 'Story Input', icon: BookOpen, badge: null },
    {
      id: 'characters' as ActiveTab,
      label: 'Character Bible',
      icon: Users,
      badge: currentProject ? `${currentProject.characters.length}` : null,
    },
    {
      id: 'storyboard' as ActiveTab,
      label: 'Storyboard',
      icon: Clapperboard,
      badge: currentProject ? `${currentProject.scenes.length}` : null,
    },
    { id: 'studio' as ActiveTab, label: 'Video Studio', icon: Film, badge: 'Veo' },
    { id: 'prompts' as ActiveTab, label: 'Video Prompts', icon: Video, badge: 'Flow' },
    { id: 'audio' as ActiveTab, label: 'Audio & Music', icon: Volume2, badge: null },
    { id: 'director' as ActiveTab, label: 'Story Director AI', icon: Wand2, badge: 'AI' },
    { id: 'projects' as ActiveTab, label: 'Projects', icon: FolderOpen, badge: null },
    { id: 'export' as ActiveTab, label: 'Export & Share', icon: Share2, badge: null },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-zinc-950/95 border-r border-zinc-800/80 backdrop-blur-xl flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-5 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <Film className="w-5 h-5 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg text-zinc-100 tracking-tight">Story2Video</span>
                <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-500/20 text-amber-400 rounded-md border border-amber-500/30">
                  AI
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-mono">Production Engine</p>
            </div>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 rounded-lg hover:bg-zinc-800 text-zinc-400 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Project Banner */}
        {currentProject && (
          <div className="px-4 py-3 mx-4 my-3 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900/60 border border-zinc-800">
            <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
              <span className="uppercase tracking-wider font-semibold text-amber-400/90">Current Project</span>
              <span className="font-mono">{currentProject.scenes.length} Scenes</span>
            </div>
            <div className="text-sm font-semibold text-zinc-200 truncate" title={currentProject.title}>
              {currentProject.title}
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-zinc-400">
              <span className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-medium">
                {currentProject.style.length > 15 ? `${currentProject.style.slice(0, 15)}...` : currentProject.style}
              </span>
              <span>•</span>
              <span>{currentProject.orientation}</span>
            </div>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-sm shadow-amber-500/5'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-zinc-400 group-hover:text-zinc-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-amber-400" />}
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer info / Tool Integrations */}
        <div className="p-4 border-t border-zinc-800/80 text-xs text-zinc-400">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-zinc-300">Ready for AI Generators</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <div className="flex flex-wrap gap-1">
            {['Google Flow', 'Veo', 'Sora', 'Runway Gen-3', 'Luma'].map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-900 border border-zinc-800 text-zinc-400"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
};
