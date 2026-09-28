import React, { useState, useEffect, useRef } from 'react';
import {
  Film,
  Play,
  Pause,
  RotateCcw,
  Download,
  Maximize2,
  Volume2,
  VolumeX,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Layers,
  Settings,
  RefreshCw,
  Video,
  Info,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { StoryProject, Scene, VideoSettings } from '../types/story';
import {
  generateSceneVideo,
  pollVideoStatus,
  combineSceneVideos,
  getVideoCapabilities,
} from '../services/api';

interface VideoStudioProps {
  project: StoryProject;
  onUpdateProject: (updated: StoryProject) => void;
  onCopyText: (text: string, label: string) => void;
}

export const VideoStudio: React.FC<VideoStudioProps> = ({
  project,
  onUpdateProject,
  onCopyText,
}) => {
  // Video settings
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16' | '1:1'>('16:9');
  const [videoStyle, setVideoStyle] = useState<string>(project.style || 'Cinematic');
  const [resolution, setResolution] = useState<'720p' | '1080p'>('720p');

  // Video generation state
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [currentGeneratingScene, setCurrentGeneratingScene] = useState<number | null>(null);
  const [activeVideoSource, setActiveVideoSource] = useState<'full' | number>('full');
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isQuotaError, setIsQuotaError] = useState(false);
  const [isCombining, setIsCombining] = useState(false);

  // HTML5 Video Player state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // Available styles
  const styles = [
    'Cinematic',
    'Pixar-like 3D animation',
    '3D Cartoon',
    'Realistic',
    'Anime',
    'Comic',
    'Documentary',
  ];

  // Helper to get active video URL for player
  const getActiveVideoUrl = (): string | null => {
    if (activeVideoSource === 'full') {
      if (project.fullVideoUrl) return project.fullVideoUrl;
      // If full not combined yet, find first completed scene
      const firstCompleted = project.scenes.find((s) => s.video?.videoUrl);
      return firstCompleted?.video?.videoUrl || null;
    }
    const scene = project.scenes.find((s) => s.sceneNumber === activeVideoSource);
    return scene?.video?.videoUrl || null;
  };

  const activeVideoUrl = getActiveVideoUrl();

  // Video player controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      const nextMuted = !isMuted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Generate single scene video
  const handleGenerateScene = async (sceneNumber: number) => {
    setGeneralError(null);
    setIsQuotaError(false);
    setCurrentGeneratingScene(sceneNumber);

    // Update scene status to generating
    const updatedScenes = project.scenes.map((s) => {
      if (s.sceneNumber === sceneNumber) {
        return {
          ...s,
          video: {
            status: 'generating' as const,
            progressPercent: 15,
            updatedAt: new Date().toISOString(),
          },
        };
      }
      return s;
    });

    onUpdateProject({
      ...project,
      scenes: updatedScenes,
    });

    try {
      const { operationName } = await generateSceneVideo(project, sceneNumber, {
        aspectRatio,
        style: videoStyle,
        resolution,
      });

      // Poll status every 4 seconds until done
      let completed = false;
      let attempts = 0;
      const maxAttempts = 75; // 5 minutes max

      while (!completed && attempts < maxAttempts) {
        attempts++;
        await new Promise((r) => setTimeout(r, 4000));

        const statusResult = await pollVideoStatus(operationName, sceneNumber, project.id);

        if (statusResult.done) {
          completed = true;
          if (statusResult.error) {
            throw new Error(statusResult.error);
          }

          // Mark scene as completed
          const finalScenes = project.scenes.map((s) => {
            if (s.sceneNumber === sceneNumber) {
              return {
                ...s,
                video: {
                  status: 'completed' as const,
                  videoUrl: statusResult.videoUrl,
                  updatedAt: new Date().toISOString(),
                },
              };
            }
            return s;
          });

          onUpdateProject({
            ...project,
            scenes: finalScenes,
          });

          setActiveVideoSource(sceneNumber);
          break;
        }
      }

      if (!completed) {
        throw new Error('Video generation timed out while waiting for Google Veo.');
      }
    } catch (err: any) {
      console.error(`Failed to generate scene ${sceneNumber}:`, err);
      const isQuota = err.isQuotaError || (err.message && err.message.includes('429'));
      setIsQuotaError(isQuota);
      setGeneralError(err.message || 'Scene video generation failed.');

      const failedScenes = project.scenes.map((s) => {
        if (s.sceneNumber === sceneNumber) {
          return {
            ...s,
            video: {
              status: 'failed' as const,
              error: err.message,
              updatedAt: new Date().toISOString(),
            },
          };
        }
        return s;
      });

      onUpdateProject({
        ...project,
        scenes: failedScenes,
      });
    } finally {
      setCurrentGeneratingScene(null);
    }
  };

  // Generate all scenes sequentially
  const handleGenerateAllScenes = async () => {
    setIsGeneratingAll(true);
    setGeneralError(null);
    setIsQuotaError(false);

    // Set all ungenerated scenes to waiting
    const initialScenes = project.scenes.map((s) => {
      if (s.video?.status === 'completed') return s;
      return {
        ...s,
        video: {
          status: 'waiting' as const,
          updatedAt: new Date().toISOString(),
        },
      };
    });

    onUpdateProject({
      ...project,
      scenes: initialScenes,
    });

    for (const scene of project.scenes) {
      if (scene.video?.status === 'completed') continue;
      await handleGenerateScene(scene.sceneNumber);
    }

    // Try combining completed scene videos if at least 2 are ready
    const completedScenes = project.scenes.filter((s) => s.video?.videoUrl);
    if (completedScenes.length > 1) {
      try {
        setIsCombining(true);
        const filenames = completedScenes.map((s) => s.video!.videoUrl!.split('/').pop()!);
        const { fullVideoUrl } = await combineSceneVideos(project.id, filenames);
        onUpdateProject({
          ...project,
          fullVideoUrl,
          videoGenerationStatus: 'completed',
        });
        setActiveVideoSource('full');
      } catch (combineErr) {
        console.warn('Could not automatically combine video scenes:', combineErr);
      } finally {
        setIsCombining(false);
      }
    }

    setIsGeneratingAll(false);
  };

  const handleCombineAllNow = async () => {
    const completedScenes = project.scenes.filter((s) => s.video?.videoUrl);
    if (completedScenes.length === 0) return;

    setIsCombining(true);
    try {
      const filenames = completedScenes.map((s) => s.video!.videoUrl!.split('/').pop()!);
      const { fullVideoUrl } = await combineSceneVideos(project.id, filenames);
      onUpdateProject({
        ...project,
        fullVideoUrl,
        videoGenerationStatus: 'completed',
      });
      setActiveVideoSource('full');
    } catch (err: any) {
      setGeneralError(err.message || 'Failed to combine video files');
    } finally {
      setIsCombining(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Studio Header Card */}
      <div className="card-glass rounded-3xl p-6 md:p-8 border border-zinc-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <Film className="w-3.5 h-3.5" />
              <span>AI Video Studio • Powered by Google Veo</span>
            </div>
            <h2 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight">
              🎬 Video Generation Studio
            </h2>
            <p className="text-sm text-zinc-300 mt-2 max-w-2xl leading-relaxed">
              Generate actual, playable video clips for each scene using Google Veo while preserving strict character consistency from your Character Bible.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              onClick={handleGenerateAllScenes}
              disabled={isGeneratingAll || currentGeneratingScene !== null}
              className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-yellow-300 text-zinc-950 font-bold text-sm shadow-xl shadow-amber-500/20 disabled:opacity-50 transition-all cursor-pointer"
            >
              <Video className="w-4 h-4 text-zinc-950" />
              <span>{isGeneratingAll ? 'Generating Video Sequence...' : '🎬 Generate Full Video'}</span>
            </button>
          </div>
        </div>

        {/* Video Settings Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-zinc-800/80">
          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Aspect Ratio (Veo Format)
            </label>
            <div className="flex gap-2">
              {(['16:9', '9:16', '1:1'] as const).map((ratio) => (
                <button
                  key={ratio}
                  type="button"
                  onClick={() => setAspectRatio(ratio)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    aspectRatio === ratio
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {ratio} {ratio === '16:9' ? '🖥' : ratio === '9:16' ? '📱' : '⏹'}
                </button>
              ))}
            </div>
          </div>

          {/* Video Style */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Visual Render Style
            </label>
            <select
              value={videoStyle}
              onChange={(e) => setVideoStyle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 text-xs outline-none focus:border-amber-500"
            >
              {styles.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Resolution */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
              Output Resolution
            </label>
            <div className="flex gap-2">
              {(['720p', '1080p'] as const).map((res) => (
                <button
                  key={res}
                  type="button"
                  onClick={() => setResolution(res)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    resolution === res
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                      : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  {res}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error & Quota Alert Banner */}
      {generalError && (
        <div className="p-5 rounded-3xl bg-rose-950/40 border border-rose-500/40 text-rose-200 shadow-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-white">
                {isQuotaError ? 'Google Veo Quota & Billing Requirement' : 'Video Generation Error'}
              </h4>
              <p className="text-xs text-rose-300 mt-1 leading-relaxed">{generalError}</p>

              {isQuotaError && (
                <div className="mt-3 p-3 rounded-2xl bg-black/40 border border-rose-500/30 text-[11px] text-zinc-300 space-y-2">
                  <p>
                    <strong>Why did this happen?</strong> Google Veo (<code>veo-3.1-lite-generate-preview</code>) is a premium generative video model requiring video generation quota. Free-tier Gemini keys without Veo quota return <code>RESOURCE_EXHAUSTED / 429</code>.
                  </p>
                  <p>
                    <strong>Resolution:</strong> Ensure your project has active billing or an enabled Veo quota in the Google AI Studio Secrets panel.
                  </p>
                </div>
              )}

              <div className="flex items-center gap-3 mt-4">
                <button
                  onClick={() => {
                    if (currentGeneratingScene) {
                      handleGenerateScene(currentGeneratingScene);
                    } else {
                      handleGenerateAllScenes();
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-colors shadow-sm"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Generation</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player & Monitor Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Player (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={playerContainerRef}
            className="card-glass rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl relative bg-black group"
          >
            {/* Player Viewport */}
            <div className="relative aspect-video flex items-center justify-center bg-zinc-950">
              {activeVideoUrl ? (
                <video
                  ref={videoRef}
                  src={activeVideoUrl}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  className="w-full h-full object-contain"
                  playsInline
                />
              ) : (
                <div className="p-8 text-center max-w-sm">
                  <div className="w-16 h-16 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto mb-4 text-zinc-600">
                    <Video className="w-8 h-8" />
                  </div>
                  <h4 className="text-base font-bold text-zinc-300">No Video Generated Yet</h4>
                  <p className="text-xs text-zinc-500 mt-1">
                    Click <strong>Generate Video</strong> on any scene below or <strong>Generate Full Video</strong> to create live footage.
                  </p>
                </div>
              )}

              {/* Big Play Overlay (when paused and video exists) */}
              {activeVideoUrl && !isPlaying && (
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-amber-500/90 text-zinc-950 flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer"
                >
                  <Play className="w-7 h-7 fill-zinc-950 ml-1" />
                </button>
              )}
            </div>

            {/* Custom Player Controls Bar */}
            {activeVideoUrl && (
              <div className="p-4 bg-zinc-950/90 border-t border-zinc-800/80 space-y-3">
                {/* Progress Scrubber */}
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-mono text-zinc-400">
                    {formatTime(currentTime)}
                  </span>
                  <input
                    type="range"
                    min={0}
                    max={duration || 100}
                    step={0.1}
                    value={currentTime}
                    onChange={handleSeek}
                    className="flex-1 h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                  />
                  <span className="text-[11px] font-mono text-zinc-400">
                    {formatTime(duration)}
                  </span>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={togglePlay}
                      className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 transition-colors"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={toggleMute}
                        className="p-2 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX className="w-4 h-4" />
                        ) : (
                          <Volume2 className="w-4 h-4" />
                        )}
                      </button>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.05}
                        value={isMuted ? 0 : volume}
                        onChange={handleVolumeChange}
                        className="w-20 h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={activeVideoUrl}
                      download={`story2video_${project.id}_${activeVideoSource}.mp4`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 text-xs font-semibold transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 text-amber-400" />
                      <span>Download MP4</span>
                    </a>

                    <button
                      onClick={toggleFullscreen}
                      className="p-2 rounded-xl hover:bg-zinc-900 text-zinc-400 hover:text-zinc-200 transition-colors"
                      title="Fullscreen"
                    >
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Active Track Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveVideoSource('full')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
                activeVideoSource === 'full'
                  ? 'bg-amber-500 text-zinc-950 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              🎬 Full Movie {project.fullVideoUrl && '✅'}
            </button>

            {project.scenes.map((scene) => (
              <button
                key={scene.sceneNumber}
                onClick={() => setActiveVideoSource(scene.sceneNumber)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  activeVideoSource === scene.sceneNumber
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
                }`}
              >
                <span>Scene {scene.sceneNumber}</span>
                {scene.video?.status === 'completed' && <span className="text-[10px]">✅</span>}
                {scene.video?.status === 'generating' && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                )}
              </button>
            ))}

            {project.scenes.filter((s) => s.video?.status === 'completed').length > 1 && (
              <button
                onClick={handleCombineAllNow}
                disabled={isCombining}
                className="ml-auto px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-amber-300 text-xs font-semibold border border-amber-500/30 transition-all shrink-0 flex items-center gap-1"
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{isCombining ? 'Combining with ffmpeg...' : 'Combine Scenes'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Scene Status Queue (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="card-glass rounded-3xl p-5 border border-zinc-800 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-zinc-800/80">
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <span>Scene Generation Queue</span>
              </h3>
              <span className="text-xs font-mono text-zinc-400">
                {project.scenes.filter((s) => s.video?.status === 'completed').length}/
                {project.scenes.length} Ready
              </span>
            </div>

            {/* Queue List */}
            <div className="space-y-3">
              {project.scenes.map((scene) => {
                const status = scene.video?.status || 'idle';
                const isCurrent = currentGeneratingScene === scene.sceneNumber;

                return (
                  <div
                    key={scene.sceneNumber}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      isCurrent
                        ? 'bg-amber-500/10 border-amber-500/40 shadow-sm shadow-amber-500/10'
                        : status === 'completed'
                        ? 'bg-zinc-900/80 border-emerald-500/30'
                        : 'bg-zinc-900/50 border-zinc-800/80'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">
                          Scene {scene.sceneNumber}
                        </span>
                        <span className="text-[11px] text-zinc-400 truncate max-w-[140px]">
                          {scene.title}
                        </span>
                      </div>

                      {/* Status indicator */}
                      <div>
                        {status === 'completed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Generated</span>
                          </span>
                        )}
                        {status === 'generating' && (
                          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-400 animate-pulse">
                            <Clock className="w-3.5 h-3.5 animate-spin" />
                            <span>Generating...</span>
                          </span>
                        )}
                        {status === 'waiting' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Waiting</span>
                          </span>
                        )}
                        {status === 'failed' && (
                          <span className="inline-flex items-center gap-1 text-[11px] text-rose-400">
                            <AlertTriangle className="w-3.5 h-3.5" />
                            <span>Failed</span>
                          </span>
                        )}
                        {status === 'idle' && (
                          <span className="text-[11px] text-zinc-500">Not generated</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-zinc-400 mt-2">
                      <span className="truncate max-w-[180px]">
                        Cast: {scene.charactersPresent.join(', ')}
                      </span>

                      <div className="flex items-center gap-1.5">
                        {status === 'completed' ? (
                          <>
                            <button
                              onClick={() => setActiveVideoSource(scene.sceneNumber)}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium transition-colors"
                            >
                              Preview
                            </button>
                            <button
                              onClick={() => handleGenerateScene(scene.sceneNumber)}
                              disabled={isCurrent}
                              className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-amber-400 font-medium transition-colors"
                            >
                              Regen
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleGenerateScene(scene.sceneNumber)}
                            disabled={isCurrent || isGeneratingAll}
                            className="px-3 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 font-semibold transition-colors disabled:opacity-50"
                          >
                            Generate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model & Consistency Info Card */}
          <div className="p-4 rounded-3xl bg-zinc-900/40 border border-zinc-800/80 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Strict Character Consistency Enforced</span>
            </div>
            <p className="text-zinc-400 leading-relaxed text-[11px]">
              Every Veo video request injects the Character Bible descriptors for all cast members present in that shot, locking hairstyles, outfits, and facial features.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
