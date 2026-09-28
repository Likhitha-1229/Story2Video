import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { execFile } from 'child_process';
import dotenv from 'dotenv';
import { GoogleGenAI, GenerateVideosOperation } from '@google/genai';
import { StoryProject, Scene } from './src/types/story';

dotenv.config();

const app = express();
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '10mb' }));

// Ensure video storage directory exists
const VIDEO_STORAGE_DIR = path.resolve(process.cwd(), 'storage', 'videos');
if (!fs.existsSync(VIDEO_STORAGE_DIR)) {
  fs.mkdirSync(VIDEO_STORAGE_DIR, { recursive: true });
}

// Model configuration:
// Primary Text: gemini-3.8-flash (Standard Gemini Flash model)
// Fallback Text: gemini-3.1-flash-lite (Supported Gemini Flash-Lite model for high-demand spikes)
// Video: veo-3.1-lite-generate-preview (Official Google Veo video generation model)
const PRIMARY_MODEL = 'gemini-3.8-flash';
const FALLBACK_MODEL = 'gemini-3.1-flash-lite';
const VEO_VIDEO_MODEL = 'veo-3.1-lite-generate-preview';
const VEO_HQ_MODEL = 'veo-3.1-generate-preview';

// Helper to get Gemini client
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set in environment. Gemini features will return helpful notice.');
  }
  return new GoogleGenAI();
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function isTransientError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error.statusCode;
  const message = (error.message || '').toLowerCase();

  if (status === 503 || status === 429 || status === 504) return true;
  if (
    message.includes('503') ||
    message.includes('unavailable') ||
    message.includes('high demand') ||
    message.includes('temporarily busy') ||
    message.includes('resource exhausted') ||
    message.includes('rate limit')
  ) {
    return true;
  }
  return false;
}

function isAuthOrClientError(error: any): boolean {
  if (!error) return false;
  const status = error.status || error.code || error.statusCode;
  const message = (error.message || '').toLowerCase();

  if (status === 400 || status === 401 || status === 403) return true;
  if (
    message.includes('api_key_invalid') ||
    message.includes('api key not valid') ||
    message.includes('permission denied') ||
    message.includes('bad request')
  ) {
    return true;
  }
  return false;
}

interface GenerateParams {
  contents: any;
  config?: any;
}

async function callModelWithRetry(
  ai: GoogleGenAI,
  modelName: string,
  params: GenerateParams,
  maxRetries = 3
) {
  let lastError: any = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      console.log(`[Gemini API] Invoking ${modelName} (attempt ${attempt + 1}/${maxRetries + 1})...`);
      const response = await ai.models.generateContent({
        model: modelName,
        contents: params.contents,
        config: params.config,
      });
      return response;
    } catch (err: any) {
      lastError = err;
      console.warn(`[Gemini API] ${modelName} error on attempt ${attempt + 1}:`, err.message || err);

      // Do not retry client or authentication errors
      if (isAuthOrClientError(err)) {
        throw err;
      }

      // Retry on transient 503/UNAVAILABLE with exponential backoff: ~1s, 2s, 4s
      if (attempt < maxRetries && isTransientError(err)) {
        const backoffMs = Math.pow(2, attempt) * 1000;
        console.log(`[Gemini API] Backing off for ${backoffMs}ms before retry...`);
        await sleep(backoffMs);
        continue;
      }

      break;
    }
  }

  throw lastError;
}

async function generateContentWithFallback(ai: GoogleGenAI, params: GenerateParams) {
  try {
    return await callModelWithRetry(ai, PRIMARY_MODEL, params, 3);
  } catch (primaryErr: any) {
    if (isAuthOrClientError(primaryErr)) {
      throw primaryErr;
    }

    console.warn(
      `[Gemini API] Primary model ${PRIMARY_MODEL} unavailable after retries. Switching to fallback model ${FALLBACK_MODEL}...`
    );

    try {
      return await callModelWithRetry(ai, FALLBACK_MODEL, params, 2);
    } catch (fallbackErr: any) {
      console.error('[Gemini API] Fallback model also failed:', fallbackErr.message || fallbackErr);

      if (isTransientError(primaryErr) || isTransientError(fallbackErr)) {
        const cleanErr = new Error('The AI service is temporarily busy. Please try again in a moment.');
        (cleanErr as any).status = 503;
        throw cleanErr;
      }
      throw fallbackErr;
    }
  }
}

