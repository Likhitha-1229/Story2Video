import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Camera,
  MapPin,
  Clock,
  MessageSquare,
  Volume2,
  Film,
  Plus,
  Trash2,
  Loader2,
  Check,
} from 'lucide-react';
import { Scene, StoryProject } from '../types/story';

interface SceneEditorModalProps {
  scene: Scene;
  project: StoryProject;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedScene: Scene) => void;
  onRegeneratePrompt: (scene: Scene) => Promise<void>;
  isRegenerating: boolean;
}

export const SceneEditorModal: React.FC<SceneEditorModalProps> = ({
  scene,
  project,
  isOpen,
  onClose,
  onSave,
  onRegeneratePrompt,
  isRegenerating,
}) => {
  const [title, setTitle] = useState(scene.title);
  const [duration, setDuration] = useState(scene.duration);
  const [location, setLocation] = useState(scene.location);
  const [timeOfDay, setTimeOfDay] = useState(scene.timeOfDay);
  const [environment, setEnvironment] = useState(scene.environment);
  const [cameraAngle, setCameraAngle] = useState(scene.cameraDirection.angle);
  const [cameraMovement, setCameraMovement] = useState(scene.cameraDirection.movement);
  const [cameraShotType, setCameraShotType] = useState(scene.cameraDirection.shotType);
  const [cameraDistance, setCameraDistance] = useState(scene.cameraDirection.distance);

  // Dialogues list
  const [dialogues, setDialogues] = useState([...scene.dialogues]);

  // Actions list
  const [actions, setActions] = useState([...scene.characterActions]);

  // Expressions list
  const [expressions, setExpressions] = useState([...scene.facialExpressions]);

  if (!isOpen) return null;

  const handleAddDialogue = () => {
    const defaultSpeaker = project.characters[0]?.name || 'Speaker';
    setDialogues([...dialogues, { speaker: defaultSpeaker, line: '' }]);
  };

  const handleRemoveDialogue = (index: number) => {
    setDialogues(dialogues.filter((_, idx) => idx !== index));
  };

  const handleDialogueChange = (index: number, field: 'speaker' | 'line', value: string) => {
    const updated = [...dialogues];
    updated[index] = { ...updated[index], [field]: value };
    setDialogues(updated);
  };

  const constructUpdatedScene = (): Scene => {
    return {
      ...scene,
      title,
      duration,
      location,
      timeOfDay,
      environment,
      cameraDirection: {
        ...scene.cameraDirection,
        angle: cameraAngle,
        movement: cameraMovement,
        shotType: cameraShotType,
        distance: cameraDistance,
        summary: `${cameraShotType}, ${cameraAngle}, ${cameraMovement}`,
      },
      dialogues,
      characterActions: actions,
      facialExpressions: expressions,
    };
  };

  const handleSaveOnly = () => {
    onSave(constructUpdatedScene());
    onClose();
  };

  const handleRegenerate = async () => {
    const updated = constructUpdatedScene();
    await onRegeneratePrompt(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-zinc-950 border border-zinc-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center text-sm">
              #{scene.sceneNumber}
            </span>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">Edit Scene Details</h3>
              <p className="text-xs text-zinc-400">Modify actions, dialogues, camera, or regenerate AI prompts</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:bg-zinc-800 text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Scene Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Target Duration
              </label>
              <input
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
                Time of Day & Lighting
              </label>
              <input
                type="text"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          {/* Environment */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Environment & Key Props
            </label>
            <textarea
              rows={2}
              value={environment}
              onChange={(e) => setEnvironment(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-sm text-zinc-100 focus:border-amber-500 outline-none resize-none"
            />
          </div>

          {/* Camera Direction */}
          <div className="p-4 rounded-2xl bg-zinc-900/60 border border-zinc-800/80">
            <div className="flex items-center gap-2 mb-3">
              <Camera className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-200">
                Camera Direction
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Shot Type</span>
                <input
                  type="text"
                  value={cameraShotType}
                  onChange={(e) => setCameraShotType(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Angle</span>
                <input
                  type="text"
                  value={cameraAngle}
                  onChange={(e) => setCameraAngle(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Movement</span>
                <input
                  type="text"
                  value={cameraMovement}
                  onChange={(e) => setCameraMovement(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-zinc-400 block mb-1">Distance</span>
                <input
                  type="text"
                  value={cameraDistance}
                  onChange={(e) => setCameraDistance(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Dialogues */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                <span>Scene Dialogue ({project.language})</span>
              </label>
              <button
                type="button"
                onClick={handleAddDialogue}
                className="text-xs font-semibold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add Line
              </button>
            </div>

            <div className="space-y-2">
              {dialogues.map((dlg, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <select
                    value={dlg.speaker}
                    onChange={(e) => handleDialogueChange(idx, 'speaker', e.target.value)}
                    className="w-36 px-2.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none"
                  >
                    {project.characters.map((c) => (
                      <option key={c.id} value={c.name}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={dlg.line}
                    onChange={(e) => handleDialogueChange(idx, 'line', e.target.value)}
                    placeholder="Dialogue line..."
                    className="flex-1 px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-200 outline-none focus:border-amber-500"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveDialogue(idx)}
                    className="p-2 text-zinc-400 hover:text-rose-400 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {dialogues.length === 0 && (
                <p className="text-xs text-zinc-400 italic">No spoken dialogue in this scene.</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-zinc-900/80 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            Cancel
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={handleSaveOnly}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-200 bg-zinc-800 hover:bg-zinc-700 transition-colors"
            >
              Save Changes
            </button>

            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="px-5 py-2 rounded-xl text-xs font-bold text-zinc-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-md shadow-amber-500/20 disabled:opacity-50 flex items-center gap-2"
            >
              {isRegenerating ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Regenerating Scene Prompts...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Regenerate Scene Prompt</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
