import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, Paper, Box, Typography } from '@mui/material';
import { Home, Edit, History, Settings } from 'lucide-react';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: Home },
  { id: 'editor', label: 'Editor', icon: Edit },
  { id: 'history', label: 'Version History', icon: History },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: { xs: '60px', sm: '240px' },
        height: '100vh',
        borderRadius: 0,
        borderRight: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s',
      }}
    >
      <Box
        sx={{
          p: { xs: 2, sm: 3 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <Edit size={28} color="#632ca6" />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            display: { xs: 'none', sm: 'block' },
          }}
        >
          AuditTrail
        </Typography>
      </Box>

      <List sx={{ flex: 1, pt: 2 }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <ListItem key={item.id} disablePadding sx={{ px: { xs: 1, sm: 2 } }}>
              <ListItemButton
                selected={isActive}
                onClick={() => setCurrentView(item.id)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: { xs: 'auto', sm: 40 }, color: isActive ? 'white' : 'text.secondary' }}>
                  <Icon size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ display: { xs: 'none', sm: 'block' } }}
                  primaryTypographyProps={{
                    fontSize: '0.9rem',
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box
        sx={{
          p: { xs: 1, sm: 2 },
          borderTop: '1px solid',
          borderColor: 'divider',
          display: { xs: 'none', sm: 'block' },
        }}
      >
        <Typography variant="caption" color="text.secondary">
          v1.0.0
        </Typography>
      </Box>
    </Paper>
  );
}
