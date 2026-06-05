import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    background: {
      default: '#f8f9fa', 
      paper: '#ffffff',
    },
    primary: {
      main: '#007fff', 
    },
    secondary: {
      main: '#e5b842', 
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', 
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12, 
  },
});

export default theme;