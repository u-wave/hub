import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import PropTypes from 'prop-types';
import { ThemeProvider } from '@mui/material/styles';
import { CacheProvider } from '@emotion/react';
import styled from '@emotion/styled';
import createCache from '@emotion/cache';
import Typography from '@mui/material/Typography';
import theme from '../muiTheme';
import AppBar from '../components/AppBar';

export const cache = createCache({ key: 'css', prepend: true });

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

export default function App({ Component, pageProps }) {
  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <AppWrapper>
          <AppBar />

          <Main>
            <Component {...pageProps} />
            <Footer>
              <Typography component="p">
                <SourceLink href="https://github.com/u-wave/hub/tree/default/client">view source</SourceLink>
              </Typography>
            </Footer>
          </Main>
        </AppWrapper>
      </ThemeProvider>
    </CacheProvider>
  );
}

App.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
