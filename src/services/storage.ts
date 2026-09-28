import { StoryProject } from '../types/story';
import { DEMO_PROJECT } from '../data/demoProject';

const STORAGE_KEY_PROJECTS = 'story2video_projects';
const STORAGE_KEY_CURRENT = 'story2video_current_project';

export const getSavedProjects = (): StoryProject[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      // Seed with demo project initially
      const initial = [DEMO_PROJECT];
      localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [DEMO_PROJECT];
  } catch (e) {
    console.error('Failed to load projects from storage', e);
    return [DEMO_PROJECT];
  }
};

export const saveProjects = (projects: StoryProject[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects to storage', e);
  }
};

export const getCurrentProject = (): StoryProject => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CURRENT);
    if (raw) {
      return JSON.parse(raw);
    }
    return DEMO_PROJECT;
  } catch (e) {
    console.error('Failed to load current project from storage', e);
    return DEMO_PROJECT;
  }
};

export const saveCurrentProject = (project: StoryProject): void => {
  try {
    localStorage.setItem(STORAGE_KEY_CURRENT, JSON.stringify(project));
    // Also update in projects list
    const all = getSavedProjects();
    const existingIndex = all.findIndex((p) => p.id === project.id);
    if (existingIndex >= 0) {
      all[existingIndex] = project;
    } else {
      all.unshift(project);
    }
    saveProjects(all);
  } catch (e) {
    console.error('Failed to save current project', e);
  }
};

export const deleteProject = (id: string): StoryProject[] => {
  const all = getSavedProjects().filter((p) => p.id !== id);
  saveProjects(all);
  return all;
};

export const duplicateProject = (project: StoryProject): StoryProject => {
  const duplicated: StoryProject = {
    ...project,
    id: 'proj-' + Date.now(),
    title: `${project.title} (Copy)`,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const all = getSavedProjects();
  all.unshift(duplicated);
  saveProjects(all);
  return duplicated;
};
