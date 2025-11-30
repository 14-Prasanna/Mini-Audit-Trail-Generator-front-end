// src/data/mockData.ts
export interface Version {
  id: number;
  taskId: number;        // NEW: which task it belongs to
  versionNumber: number;
  title: string;
  content: string;
  timestamp: string;
  addedWords: string[];
  removedWords: string[];
  oldLength: number;
  newLength: number;
}

export const mockVersions: Version[] = [
  {
    id: 1,
    taskId: 1,
    versionNumber: 1,
    title: 'Initial Project Proposal',
    content: 'This is the initial draft...',
    timestamp: '2025-11-28T10:30:00',
    addedWords: ['initial', 'draft', 'project'],
    removedWords: [],
    oldLength: 0,
    newLength: 42,
  },
  {
    id: 2,
    taskId: 1,
    versionNumber: 2,
    title: 'Initial Project Proposal',
    content: 'This is the revised draft... added analytics and notifications.',
    timestamp: '2025-11-28T14:15:00',
    addedWords: ['revised', 'analytics', 'notifications'],
    removedWords: ['initial'],
    oldLength: 42,
    newLength: 48,
  },
  {
    id: 3,
    taskId: 2,
    versionNumber: 1,
    title: 'Technical Architecture Document',
    content: 'Technical specifications... React, Node.js, PostgreSQL...',
    timestamp: '2025-11-29T09:00:00',
    addedWords: ['technical', 'React', 'PostgreSQL'],
    removedWords: [],
    oldLength: 0,
    newLength: 41,
  },
  {
    id: 4,
    taskId: 3,
    versionNumber: 1,
    title: 'Implementation Roadmap',
    content: 'Phase 1: Core infrastructure...',
    timestamp: '2025-11-29T16:45:00',
    addedWords: ['Phase', 'infrastructure'],
    removedWords: [],
    oldLength: 0,
    newLength: 42,
  },
  {
    id: 5,
    taskId: 4,
    versionNumber: 1,
    title: 'Security Guidelines',
    content: 'JWT-based authentication, GDPR compliance...',
    timestamp: '2025-11-30T11:20:00',
    addedWords: ['JWT', 'GDPR'],
    removedWords: [],
    oldLength: 0,
    newLength: 32,
  },
];