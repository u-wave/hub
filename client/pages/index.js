import React from 'react';
import fetch from 'isomorphic-fetch';
import AppBar from 'material-ui/AppBar';
import ThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';

import uwaveTheme from '../muiTheme';
import ServerThumbnail from '../components/ServerThumbnail';

const ServerListing = ({
  servers
}) => (
  <div className="servers">
    {servers.map((server) => (
      <ServerThumbnail
        key={server.url}
        server={server}
        media={server.booth && server.booth.media}
      />
    ))}
    <style jsx>{`
      .servers {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    `}</style>
  </div>
);

export default class App extends React.Component {
  static async getInitialProps() {
    const response = await fetch('http://localhost:6451/')
    const state = await response.json()
    return { servers: state.servers };
  }

  render() {
    return (
      <ThemeProvider muiTheme={getMuiTheme(uwaveTheme)}>
        <div className="app">
          <AppBar title="üWave" />

          <div className="main">
            <ServerListing servers={this.props.servers} />
          </div>

          <style jsx global>{`
            body {
              margin: 0;
            }
          `}</style>
          <style jsx>{`
            .app {
              background: #303030;
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
  }
}
