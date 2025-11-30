// src/types/index.ts
export interface TaskVersion {
  versionNumber: number;
  data: {
    title: string;
    content: string;
  };
  diff?: {           
    added: number;
    removed: number;
    changed: number;
  };
  summary?: string;  
  createdAt: string;
  prev: number | null;
  next: number | null;
}

export interface TaskResponse {
  taskId: string;
  versions: TaskVersion[];
  totalVersions: number;
  headVersion: number | null;
  tailVersion: number | null;
}