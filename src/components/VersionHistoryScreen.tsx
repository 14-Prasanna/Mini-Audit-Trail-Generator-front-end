// src/components/VersionHistoryScreen.tsx
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Chip,
  IconButton,
  Collapse,
  Card,
  CardContent,
  Stack,
  Divider,
  Tooltip,
  CircularProgress,
  Alert,
} from '@mui/material';
import { ChevronDown, ChevronUp, FileText, Plus, Minus, Clock, Eye, Sparkles } from 'lucide-react';
import { taskApi } from '../services/taskApi';
import toast from 'react-hot-toast';

interface Version {
  versionNumber: number;
  data: { title: string; content: string };
  diff?: { added: number; removed: number; changed: number };
  summary?: string;
  createdAt: string;
}

interface TaskGroup {
  taskId: string;
  title: string;
  versions: Version[];
}

// Smart content summarizer (like AI)
const generateContentSummary = (content: string): string => {
  const text = content.trim();
  if (text.length === 0) return "Empty note";
  if (text.length < 100) return text;

  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
  if (sentences.length === 0) return text.slice(0, 120) + "...";

  const first = sentences[0].trim();
  const last = sentences[sentences.length - 1].trim();

  return first + (sentences.length > 2 ? " … " + last : "");
};

const formatTimeAgo = (dateStr: string): string => {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const mins = Math.floor(diffMs / 60000);
  const hrs = Math.floor(mins / 60);
  const days = Math.floor(hrs / 24);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  if (hrs < 24) return `${hrs}h ago`;
  if (days < 7) return `${days}d ago`;
  return date.toLocaleDateString();
};

