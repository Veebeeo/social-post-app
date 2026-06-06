import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1877F2', 
    },
    secondary: {
      main: '#F6B038', 
    },
    background: {
      default: '#F0F2F5', 
      paper: '#FFFFFF',
    },
    text: {
      primary: '#050505',
      secondary: '#8f9298',
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', 
      fontWeight: 600,
      borderRadius: 20,
    }
  },
  shape: {
    borderRadius: 12, 
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          border: '1px solid #E4E6EB',
        }
      }
    }
  }
});

export default theme;