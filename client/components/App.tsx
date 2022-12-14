import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import { ThemeProvider } from '@mui/material/styles';
import styled from '@emotion/styled';
import Typography from '@mui/material/Typography';
import { Container } from '@u-wave/react-server-list';
import theme from '../muiTheme';
import AppBar from './AppBar';

const { VITE_HUB_SERVER } = import.meta.env;

const AppWrapper = styled.div({
  background: '#1b1b1b',
  color: '#fff',
  position: 'absolute',
  height: '100%',
  width: '100%',
});

const Main = styled.main({
  position: 'absolute',
  paddingTop: 20,
  top: 64,
  bottom: 0,
  right: 0,
  left: 0,
  overflowY: 'auto',
});

const Footer = styled.footer({
  fontFamily: 'monospace',
  textAlign: 'center',
  marginTop: 50,
  color: '#777',
});

const SourceLink = styled.a({
  textDecoration: 'none',
  color: '#aaa',
  borderBottom: '1px solid #aaa',
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppWrapper>
        <AppBar />

        <Main>
          <Container hub={VITE_HUB_SERVER} />
          <Footer>
            <Typography component="p">
              <SourceLink href="https://github.com/u-wave/hub/tree/default/client">view source</SourceLink>
            </Typography>
          </Footer>
        </Main>
      </AppWrapper>
    </ThemeProvider>
  );
}

export default App;
