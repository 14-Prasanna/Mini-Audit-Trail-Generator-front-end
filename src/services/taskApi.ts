// src/services/taskApi.ts
import api from '../lib/axios';
import type { TaskVersion, TaskResponse } from '../types';

export interface CreateVersionPayload {
  title: string;
  content: string;
}

export const taskApi = {
  // Get all tasks (taskId + latest title)
  getAllTasks: async (): Promise<{ taskId: string; title: string }[]> => {
    const res = await api.get('/tasks');
    return res.data;
  },

  // Get all versions of a task
  getTaskVersions: async (taskId: string): Promise<TaskResponse> => {
    const res = await api.get(`/task/${taskId}`);
    return res.data;
  },

  // Create new version (or first version if task doesn't exist)
  createVersion: async (taskId: string, data: CreateVersionPayload): Promise<any> => {
    const res = await api.post(`/task/${taskId}/version`, data);
    return res.data;
  },

  // Get latest version of a task (for editing)
  getLatestVersion: async (taskId: string): Promise<TaskVersion | null> => {
    const task = await taskApi.getTaskVersions(taskId);
    if (!task.versions || task.versions.length === 0) return null;
    return task.versions[task.versions.length - 1]; // latest is last
  },

  // Optionally get a specific version
  getVersion: async (taskId: string, versionNumber: number): Promise<TaskVersion | null> => {
    const res = await api.get(`/task/${taskId}/version/${versionNumber}`);
    return res.data;
  },

  getDashboardStats: async (): Promise<{
    totalTasks: number;
    totalVersions: number;
    latestTask: { title: string; timeAgo: string } | null;
  }> => {
    const res = await api.get('/api/stats');
    return res.data;
  },

};