// Health endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    primaryModel: PRIMARY_MODEL,
    fallbackModel: FALLBACK_MODEL,
  });
});

// Generate Story endpoint
app.post('/api/generate-story', async (req: Request, res: Response) => {
  try {
    const {
      storyIdea,
      genre = 'Comedy',
      style = 'Pixar-like 3D animation',
      orientation = '16:9 Landscape',
      targetDuration = '1 minute',
      language = 'English',
      characterCount = 3,
      additionalInstructions = '',
    } = req.body;

    if (!storyIdea || typeof storyIdea !== 'string') {
      return res.status(400).json({ error: 'storyIdea is required' });
    }

    const ai = getGeminiClient();

    const systemPrompt = `You are an elite Hollywood director, screenwriter, and AI Video Producer for "Story2Video AI".
Your task is to transform the user's story idea into an industry-grade, structured video production package suitable for AI video generation tools like Google Flow, Veo, Sora, and Runway.

STRICT REQUIREMENTS & RULES:
1. CHARACTERS:
   - Create exactly ${characterCount} main characters (unless the story strictly requires fewer).
   - For every character, generate a comprehensive "Character Consistency Profile".
   - The Character Consistency Profile MUST contain their exact physical traits, body type, age range, fixed hairstyle, and fixed clothing so that AI video generators keep them identical from scene to scene.
   - Do NOT change clothing or appearance between scenes unless explicitly instructed.
   - Assign a vibrant avatarColor gradient (e.g., 'from-amber-500 to-yellow-600', 'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-rose-500 to-red-600').

2. SCENES:
   - Create a logical sequence of 3 to 6 scenes matching the target duration (${targetDuration}).
   - In each scene, ONLY include characters specified in "charactersPresent" from your character list. NEVER invent random characters or switch appearances.
   - Every scene must logically advance the story arc.

3. DIALOGUE:
   - Format: Speaker name and spoken line.
   - LANGUAGE RULE: Dialogue MUST be generated in the requested language: "${language}".
   - If language is Telugu, write the dialogue in natural, modern conversational Telugu script (తెలుగు) with vivid emotional tone.
   - If Hindi, Tamil, Kannada, Malayalam, write in their respective scripts.
   - If English, write lively, natural English dialogue.
   - Do NOT assign lines to the wrong speaker.

4. CAMERA & DIRECTIONS:
   - Specify camera angle (e.g. Low angle, Dutch angle, Eye-level, High angle), camera movement (Slow dolly push, Tracking glide, Static whip-pan), shot type (Close-up, Medium two-shot, Wide establishing shot), distance, and a summary.

5. AI VIDEO PROMPT & REFERENCE IMAGE PROMPT:
   - For EACH scene, generate:
     a) "videoPrompt": A self-contained, hyper-detailed prompt for AI video generators (Google Flow, Veo, Runway Gen-3). It MUST explicitly repeat the character consistency details for the characters present in that scene, specify action, facial expressions, camera movement, lighting, environment, sound effects, duration, and aspect ratio (${orientation}).
     b) "imagePrompt": A reference frame prompt focusing on character consistency, poses, lighting, visual style (${style}), and composition.

Output ONLY a valid JSON object matching the exact structure below.`;

    const userPrompt = `USER STORY IDEA:
"${storyIdea}"

SPECIFICATIONS:
- Genre: ${genre}
- Visual Art Style: ${style}
- Video Orientation: ${orientation}
- Target Duration: ${targetDuration}
- Spoken Dialogue Language: ${language}
- Number of Characters: ${characterCount}
- Additional User Directives: ${additionalInstructions || 'None'}

Generate the complete JSON production plan:
{
  "title": "Story Title",
  "summary": "Short 2-3 sentence summary of the story",
  "characters": [
    {
      "id": "char-1",
      "name": "Character Name",
      "ageRange": "20-25",
      "gender": "Gender",
      "appearance": "Physical appearance details",
      "hairstyle": "Hairstyle description",
      "clothing": "Exact outfit details",
      "personality": "Key personality traits",
      "role": "Role in the story",
      "avatarColor": "from-amber-500 to-yellow-600",
      "consistencyProfile": "Exact reusable visual description for video prompts"
    }
  ],
  "scenes": [
    {
      "sceneNumber": 1,
      "title": "Scene Title",
      "duration": "10 seconds",
      "location": "Specific location",
      "timeOfDay": "e.g. Afternoon golden hour",
      "charactersPresent": ["Character Name"],
      "characterActions": [
        { "character": "Character Name", "action": "Exact action performed" }
      ],
      "facialExpressions": [
        { "character": "Character Name", "expression": "Expression (Happy, Shocked, Confused, etc.)" }
      ],
      "cameraDirection": {
        "angle": "Camera angle",
        "movement": "Camera movement",
        "shotType": "Shot type",
        "distance": "Camera distance",
        "summary": "Camera summary"
      },
      "environment": "Environment description and key props",
      "dialogues": [
        { "speaker": "Character Name", "line": "Dialogue text in ${language}" }
      ],
      "soundEffects": ["Sound effect 1", "Sound effect 2"],
      "backgroundMusic": {
        "mood": "Music mood description",
        "tempo": "Tempo e.g. 120 BPM",
        "instrumentation": "Key instruments"
      },
      "imagePrompt": "Detailed reference frame prompt with character visual consistency and style",
      "videoPrompt": "Full AI text-to-video generation prompt for Google Flow / Veo / Runway"
    }
  ]
}`;

    const response = await generateContentWithFallback(ai, {
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText = response.text || '';
    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch {
      // Try extracting json substring if fenced
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse Gemini JSON output');
      }
    }

    const projectId = 'proj-' + Date.now();
    const finalProject: StoryProject = {
      id: projectId,
      title: parsedData.title || 'Untitled Video Project',
      summary: parsedData.summary || storyIdea,
      genre,
      style,
      orientation,
      targetDuration,
      language,
      characterCount: Number(characterCount) || (parsedData.characters ? parsedData.characters.length : 3),
      userStoryIdea: storyIdea,
      additionalInstructions,
      characters: (parsedData.characters || []).map((c: any, idx: number) => ({
        id: c.id || `char-${idx + 1}`,
        name: c.name || `Character ${idx + 1}`,
        ageRange: c.ageRange || '20s',
        gender: c.gender || 'Unspecified',
        appearance: c.appearance || '',
        hairstyle: c.hairstyle || '',
        clothing: c.clothing || '',
        personality: c.personality || '',
        role: c.role || '',
        avatarColor: c.avatarColor || ['from-amber-500 to-yellow-600', 'from-emerald-500 to-teal-600', 'from-blue-500 to-indigo-600', 'from-purple-500 to-pink-600', 'from-rose-500 to-red-600'][idx % 5],
        consistencyProfile: c.consistencyProfile || `${c.name}: ${c.appearance}, wearing ${c.clothing}, ${c.hairstyle}.`,
      })),
      scenes: (parsedData.scenes || []).map((s: any, idx: number) => ({
        sceneNumber: idx + 1,
        title: s.title || `Scene ${idx + 1}`,
        duration: s.duration || '10 seconds',
        location: s.location || 'Location',
        timeOfDay: s.timeOfDay || 'Day',
        charactersPresent: Array.isArray(s.charactersPresent) ? s.charactersPresent : [],
        characterActions: Array.isArray(s.characterActions) ? s.characterActions : [],
        facialExpressions: Array.isArray(s.facialExpressions) ? s.facialExpressions : [],
        cameraDirection: s.cameraDirection || {
          angle: 'Eye-level',
          movement: 'Static',
          shotType: 'Medium shot',
          distance: 'Normal',
          summary: 'Standard cinematic framing',
        },
        environment: s.environment || '',
        dialogues: Array.isArray(s.dialogues) ? s.dialogues : [],
        soundEffects: Array.isArray(s.soundEffects) ? s.soundEffects : [],
        backgroundMusic: s.backgroundMusic || {
          mood: 'Atmospheric',
          tempo: 'Medium',
          instrumentation: 'Orchestral',
        },
        imagePrompt: s.imagePrompt || '',
        videoPrompt: s.videoPrompt || '',
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    res.json({ project: finalProject });
  } catch (error: any) {
    console.error('Error generating story:', error);
    res.status(error.status || 500).json({
      error: error.message || 'An error occurred while generating the story production plan with Gemini.',
    });
  }
});

// Regenerate single Scene endpoint
app.post('/api/regenerate-scene', async (req: Request, res: Response) => {
  try {
    const { project, sceneNumber, modifiedScene } = req.body;

    if (!project || !modifiedScene) {
      return res.status(400).json({ error: 'project and modifiedScene are required' });
    }

    const ai = getGeminiClient();

    const charSummary = project.characters.map((c: any) =>
      `${c.name}: Consistency Profile: "${c.consistencyProfile}". Outfit: ${c.clothing}.`
    ).join('\n');

    const prompt = `You are a film director and AI video prompt engineer.
We have an established production project "${project.title}" in style "${project.style}", orientation "${project.orientation}", dialogue language "${project.language}".

CHARACTER BIBLE:
${charSummary}

The user has updated Scene ${sceneNumber}:
- Title: ${modifiedScene.title}
- Location: ${modifiedScene.location}
- Time of Day: ${modifiedScene.timeOfDay}
- Duration: ${modifiedScene.duration}
- Characters Present: ${JSON.stringify(modifiedScene.charactersPresent)}
- Environment: ${modifiedScene.environment}
- Actions: ${JSON.stringify(modifiedScene.characterActions)}
- Expressions: ${JSON.stringify(modifiedScene.facialExpressions)}
- Camera: ${JSON.stringify(modifiedScene.cameraDirection)}
- Dialogue: ${JSON.stringify(modifiedScene.dialogues)}
- Sound Effects: ${JSON.stringify(modifiedScene.soundEffects)}
- Background Music: ${JSON.stringify(modifiedScene.backgroundMusic)}

YOUR TASK:
Regenerate and refine this scene so that:
1. "videoPrompt" is completely updated to reflect the new actions, camera, lighting, sound, dialogues, visual style, and aspect ratio, while strictly adhering to the Character Consistency Profiles.
2. "imagePrompt" is updated for consistent reference framing.
3. Ensure dialogues match the language "${project.language}".

Output ONLY JSON in this format:
{
  "sceneNumber": ${sceneNumber},
  "title": "${modifiedScene.title}",
  "duration": "${modifiedScene.duration}",
  "location": "${modifiedScene.location}",
  "timeOfDay": "${modifiedScene.timeOfDay}",
  "charactersPresent": ${JSON.stringify(modifiedScene.charactersPresent)},
  "characterActions": ${JSON.stringify(modifiedScene.characterActions)},
  "facialExpressions": ${JSON.stringify(modifiedScene.facialExpressions)},
  "cameraDirection": ${JSON.stringify(modifiedScene.cameraDirection)},
  "environment": "${modifiedScene.environment}",
  "dialogues": ${JSON.stringify(modifiedScene.dialogues)},
  "soundEffects": ${JSON.stringify(modifiedScene.soundEffects)},
  "backgroundMusic": ${JSON.stringify(modifiedScene.backgroundMusic)},
  "imagePrompt": "Refined reference image prompt...",
  "videoPrompt": "Refined Google Flow/Runway video generation prompt..."
}`;

    const response = await generateContentWithFallback(ai, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({ updatedScene: parsed });
  } catch (error: any) {
    console.error('Error regenerating scene:', error);
    res.status(error.status || 500).json({ error: error.message || 'Failed to regenerate scene' });
  }
});

// Story Director AI assistant endpoint
app.post('/api/story-director', async (req: Request, res: Response) => {
  try {
    const { project, instruction } = req.body;

    if (!project || !instruction) {
      return res.status(400).json({ error: 'project and instruction are required' });
    }

    const ai = getGeminiClient();

    const prompt = `You are "Story Director AI", an expert Hollywood creative director assisting a filmmaker with their AI video project.

CURRENT PROJECT:
Title: "${project.title}"
Style: "${project.style}"
Orientation: "${project.orientation}"
Language: "${project.language}"
Current Summary: "${project.summary}"

CURRENT CHARACTERS:
${JSON.stringify(project.characters, null, 2)}

CURRENT SCENES:
${JSON.stringify(project.scenes, null, 2)}

USER'S DIRECTORIAL REQUEST:
"${instruction}"

RULES:
1. Apply the user's directive to the story structure, dialogue, camera movements, or scenes.
2. CRITICAL: Strictly preserve each character's core identity, appearance, and visual consistency profile unless explicitly told to alter them.
3. If asked to make dialogue funnier, more dramatic, or change language (e.g., to Telugu, Hindi, English), update the dialogue lines and scripts appropriately.
4. Keep the scene-by-scene structure and all fields (characterActions, facialExpressions, cameraDirection, soundEffects, backgroundMusic, imagePrompt, videoPrompt).
5. Provide a concise, professional explanation ("directorNotes") summarizing what creative changes you applied.

Output ONLY JSON in this format:
{
  "directorNotes": "Directorial feedback explaining the changes made...",
  "updatedProject": {
    "title": "Title (updated if relevant)",
    "summary": "Summary (updated if relevant)",
    "characters": [ ...same or revised character array... ],
    "scenes": [ ...revised scene array... ]
  }
}`;

    const response = await generateContentWithFallback(ai, {
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      config: { responseMimeType: 'application/json' },
    });

    const parsed = JSON.parse(response.text || '{}');

    // Merge changes safely
    const updatedProject: StoryProject = {
      ...project,
      title: parsed.updatedProject?.title || project.title,
      summary: parsed.updatedProject?.summary || project.summary,
      characters: parsed.updatedProject?.characters || project.characters,
      scenes: parsed.updatedProject?.scenes || project.scenes,
      updatedAt: new Date().toISOString(),
    };

    res.json({
      directorNotes: parsed.directorNotes || 'Applied creative revisions to your scenes.',
      updatedProject,
    });
  } catch (error: any) {
    console.error('Error with Story Director AI:', error);
    res.status(error.status || 500).json({ error: error.message || 'Story Director AI encountered an issue.' });
  }
});

// Video Capabilities endpoint
app.get('/api/video-capabilities', (req: Request, res: Response) => {
  res.json({
    videoModel: VEO_VIDEO_MODEL,
    highQualityModel: VEO_HQ_MODEL,
    supportedAspectRatios: ['16:9', '9:16', '1:1'],
    supportedResolutions: ['720p', '1080p'],
    supportedStyles: [
      'Cinematic',
      '3D Cartoon',
      'Realistic',
      'Anime',
      'Comic',
      'Documentary',
    ],
    ffmpegAvailable: true,
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
  });
});

// Generate Video for a single Scene using Google Veo
app.post('/api/generate-scene-video', async (req: Request, res: Response) => {
  try {
    const { project, sceneNumber, videoSettings } = req.body;
    if (!project || sceneNumber === undefined) {
      return res.status(400).json({ error: 'project and sceneNumber are required' });
    }

    const scene = project.scenes.find((s: Scene) => s.sceneNumber === sceneNumber);
    if (!scene) {
      return res.status(404).json({ error: `Scene ${sceneNumber} not found in project` });
    }

    const ai = getGeminiClient();

    // Include Character Consistency Bible details for all characters appearing in this scene
    const charsInScene = (project.characters || []).filter((c: any) =>
      (scene.charactersPresent || []).includes(c.name)
    );
    const charConsistencyDetails = charsInScene
      .map((c: any) => `[Character ${c.name}]: ${c.consistencyProfile} Wearing: ${c.clothing}.`)
      .join(' ');

    const style = videoSettings?.style || project.style || 'Cinematic';
    const rawAspectRatio = videoSettings?.aspectRatio || '16:9';
    // Google Veo supports '16:9' or '9:16'
    const veoAspectRatio = rawAspectRatio === '9:16' ? '9:16' : '16:9';
    const resolution = videoSettings?.resolution === '1080p' ? '1080p' : '720p';

    const videoPrompt = `Cinematic video shot in ${style} visual style. ` +
      `Scene: ${scene.title}. ` +
      `Setting & Environment: ${scene.location}, ${scene.timeOfDay}. ${scene.environment}. ` +
      (charConsistencyDetails ? `Characters with strict visual consistency: ${charConsistencyDetails}. ` : '') +
      `Action: ${scene.characterActions?.map((a: any) => `${a.character} ${a.action}`).join('. ') || 'Natural cinematic action'}. ` +
      `Expressions: ${scene.facialExpressions?.map((e: any) => `${e.character} looks ${e.expression}`).join(', ') || 'natural'}. ` +
      `Camera Cinematography: ${scene.cameraDirection?.shotType || 'Medium shot'}, ${scene.cameraDirection?.angle || 'Eye-level'}, ${scene.cameraDirection?.movement || 'Slow tracking push'}. ` +
      `Lighting: ${scene.timeOfDay}. Highly coherent character appearance, photorealistic textures, 4k cinematic render.`;

    console.log(`[Google Veo] Dispatching video generation for Scene ${sceneNumber}...`);

    let operation;
    try {
      operation = await ai.models.generateVideos({
        model: VEO_VIDEO_MODEL,
        source: {
          prompt: videoPrompt,
        },
        config: {
          numberOfVideos: 1,
          resolution,
          aspectRatio: veoAspectRatio,
        },
      });
    } catch (veoErr: any) {
      console.error('[Google Veo] Video generation call failed:', veoErr);
      const status = veoErr.status || veoErr.code || 500;
      const msg = veoErr.message || '';

      if (status === 429 || msg.includes('RESOURCE_EXHAUSTED') || msg.includes('quota')) {
        return res.status(429).json({
          error: 'Google Veo video generation requires an active paid quota (RESOURCE_EXHAUSTED / 429). To generate live video clips, ensure billing is enabled or select a project with Veo video quota in the Google AI Studio Secrets panel.',
          isQuotaError: true,
          model: VEO_VIDEO_MODEL,
        });
      }

      if (status === 503 || msg.includes('UNAVAILABLE') || msg.includes('high demand')) {
        return res.status(503).json({
          error: 'The Google Veo video generation model is currently experiencing high demand. Please click Retry Generation in a moment.',
          isTransient: true,
        });
      }

      if (status === 400 || msg.includes('INVALID_ARGUMENT')) {
        return res.status(400).json({
          error: `Video generation argument error: ${msg}`,
        });
      }

      return res.status(status >= 400 && status < 600 ? status : 500).json({
        error: `Google Veo video generation error: ${msg || 'Unknown error occurred'}`,
      });
    }

    console.log(`[Google Veo] Operation started successfully: ${operation.name}`);
    res.json({
      success: true,
      operationName: operation.name,
      sceneNumber,
      promptUsed: videoPrompt,
      model: VEO_VIDEO_MODEL,
    });
  } catch (err: any) {
    console.error('Error in /api/generate-scene-video:', err);
    res.status(500).json({ error: err.message || 'Failed to dispatch video generation.' });
  }
});

// Check status of long-running Google Veo operation
app.post('/api/video-status', async (req: Request, res: Response) => {
  try {
    const { operationName, sceneNumber, projectId } = req.body;
    if (!operationName) {
      return res.status(400).json({ error: 'operationName is required' });
    }

    const ai = getGeminiClient();
    const op = new GenerateVideosOperation();
    op.name = operationName;

    const updated = await ai.operations.getVideosOperation({ operation: op });

    if (!updated.done) {
      return res.json({ done: false, status: 'generating' });
    }

    if (updated.error) {
      console.error('[Google Veo] Operation finished with error:', updated.error);
      return res.json({
        done: true,
        error: updated.error.message || 'Google Veo video processing failed.',
      });
    }

    const videoUri = updated.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
      return res.json({
        done: true,
        error: 'No video URI returned in completed operation.',
      });
    }

    console.log(`[Google Veo] Video generated for Scene ${sceneNumber}! Downloading from: ${videoUri}`);

    // Download video binary using Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    const downloadRes = await fetch(videoUri, {
      headers: { 'x-goog-api-key': apiKey || '' },
    });

    if (!downloadRes.ok) {
      throw new Error(`Failed to download video binary from Google (HTTP ${downloadRes.status})`);
    }

    const buffer = Buffer.from(await downloadRes.arrayBuffer());
    const safeProjectId = (projectId || 'default').replace(/[^a-zA-Z0-9_-]/g, '');
    const filename = `proj_${safeProjectId}_scene_${sceneNumber}_${Date.now()}.mp4`;
    const destPath = path.join(VIDEO_STORAGE_DIR, filename);

    fs.writeFileSync(destPath, buffer);
    console.log(`[Google Veo] Saved video to ${destPath} (${buffer.length} bytes)`);

    return res.json({
      done: true,
      videoUrl: `/api/video-file/${filename}`,
      filename,
      sizeBytes: buffer.length,
    });
  } catch (err: any) {
    console.error('Error in /api/video-status:', err);
    res.status(500).json({ error: err.message || 'Failed to poll video status.' });
  }
});

// Combine generated scene videos into final full-length video using ffmpeg
app.post('/api/combine-videos', async (req: Request, res: Response) => {
  try {
    const { projectId, filenames } = req.body;
    if (!filenames || !Array.isArray(filenames) || filenames.length === 0) {
      return res.status(400).json({ error: 'filenames array is required' });
    }

    const validPaths = filenames
      .map((f: string) => path.join(VIDEO_STORAGE_DIR, path.basename(f)))
      .filter((p: string) => fs.existsSync(p));

    if (validPaths.length === 0) {
      return res.status(404).json({ error: 'None of the specified video files exist on the server' });
    }

    if (validPaths.length === 1) {
      return res.json({
        fullVideoUrl: `/api/video-file/${path.basename(validPaths[0])}`,
      });
    }

    const safeProjectId = (projectId || 'default').replace(/[^a-zA-Z0-9_-]/g, '');
    const outputFilename = `proj_${safeProjectId}_full_${Date.now()}.mp4`;
    const outputPath = path.join(VIDEO_STORAGE_DIR, outputFilename);

    const concatListFile = path.join(VIDEO_STORAGE_DIR, `concat_${Date.now()}.txt`);
    const fileContent = validPaths.map((p: string) => `file '${p}'`).join('\n');
    fs.writeFileSync(concatListFile, fileContent);

    execFile(
      'ffmpeg',
      ['-y', '-f', 'concat', '-safe', '0', '-i', concatListFile, '-c', 'copy', outputPath],
      (error, stdout, stderr) => {
        try { fs.unlinkSync(concatListFile); } catch {}

        if (error) {
          console.error('[ffmpeg] Concat error:', stderr || error);
          return res.json({
            fullVideoUrl: `/api/video-file/${path.basename(validPaths[0])}`,
            warning: 'ffmpeg concatenation fallback applied',
          });
        }

        console.log(`[ffmpeg] Successfully combined ${validPaths.length} scenes into ${outputPath}`);
        res.json({
          fullVideoUrl: `/api/video-file/${outputFilename}`,
        });
      }
    );
  } catch (err: any) {
    console.error('Error combining videos:', err);
    res.status(500).json({ error: err.message || 'Failed to combine videos' });
  }
});

// Stream video file with full HTTP 206 Partial Content support for HTML5 Video Player
app.get('/api/video-file/:filename', (req: Request, res: Response) => {
  const safeFilename = path.basename(req.params.filename);
  const filePath = path.join(VIDEO_STORAGE_DIR, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Video not found');
  }

  const stat = fs.statSync(filePath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunksize = end - start + 1;
    const file = fs.createReadStream(filePath, { start, end });
    const head = {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunksize,
      'Content-Type': 'video/mp4',
    };
    res.writeHead(206, head);
    file.pipe(res);
  } else {
    const head = {
      'Content-Length': fileSize,
      'Content-Type': 'video/mp4',
      'Accept-Ranges': 'bytes',
    };
    res.writeHead(200, head);
    fs.createReadStream(filePath).pipe(res);
  }
});

// Setup Vite middleware in dev or static files in production
const startServer = async () => {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  } else {
    const isHmrDisabled = process.env.DISABLE_HMR === 'true';
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: isHmrDisabled ? false : undefined,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Story2Video AI server is running on http://0.0.0.0:${port}`);
  });
};

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});

