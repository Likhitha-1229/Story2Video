import React, { useState, useEffect } from 'react';
import {
  Menu,
  Sparkles,
  Share2,
  FolderOpen,
  Plus,
  RefreshCw,
  AlertTriangle,
  Film,
  RotateCcw,
} from 'lucide-react';
import { StoryProject, Scene, StoryGenerationInput } from './types/story';
import { DEMO_PROJECT } from './data/demoProject';
import {
  getSavedProjects,
  saveProjects,
  getCurrentProject,
  saveCurrentProject,
  deleteProject,
  duplicateProject,
} from './services/storage';
import {
  generateStoryWithAI,
  regenerateSceneWithAI,
  askStoryDirectorAI,
} from './services/api';

import { Sidebar, ActiveTab } from './components/Sidebar';
import { LandingHero } from './components/LandingHero';
import { StoryInputForm } from './components/StoryInputForm';
import { GenerationProgress } from './components/GenerationProgress';
import { CharacterBible } from './components/CharacterBible';
import { StoryboardView } from './components/StoryboardView';
import { VideoPromptsView } from './components/VideoPromptsView';
import { AudioView } from './components/AudioView';
import { StoryDirectorPanel } from './components/StoryDirectorPanel';
import { SceneEditorModal } from './components/SceneEditorModal';
import { ExportModal } from './components/ExportModal';
import { ProjectManagerModal } from './components/ProjectManagerModal';
import { DashboardOverview } from './components/DashboardOverview';
import { VideoStudio } from './components/VideoStudio';
import { ToastContainer, ToastMessage } from './components/Toast';

