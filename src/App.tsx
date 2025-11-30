// src/App.tsx
import { useState } from 'react';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { Toaster } from 'react-hot-toast';

// Your Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import EditorScreen from './components/EditorScreen';
import VersionHistoryScreen from './components/VersionHistoryScreen';
import SettingsScreen from './components/SettingsScreen';

const theme = createTheme({
  palette: {
    primary: {
      main: '#632ca6', // Purple
    },
    secondary: {
      main: '#00b8d9', // Cyan
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  shape: {
    borderRadius: 12,
  },
});

function App() {
  const [currentView, setCurrentView] = useState<'dashboard' | 'editor' | 'history' | 'settings'>('dashboard');
  const [darkMode, setDarkMode] = useState(false);

  const currentTheme = createTheme({
    ...theme,
    palette: {
      ...theme.palette,
      mode: darkMode ? 'dark' : 'light',
      background: {
        default: darkMode ? '#0f172a' : '#f8fafc',
        paper: darkMode ? '#1e293b' : '#ffffff',
      },
    },
  });

  const getPageTitle = (): string => {
    switch (currentView) {
      case 'dashboard':
        return 'Dashboard';
      case 'editor':
        return 'Content Editor';
      case 'history':
        return 'Version History';
      case 'settings':
        return 'Settings';
      default:
        return 'Dashboard';
    }
  };

  // Inside App.tsx → renderContent function
const renderContent = () => {
  switch (currentView) {
    case 'dashboard':
      return <Dashboard />;
    case 'editor':
      return <EditorScreen />;
    case 'history':
      return <VersionHistoryScreen />;
    case 'settings':
      return <SettingsScreen />;
    default:
      // This catches any invalid route (like typing /random in URL if you add routing later)
      return <NotFound />;
  }
};

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <Toaster position="top-right" toastOptions={{ duration: 4000 }} />

      <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
        {/* Sidebar */}
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} darkMode={darkMode} />

        {/* Main Content Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Header */}
          <Header
            title={getPageTitle()}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
          />

          {/* Page Content */}
          <main
            style={{
              flex: 1,
              overflow: 'auto',
              padding: '24px',
              backgroundColor: currentTheme.palette.background.default,
            }}
          >
            {renderContent()}
          </main>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;