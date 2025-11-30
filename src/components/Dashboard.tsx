// src/components/Dashboard.tsx
import { useState, useEffect } from 'react';
import { Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { FileText, History, Clock, Package } from 'lucide-react';
import { taskApi } from '../services/taskApi';


interface Stats {
  totalTasks: number;
  totalVersions: number;
  latestTask: { title: string; timeAgo: string } | null;
}

const statCards = [
  { title: 'Total Tasks', key: 'totalTasks', icon: Package, color: '#3b82f6' },
  { title: 'Total Versions', key: 'totalVersions', icon: History, color: '#8b5cf6' },
  { title: 'Last Edited', key: 'latestTask', icon: Clock, color: '#10b981' },
] as const;

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await taskApi.getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const getStatValue = (key: string) => {
    if (key === 'latestTask') {
      return stats?.latestTask ? (
        <Box>
          <Typography variant="h4" fontWeight={700} color="#10b981">
            {stats.latestTask.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {stats.latestTask.timeAgo}
          </Typography>
        </Box>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No tasks yet
        </Typography>
      );
    }
    return (
      <Typography variant="h3" fontWeight={700}>
        {stats?.[key as keyof Stats] ?? 0}
      </Typography>
    );
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Dashboard
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Overview of your audit trail
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 3,
          mb: 4,
        }}
      >
        {statCards.map((stat) => (
          <Card
            key={stat.title}
            sx={{
              borderRadius: 3,
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              transition: 'transform 0.2s',
              '&:hover': { transform: 'translateY(-4px)' },
            }}
          >
            <CardContent>
              <Box display="flex" alignItems="center" gap={2} mb={2}>
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    backgroundColor: `${stat.color}20`,
                  }}
                >
                  <stat.icon size={28} style={{ color: stat.color }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="text.secondary">
                  {stat.title}
                </Typography>
              </Box>

              {loading ? (
                <Skeleton variant="text" width={120} height={60} />
              ) : (
                getStatValue(stat.key)
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Card sx={{ borderRadius: 3, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <CardContent sx={{ py: 4 }}>
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Welcome to AuditTrail
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            Every change is tracked. Every version is saved. Nothing is ever lost.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Use the sidebar to create tasks, view history, or compare versions.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}