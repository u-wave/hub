import React from 'react';
import Head from 'next/head';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';

import createUwaveTheme from '../muiTheme';
import AppBar from './AppBar';
import Text from './Text';

const Layout = ({
  children,
  userAgent,
}) => (
  <ThemeProvider theme={createUwaveTheme()}>
    <div className="app">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AppBar />

      <main>
        {children}

        <footer>
          <Text>
            Powered by <a className="now" href="https://now.sh">▲ now</a>
          </Text>
        </footer>
      </main>

      <style jsx global>{`
        body {
          margin: 0;
          font-family: 'open sans', arial;
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

        .now {
          text-decoration: none;
          color: #aaa;
          border-bottom: 1px solid #aaa;
        }
      `}</style>
    </div>
  </ThemeProvider>
);

export default Layout;