export default function App() {
  const [projects, setProjects] = useState<StoryProject[]>([]);
  const [currentProject, setCurrentProject] = useState<StoryProject>(DEMO_PROJECT);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [showHero, setShowHero] = useState<boolean>(true);

  // Generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<StoryGenerationInput | null>(null);

  // Scene editing modal state
  const [editingScene, setEditingScene] = useState<Scene | null>(null);
  const [isRegeneratingScene, setIsRegeneratingScene] = useState<boolean>(false);

  // Story Director state
  const [isDirectorProcessing, setIsDirectorProcessing] = useState<boolean>(false);

  // Modals
  const [isExportOpen, setIsExportOpen] = useState<boolean>(false);
  const [isProjectManagerOpen, setIsProjectManagerOpen] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    const loadedProjects = getSavedProjects();
    setProjects(loadedProjects);

    const loadedCurrent = getCurrentProject();
    if (loadedCurrent) {
      setCurrentProject(loadedCurrent);
    }
  }, []);

  const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    addToast(`Copied ${label} to clipboard!`, 'success');
  };

  // Generate Story
  const handleGenerateStory = async (input: StoryGenerationInput) => {
    setIsGenerating(true);
    setGenerationError(null);
    setLastInput(input);

    try {
      const generated = await generateStoryWithAI(input);
      setCurrentProject(generated);
      saveCurrentProject(generated);
      setProjects(getSavedProjects());
      setActiveTab('storyboard');
      setShowHero(false);
      addToast('Story and video production plan generated successfully!', 'success');
    } catch (err: any) {
      console.error('Generation error:', err);
      setGenerationError(err.message || 'Failed to generate story with Gemini AI.');
      addToast('Generation error. Your inputs are saved. Try again.', 'error');
    } finally {
      setIsGenerating(false);
    }
  };

  // Retry generation with saved inputs
  const handleRetryGeneration = () => {
    if (lastInput) {
      handleGenerateStory(lastInput);
    }
  };

  // Save Scene Edits
  const handleSaveScene = (updatedScene: Scene) => {
    const updatedScenes = currentProject.scenes.map((s) =>
      s.sceneNumber === updatedScene.sceneNumber ? updatedScene : s
    );
    const updatedProject = {
      ...currentProject,
      scenes: updatedScenes,
      updatedAt: new Date().toISOString(),
    };
    setCurrentProject(updatedProject);
    saveCurrentProject(updatedProject);
    setProjects(getSavedProjects());
    setEditingScene(null);
    addToast(`Scene ${updatedScene.sceneNumber} saved!`, 'success');
  };

  // Regenerate Scene Prompt
  const handleRegenerateScenePrompt = async (modifiedScene: Scene) => {
    setIsRegeneratingScene(true);
    try {
      const regenerated = await regenerateSceneWithAI(
        currentProject,
        modifiedScene.sceneNumber,
        modifiedScene
      );
      handleSaveScene(regenerated);
      addToast(`Scene ${modifiedScene.sceneNumber} prompts regenerated!`, 'success');
    } catch (err: any) {
      console.error('Regenerate scene error:', err);
      addToast(err.message || 'Failed to regenerate scene prompts', 'error');
    } finally {
      setIsRegeneratingScene(false);
    }
  };

  // Story Director Action
  const handleApplyDirectorChanges = async (instruction: string): Promise<string> => {
    setIsDirectorProcessing(true);
    try {
      const result = await askStoryDirectorAI(currentProject, instruction);
      setCurrentProject(result.updatedProject);
      saveCurrentProject(result.updatedProject);
      setProjects(getSavedProjects());
      addToast('Director modifications applied!', 'success');
      return result.directorNotes;
    } catch (err: any) {
      console.error('Director error:', err);
      addToast(err.message || 'Failed to apply directorial changes', 'error');
      throw err;
    } finally {
      setIsDirectorProcessing(false);
    }
  };

  // Project management handlers
  const handleSelectProject = (project: StoryProject) => {
    setCurrentProject(project);
    saveCurrentProject(project);
    setShowHero(false);
    addToast(`Opened project: ${project.title}`, 'info');
  };

  const handleStartNewProject = () => {
    setActiveTab('story');
    setShowHero(false);
    addToast('Ready to create your new story', 'info');
  };

  const handleDuplicateProject = (project: StoryProject) => {
    const duplicated = duplicateProject(project);
    setProjects(getSavedProjects());
    setCurrentProject(duplicated);
    addToast(`Duplicated: ${duplicated.title}`, 'success');
  };

  const handleDeleteProject = (projectId: string) => {
    const updated = deleteProject(projectId);
    setProjects(updated);
    if (currentProject.id === projectId) {
      const next = updated[0] || DEMO_PROJECT;
      setCurrentProject(next);
      saveCurrentProject(next);
    }
    addToast('Project deleted', 'info');
  };

  const handleResetToDemo = () => {
    setCurrentProject(DEMO_PROJECT);
    saveCurrentProject(DEMO_PROJECT);
    setShowHero(true);
    setActiveTab('dashboard');
    addToast('Loaded demo project: Exam Panic', 'info');
  };

  const handleUpdateProject = (updated: StoryProject) => {
    setCurrentProject(updated);
    saveCurrentProject(updated);
    setProjects(getSavedProjects());
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col lg:flex-row antialiased selection:bg-amber-500/20 selection:text-amber-300">
      {/* Sidebar for Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'export') {
            setIsExportOpen(true);
          } else if (tab === 'projects') {
            setIsProjectManagerOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        currentProject={currentProject}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Main Content Area */}
      <main className="flex-1 lg:pl-72 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-zinc-950/85 backdrop-blur-xl border-b border-zinc-800/80 px-4 md:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm md:text-base font-bold text-white tracking-tight truncate max-w-xs md:max-w-md">
                  {currentProject.title}
                </h1>
                <span className="hidden sm:inline px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  {currentProject.genre}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 hidden sm:block">
                {currentProject.scenes.length} Scenes • {currentProject.orientation} • {currentProject.style}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsProjectManagerOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 text-xs font-medium transition-all"
            >
              <FolderOpen className="w-3.5 h-3.5 text-zinc-400" />
              <span className="hidden sm:inline">Projects</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('story');
                setShowHero(false);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-amber-400 border border-amber-500/30 text-xs font-semibold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">New Story</span>
            </button>

            <button
              onClick={() => setIsExportOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-400 text-zinc-950 font-bold text-xs hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 transition-all"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>
        </header>

        {/* Viewport Content */}
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">
          {/* Landing Hero Section (Can be viewed on Dashboard or toggled) */}
          {activeTab === 'dashboard' && showHero && (
            <LandingHero
              onCreateClick={() => {
                setActiveTab('story');
                setShowHero(false);
              }}
              onLoadDemoClick={handleResetToDemo}
            />
          )}

          {/* Active Generation Progress Indicator */}
          {isGenerating && <GenerationProgress />}

          {/* Error Banner with Retry */}
          {generationError && !isGenerating && (
            <div className="p-4 mb-6 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
                <div>
                  <h4 className="text-sm font-bold text-white">Story Generation Notice</h4>
                  <p className="text-xs text-rose-300 mt-0.5">{generationError}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={handleRetryGeneration}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500 text-white font-semibold text-xs hover:bg-rose-600 transition-colors shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Generation</span>
                </button>
              </div>
            </div>
          )}

          {/* Tab Views */}
          {!isGenerating && (
            <>
              {activeTab === 'dashboard' && (
                <DashboardOverview
                  project={currentProject}
                  setActiveTab={setActiveTab}
                  onOpenExport={() => setIsExportOpen(true)}
                  onOpenProjects={() => setIsProjectManagerOpen(true)}
                  onCreateNewStory={() => {
                    setActiveTab('story');
                    setShowHero(false);
                  }}
                />
              )}

              {activeTab === 'story' && (
                <StoryInputForm
                  onGenerate={handleGenerateStory}
                  isLoading={isGenerating}
                  initialValues={{
                    storyIdea: currentProject.userStoryIdea,
                    genre: currentProject.genre,
                    style: currentProject.style,
                    orientation: currentProject.orientation,
                    targetDuration: currentProject.targetDuration,
                    language: currentProject.language,
                    characterCount: currentProject.characterCount,
                    additionalInstructions: currentProject.additionalInstructions,
                  }}
                />
              )}

              {activeTab === 'characters' && (
                <CharacterBible
                  characters={currentProject.characters}
                  onCopyText={handleCopyText}
                  copiedId={copiedId}
                />
              )}

              {activeTab === 'storyboard' && (
                <div className="space-y-12">
                  <StoryboardView
                    project={currentProject}
                    onEditScene={(scene) => setEditingScene(scene)}
                    onCopyText={handleCopyText}
                    copiedId={copiedId}
                    onNavigateToStudio={() => setActiveTab('studio')}
                  />

                  {/* Video Studio Section following Storyboard */}
                  <div className="pt-8 border-t border-zinc-800/80">
                    <VideoStudio
                      project={currentProject}
                      onUpdateProject={handleUpdateProject}
                      onCopyText={handleCopyText}
                    />
                  </div>
                </div>
              )}

              {activeTab === 'studio' && (
                <VideoStudio
                  project={currentProject}
                  onUpdateProject={handleUpdateProject}
                  onCopyText={handleCopyText}
                />
              )}

              {activeTab === 'prompts' && (
                <VideoPromptsView
                  project={currentProject}
                  onCopyText={handleCopyText}
                  copiedId={copiedId}
                />
              )}

              {activeTab === 'audio' && (
                <AudioView project={currentProject} onCopyText={handleCopyText} />
              )}

              {activeTab === 'director' && (
                <StoryDirectorPanel
                  project={currentProject}
                  onApplyDirectorChanges={handleApplyDirectorChanges}
                  isProcessing={isDirectorProcessing}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Scene Editor Modal */}
      {editingScene && (
        <SceneEditorModal
          scene={editingScene}
          project={currentProject}
          isOpen={Boolean(editingScene)}
          onClose={() => setEditingScene(null)}
          onSave={handleSaveScene}
          onRegeneratePrompt={handleRegenerateScenePrompt}
          isRegenerating={isRegeneratingScene}
        />
      )}

      {/* Export Modal */}
      <ExportModal
        project={currentProject}
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        onCopyText={handleCopyText}
        copiedId={copiedId}
      />

      {/* Project Management Modal */}
      <ProjectManagerModal
        isOpen={isProjectManagerOpen}
        onClose={() => setIsProjectManagerOpen(false)}
        projects={projects}
        currentProjectId={currentProject.id}
        onSelectProject={handleSelectProject}
        onStartNewProject={handleStartNewProject}
        onDuplicateProject={handleDuplicateProject}
        onDeleteProject={handleDeleteProject}
        onResetToDemo={handleResetToDemo}
      />

      {/* Toasts */}
      <ToastContainer
        toasts={toasts}
        onDismiss={(id) => setToasts((prev) => prev.filter((t) => t.id !== id))}
      />
    </div>
  );
}
