import { Paper, Box, Typography, Switch, FormControlLabel, Button, Divider } from '@mui/material';


export default function SettingsScreen() {

  return (
    <Box sx={{ maxWidth: '800px', margin: '0 auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 4 },
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        
        <Box>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 600 }}>
            About
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            <strong>AuditTrail</strong> - Mini Audit Trail Generator
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Version: 1.0.0
          </Typography>
          <Typography variant="body2" color="text.secondary">
            A professional tool for tracking content changes and maintaining complete version history with detailed audit trails.
          </Typography>
        </Box>
      </Paper>

      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.default',
        }}
      >
        <Typography variant="body2" color="text.secondary">
          <strong>Note:</strong> All settings are saved locally in your browser. Clearing browser data will reset these preferences.
        </Typography>
      </Paper>
    </Box>
  );
}
