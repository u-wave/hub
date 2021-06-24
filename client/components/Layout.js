import React from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from '@emotion/styled';
import Typography from '@material-ui/core/Typography';
import { ThemeProvider } from '@material-ui/core/styles';
import theme from '../muiTheme';
import AppBar from './AppBar';

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

const globalCss = `
  body {
    margin: 0;
    font-family: 'open sans', arial, sans-serif;
  }
`;

function LayoutElements({ children }) {
  return (
    <AppWrapper>
      <Head>
        <title>üWave</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      </Head>

      <AppBar />

      <Main>
        {children}

        <Footer>
          <Typography component="p">
            <SourceLink href="https://github.com/u-wave/hub/tree/default/client">view source</SourceLink>
          </Typography>
        </Footer>
      </Main>
    </AppWrapper>
  );
}

LayoutElements.propTypes = {
  children: PropTypes.element.isRequired,
};

function Layout({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <LayoutElements>
        {children}
      </LayoutElements>
    </ThemeProvider>
  );
}

Layout.propTypes = {
  children: PropTypes.element.isRequired,
};

export default Layout;
