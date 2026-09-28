export interface Character {
  id: string;
  name: string;
  ageRange: string;
  gender: string;
  appearance: string;
  hairstyle: string;
  clothing: string;
  personality: string;
  role: string;
  consistencyProfile: string;
  avatarColor?: string;
}

export interface DialogueLine {
  speaker: string;
  line: string;
}

export interface CharacterAction {
  character: string;
  action: string;
}

export interface CharacterExpression {
  character: string;
  expression: string;
}

export interface CameraDirection {
  angle: string;
  movement: string;
  shotType: string;
  distance: string;
  summary: string;
}

export interface BackgroundMusic {
  mood: string;
  tempo: string;
  instrumentation: string;
}

export interface SceneVideoStatus {
  status: 'idle' | 'waiting' | 'generating' | 'completed' | 'failed';
  operationName?: string;
  videoUrl?: string;
  error?: string;
  progressPercent?: number;
  updatedAt?: string;
}

export interface Scene {
  sceneNumber: number;
  title: string;
  duration: string;
  location: string;
  timeOfDay: string;
  charactersPresent: string[];
  characterActions: CharacterAction[];
  facialExpressions: CharacterExpression[];
  cameraDirection: CameraDirection;
  environment: string;
  dialogues: DialogueLine[];
  soundEffects: string[];
  backgroundMusic: BackgroundMusic;
  imagePrompt: string;
  videoPrompt: string;
  video?: SceneVideoStatus;
}

export interface VideoSettings {
  aspectRatio: '16:9' | '9:16' | '1:1';
  style: string;
  resolution: '720p' | '1080p';
}

export interface StoryProject {
  id: string;
  title: string;
  summary: string;
  genre: string;
  style: string;
  orientation: string;
  targetDuration: string;
  language: string;
  characterCount: number;
  userStoryIdea: string;
  additionalInstructions: string;
  characters: Character[];
  scenes: Scene[];
  videoSettings?: VideoSettings;
  fullVideoUrl?: string;
  videoGenerationStatus?: 'idle' | 'generating' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface StoryGenerationInput {
  storyIdea: string;
  genre: string;
  style: string;
  orientation: string;
  targetDuration: string;
  language: string;
  characterCount: number;
  additionalInstructions: string;
}

export interface DirectorMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  appliedChanges?: string[];
}
