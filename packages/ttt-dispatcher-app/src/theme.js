import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    useNextVariants: true,
  },
  palette: {
    mode: 'dark',
    primary: { 
      main: 'rgb(10, 249, 78)' 
    },
    secondary: {
      main: 'rgb(31, 121, 255)'
    }
  },
  background: {
    default: 'rgb(12, 15, 21)'
  },
});

export default theme;
