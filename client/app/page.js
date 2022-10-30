'use client';

import { ThemeProvider } from '@mui/material/styles';
import { Container } from '@u-wave/react-server-list';
import theme from '../muiTheme';

const { HUB_SERVER } = process.env;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Container hub={HUB_SERVER} />
    </ThemeProvider>
  );
}

export default App;
