// src/components/NotFound.tsx
import { Box, Typography, Button } from '@mui/material';
import { Home, AlertTriangle } from 'lucide-react';


export default function NotFound() {
  
  const goHome = () => {
    window.location.href = '/'; 
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        px: 3,
      }}
    >
      <AlertTriangle size={80} color="#ef4444" style={{ marginBottom: 24 }} />

      <Typography variant="h3" fontWeight={700} gutterBottom>
        404 - Page Not Found
      </Typography>

      <Typography variant="h6" color="text.secondary" sx={{ mb: 4, maxWidth: 600 }}>
        Oops! The page you're looking for doesn't exist or has been moved.
      </Typography>

      <Button
        variant="contained"
        size="large"
        startIcon={<Home size={20} />}
        onClick={goHome}
        sx={{
          borderRadius: 3,
          textTransform: 'none',
          px: 4,
          py: 1.5,
          fontSize: '1.1rem',
        }}
      >
        Back to Dashboard
      </Button>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 6 }}>
        AuditTrail • Mini Audit Trail Generator
      </Typography>
    </Box>
  );
}