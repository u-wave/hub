import React from 'react';
import Head from 'next/head';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import injectTapEventPlugin from 'react-tap-event-plugin';

import uwaveTheme from '../muiTheme';
import AppBar from './AppBar';

if (typeof document !== 'undefined') {
  injectTapEventPlugin();
}

const Layout = ({
  children,
  userAgent,
}) => (
  <ThemeProvider
    muiTheme={getMuiTheme({
      ...uwaveTheme,
      userAgent,
    })}
  >
    <div className="app">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <AppBar />

      <div className="main">
        {children}
      </div>

      <style jsx global>{`
        body {
          margin: 0;
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

        .main {
          position: absolute;
          padding-top: 20px;
          top: 64px;
          bottom: 0;
          right: 0;
          left: 0;
          overflow-y: auto;
        }
      `}</style>
    </div>
  </ThemeProvider>
);

export default Layout;
