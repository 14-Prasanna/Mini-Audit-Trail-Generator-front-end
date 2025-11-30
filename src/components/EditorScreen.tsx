// src/components/EditorScreen.tsx
import { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Divider,
  CircularProgress
} from '@mui/material';
import { Save, Plus, Edit3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { taskApi } from '../services/taskApi';

interface TaskItem {
  taskId: string;
  title: string;
}

export default function EditorScreen() {
  const [mode, setMode] = useState<'create' | 'edit'>('create');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [taskList, setTaskList] = useState<TaskItem[]>([]);
  const [fetchingTasks, setFetchingTasks] = useState(true);

  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;

  // Load all tasks on mount and after save
  const loadTaskList = async () => {
    setFetchingTasks(true);
    try {
      const tasks = await taskApi.getAllTasks();
      setTaskList(tasks);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setFetchingTasks(false);
    }
  };

  useEffect(() => {
    loadTaskList();
  }, []);

  const handleTaskChange = async (taskId: string) => {
    if (!taskId) return;
    setSelectedTaskId(taskId);
    setLoading(true);
    try {
      const latest = await taskApi.getLatestVersion(taskId);
      if (latest) {
        setTitle(latest.data.title || '');
        setContent(latest.data.content || '');
      } else {
        // Task exists but has no versions? unlikely, but clear form
        setTitle('');
        setContent('');
      }
    } catch (err) {
      toast.error('Failed to load task version');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim()) {
      toast.error('Title and content are required');
      return;
    }

    const isCreate = mode === 'create';
    const taskId = isCreate ? Date.now().toString() : selectedTaskId;

    const payload = { title: title.trim(), content: content.trim() };

    setLoading(true);
    try {
      await taskApi.createVersion(taskId, payload);

      toast.success(isCreate ? 'Task created successfully!' : 'New version saved!');

      // Reset form
      setTitle('');
      setContent('');
      setSelectedTaskId('');
      setMode('create');

      // Critical: Refresh the task list so new task appears
      await loadTaskList();

    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.error || 'Failed to save');
    } finally {
      setLoading(false);
    }
  };

  const handleModeSwitch = (newMode: 'create' | 'edit') => {
    setMode(newMode);
    setSelectedTaskId('');
    setTitle('');
    setContent('');
  };

  return (
    <Box sx={{ maxWidth: '1200px', margin: '0 auto', p: 3 }}>
      <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 4, flexWrap: 'wrap' }}>
          <Button
            variant={mode === 'create' ? 'contained' : 'outlined'}
            startIcon={<Plus />}
            onClick={() => handleModeSwitch('create')}
          >
            Create New Task
          </Button>
          <Button
            variant={mode === 'edit' ? 'contained' : 'outlined'}
            startIcon={<Edit3 />}
            onClick={() => handleModeSwitch('edit')}
          >
            Edit Existing Task
          </Button>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {mode === 'edit' && (
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel id="task-select-label">Select Task to Edit</InputLabel>
            <Select
              labelId="task-select-label"
              value={selectedTaskId}
              label="Select Task to Edit"
              onChange={(e) => handleTaskChange(e.target.value as string)}
              disabled={fetchingTasks || loading}
            >
              {fetchingTasks ? (
                <MenuItem disabled><CircularProgress size={20} /> Loading tasks...</MenuItem>
              ) : taskList.length === 0 ? (
                <MenuItem disabled>No tasks yet. Create one!</MenuItem>
              ) : (
                taskList.map((task) => (
                  <MenuItem key={task.taskId} value={task.taskId}>
                    {task.title}
                  </MenuItem>
                ))
              )}
            </Select>
          </FormControl>
        )}

        {(loading || fetchingTasks) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        )}

        <TextField
          fullWidth
          label="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 3 }}
          disabled={loading}
          placeholder="Enter a clear, descriptive title"
        />

        <Box sx={{ mb: 3, position: 'relative' }}>
          <TextField
            fullWidth
            multiline
            rows={16}
            label="Content (Markdown supported)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            placeholder="Start writing your task content here..."
          />
          <Box sx={{
            position: 'absolute',
            bottom: 12,
            right: 16,
            bgcolor: 'background.paper',
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'divider'
          }}>
            <Typography variant="caption" fontWeight={600} color="text.secondary">
              {wordCount} words
            </Typography>
          </Box>
        </Box>

        <Button
          variant="contained"
          size="large"
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <Save />}
          onClick={handleSave}
          disabled={!title.trim() || !content.trim() || loading}
          fullWidth={false}
        >
          {mode === 'create'
            ? 'Create Task & Save Version 1'
            : `Save New Version (V${taskList.find(t => t.taskId === selectedTaskId)?.versionCount || '?'} + 1)`}
        </Button>
      </Paper>
    </Box>
  );
}