import { StoryGenerationInput, StoryProject, Scene } from '../types/story';

export async function generateStoryWithAI(input: StoryGenerationInput): Promise<StoryProject> {
  const response = await fetch('/api/generate-story', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(input),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to generate story with Gemini AI.');
  }

  return data.project;
}

export async function regenerateSceneWithAI(
  project: StoryProject,
  sceneNumber: number,
  modifiedScene: Scene
): Promise<Scene> {
  const response = await fetch('/api/regenerate-scene', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project,
      sceneNumber,
      modifiedScene,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to regenerate scene with Gemini AI.');
  }

  return data.updatedScene;
}

export async function askStoryDirectorAI(
  project: StoryProject,
  instruction: string
): Promise<{ directorNotes: string; updatedProject: StoryProject }> {
  const response = await fetch('/api/story-director', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project,
      instruction,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Story Director AI encountered an issue.');
  }

  return {
    directorNotes: data.directorNotes,
    updatedProject: data.updatedProject,
  };
}

export async function getVideoCapabilities(): Promise<{
  videoModel: string;
  highQualityModel: string;
  supportedAspectRatios: string[];
  supportedResolutions: string[];
  supportedStyles: string[];
  ffmpegAvailable: boolean;
  hasApiKey: boolean;
}> {
  const response = await fetch('/api/video-capabilities');
  return response.json();
}

export async function generateSceneVideo(
  project: StoryProject,
  sceneNumber: number,
  videoSettings?: {
    aspectRatio?: '16:9' | '9:16' | '1:1';
    style?: string;
    resolution?: '720p' | '1080p';
  }
): Promise<{
  operationName: string;
  sceneNumber: number;
  promptUsed: string;
  model: string;
}> {
  const response = await fetch('/api/generate-scene-video', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      project,
      sceneNumber,
      videoSettings,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    const error: any = new Error(data.error || 'Failed to dispatch Google Veo video generation');
    error.status = response.status;
    error.isQuotaError = data.isQuotaError;
    error.isTransient = data.isTransient;
    throw error;
  }

  return data;
}

export async function pollVideoStatus(
  operationName: string,
  sceneNumber: number,
  projectId: string
): Promise<{
  done: boolean;
  videoUrl?: string;
  filename?: string;
  error?: string;
}> {
  const response = await fetch('/api/video-status', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      operationName,
      sceneNumber,
      projectId,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to poll video generation status');
  }

  return data;
}

export async function combineSceneVideos(
  projectId: string,
  filenames: string[]
): Promise<{ fullVideoUrl: string; warning?: string }> {
  const response = await fetch('/api/combine-videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      projectId,
      filenames,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to combine scene video files');
  }

  return data;
}