export default function VersionHistoryScreen() {
  const [tasks, setTasks] = useState<TaskGroup[]>([]);
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
  const [expandedVersions, setExpandedVersions] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      setLoading(true);
      setError('');
      const taskList = await taskApi.getAllTasks();

      const fullTasks = await Promise.all(
        taskList.map(async (task) => {
          const res = await taskApi.getTaskVersions(task.taskId);
          const versions = res.versions
            .sort((a: any, b: any) => b.versionNumber - a.versionNumber)
            .map((v: any) => ({
              versionNumber: v.versionNumber,
              data: v.data,
              diff: v.diff || { added: 0, removed: 0, changed: 0 },
              summary: v.summary || (v.versionNumber === 1 ? 'Created task' : 'Updated content'),
              createdAt: v.createdAt,
            }));

          return {
            taskId: task.taskId,
            title: task.title || 'Untitled Task',
            versions,
          };
        })
      );

      setTasks(fullTasks);
    } catch (err) {
      setError('Failed to load history');
      toast.error('Could not load version history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = (taskId: string) => {
    setExpandedTasks(prev => {
      const next = new Set(prev);
      next.has(taskId) ? next.delete(taskId) : next.add(taskId);
      return next;
    });
  };

  const toggleVersion = (key: string) => {
    setExpandedVersions(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400, flexDirection: 'column' }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading version history...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (tasks.length === 0) {
    return (
      <Box sx={{ maxWidth: 800, mx: 'auto', p: 6, textAlign: 'center' }}>
        <FileText size={80} color="#ccc" />
        <Typography variant="h5" sx={{ mt: 3, color: 'text.secondary' }}>
          No tasks yet
        </Typography>
        <Typography color="text.secondary">
          Create your first task to see version history.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', mx: 'auto', p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" fontWeight={700} gutterBottom>
        Version History
      </Typography>
      <Typography color="text.secondary" sx={{ mb: 4 }}>
        Every word is tracked — with color-coded changes and smart summaries.
      </Typography>

      {/* Legend */}
      <Box sx={{ mb: 4, p: 3, bgcolor: 'grey.50', borderRadius: 3, display: 'flex', flexWrap: 'wrap', gap: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 18, height: 18, bgcolor: '#d4edda', borderRadius: 2 }} />
          <Typography variant="caption" fontWeight={600} color="#2e7d32">Added</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 18, height: 18, bgcolor: '#f8d7da', borderRadius: 2 }} />
          <Typography variant="caption" fontWeight={600} color="#c62828">Removed</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ width: 18, height: 18, bgcolor: '#fff3cd', borderRadius: 2 }} />
          <Typography variant="caption" fontWeight={600} color="#856404">Unchanged</Typography>
        </Box>
      </Box>

      <Stack spacing={4}>
        {tasks.map((task) => {
          const isOpen = expandedTasks.has(task.taskId);

          return (
            <Card
              key={task.taskId}
              elevation={5}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: isOpen ? '2px solid' : '1px solid',
                borderColor: isOpen ? 'primary.main' : 'divider',
                boxShadow: isOpen ? '0 8px 32px rgba(0,0,0,0.12)' : '0 4px 12px rgba(0,0,0,0.08)',
              }}
            >
              {/* Task Header */}
              <Box
                onClick={() => toggleTask(task.taskId)}
                sx={{
                  p: 3.5,
                  bgcolor: isOpen ? 'primary.main' : 'background.paper',
                  color: isOpen ? 'white' : 'text.primary',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  '&:hover': { bgcolor: isOpen ? 'primary.dark' : 'action.hover' },
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                    <FileText size={36} />
                    <Box>
                      <Typography variant="h5" fontWeight={700}>
                        {task.title}
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        {task.versions.length} version{task.versions.length > 1 ? 's' : ''}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton size="large">
                    {isOpen ? <ChevronUp color="white" /> : <ChevronDown />}
                  </IconButton>
                </Box>
              </Box>

              {/* Versions */}
              <Collapse in={isOpen}>
                <Box sx={{ bgcolor: '#fafafa' }}>
                  {task.versions.map((version, idx) => {
                    const { diff, summary } = version;
                    const isLatest = idx === 0;
                    const content = version.data.content;
                    const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
                    const versionKey = `${task.taskId}-v${version.versionNumber}`;

                    // Compare with previous version for word-by-word diff
                    const prevVersion = idx < task.versions.length - 1 ? task.versions[idx + 1] : null;
                    const prevWords = prevVersion ? new Set(prevVersion.data.content.toLowerCase().split(/\s+/).filter(Boolean)) : new Set<string>();
                    const currentWords = content.toLowerCase().split(/\s+/).filter(Boolean);

                    const addedCount = diff?.added || 0;
                    const removedCount = diff?.removed || 0;
                    const unchangedCount = currentWords.filter(w => prevWords.has(w)).length;

                    return (
                      <Box key={versionKey} sx={{ bgcolor: 'white', borderBottom: '1px solid #eee' }}>
                        {/* Version Header */}
                        <Box
                          onClick={() => toggleVersion(versionKey)}
                          sx={{ p: 3.5, cursor: 'pointer', '&:hover': { bgcolor: '#f5f5f5' } }}
                        >
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap', mb: 1 }}>
                                <Chip label={`Version ${version.versionNumber}`} color={isLatest ? 'success' : 'default'} size="medium" />
                                {isLatest && <Chip label="Latest" color="success" size="small" />}
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Clock size={16} />
                                  <Typography variant="body2" color="text.secondary">
                                    {formatTimeAgo(version.createdAt)}
                                  </Typography>
                                </Box>
                              </Box>

                              <Typography variant="h6" fontWeight={600} sx={{ mt: 1 }}>
                                {summary}
                              </Typography>

                              {/* Color-Coded Word Stats */}
                              <Box sx={{ mt: 3, display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(3, 1fr)' }, gap: 3 }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Box sx={{ width: 24, height: 24, bgcolor: '#d4edda', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Plus size={16} style={{ color: '#2e7d32' }} />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: '#2e7d32' }}>
                                      +{addedCount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Added</Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Box sx={{ width: 24, height: 24, bgcolor: '#f8d7da', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Minus size={16} style={{ color: '#c62828' }} />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: '#c62828' }}>
                                      −{removedCount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Removed</Typography>
                                  </Box>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                  <Box sx={{ width: 24, height: 24, bgcolor: '#fff3cd', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FileText size={14} style={{ color: '#856404' }} />
                                  </Box>
                                  <Box>
                                    <Typography sx={{ fontWeight: 700, fontSize: '1.4rem', color: '#856404' }}>
                                      {unchangedCount}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">Unchanged</Typography>
                                  </Box>
                                </Box>
                              </Box>

                              {/* Smart Summary Preview */}
                              <Box sx={{ mt: 3, p: 2, bgcolor: '#f0f7ff', borderRadius: 2, borderLeft: '4px solid #2196f3' }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                  <Sparkles size={16} style={{ color: '#2196f3' }} />
                                  <Typography variant="caption" fontWeight={600} color="#1976d2">
                                    Summary
                                  </Typography>
                                </Box>
                                <Typography variant="body2" color="text.primary" sx={{ fontStyle: 'italic' }}>
                                  "{generateContentSummary(content)}"
                                </Typography>
                              </Box>
                            </Box>

                            <Box sx={{ textAlign: 'right' }}>
                              <Typography variant="h4" fontWeight={700} color="primary">
                                {wordCount}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                total words
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Full Content with Highlighting */}
                        <Collapse in={expandedVersions.has(versionKey)}>
                          <Box sx={{ px: 3.5, pb: 4 }}>
                            <Divider sx={{ my: 2 }} />
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                              <Eye size={20} />
                              <Typography variant="h6" fontWeight={600}>
                                Full Content
                              </Typography>
                            </Box>

                            <Paper
                              elevation={1}
                              sx={{
                                p: 4,
                                bgcolor: '#fdfdfd',
                                borderRadius: 3,
                                border: '1px solid #e0e0e0',
                                maxHeight: 600,
                                overflow: 'auto',
                                fontFamily: 'Georgia, serif',
                                fontSize: '1.05rem',
                                lineHeight: 1.9,
                                color: '#2c3e50',
                              }}
                            >
                              {content.split(/(\s+)/).map((part, i) => {
                                const clean = part.replace(/[.,!?;:"']/g, '').toLowerCase().trim();
                                const isWord = /\w/.test(clean);

                                if (!isWord) return <span key={i}>{part}</span>;

                                const wasInPrev = prevWords.has(clean);
                                const isNew = !wasInPrev;

                                return (
                                  <Tooltip
                                    key={i}
                                    title={isNew ? 'Newly added word' : 'Unchanged from previous version'}
                                    arrow
                                    placement="top"
                                  >
                                    <Box
                                      component="span"
                                      sx={{
                                        bgcolor: isNew ? '#d4edda' : '#fff3cd',
                                        color: isNew ? '#155724' : '#856404',
                                        borderRadius: 1.5,
                                        px: 0.6,
                                        py: 0.2,
                                        mx: 0.2,
                                        cursor: 'help',
                                        transition: 'all 0.2s',
                                        fontWeight: isNew ? 600 : 500,
                                      }}
                                    >
                                      {part}
                                    </Box>
                                  </Tooltip>
                                );
                              })}
                            </Paper>
                          </Box>
                        </Collapse>
                      </Box>
                    );
                  })}
                </Box>
              </Collapse>
            </Card>
          );
        })}
      </Stack>
    </Box>
  );
}