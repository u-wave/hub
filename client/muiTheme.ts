import { createTheme } from '@mui/material/styles';

export default createTheme({
  palette: {
    mode: 'dark',
    primary: {
      light: '#b20062',
      main: '#9d2053',
      contrastText: '#fff',
    },
    background: {
      paper: '#303030',
    },
  },
  typography: {
    fontFamily: '"Open Sans", Roboto, Arial, sans-serif',
  },
});
