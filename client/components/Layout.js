import React from 'react';
import Head from 'next/head';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import withContext from 'recompose/withContext';
import isMobile from 'is-mobile';

import createUwaveTheme from '../muiTheme';
import AppBar from './AppBar';
import Text from './Text';
import SSR from './SSR';

const enhance = withContext({
  isMobile: React.PropTypes.bool,
}, ({ userAgent }) => ({
  isMobile: isMobile(userAgent),
}));

const Layout = ({ children }) => (
  <ThemeProvider theme={createUwaveTheme()}>
    <div className="app">
      <SSR />

      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AppBar />

      <main>
        {children}

        <footer>
          <Text>
            <a className="src" href="https://github.com/u-wave/hub/tree/master/client">view source</a>
          </Text>
        </footer>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'open sans', arial, sans-serif;
        }
      `}</style>

      <style jsx>{`
        .app {
          background: #1b1b1b;
          color: #fff;
          position: absolute;
          height: 100%;
          width: 100%;
        }

        main {
          position: absolute;
          padding-top: 20px;
          top: 64px;
          bottom: 0;
          right: 0;
          left: 0;
          overflow-y: auto;
        }

        footer {
          font-family: monospace;
          text-align: center;
          margin-top: 50px;
          color: #777;
        }

        .src {
          text-decoration: none;
          color: #aaa;
          border-bottom: 1px solid #aaa;
        }
      `}</style>
    </div>
  </ThemeProvider>
);

export default enhance(Layout);
