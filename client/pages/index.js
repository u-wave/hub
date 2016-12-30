import React from 'react';
import fetch from 'isomorphic-fetch';

import ServerThumbnail from '../components/ServerThumbnail';

export default class extends React.Component {
  static async getInitialProps() {
    const response = await fetch('http://localhost:6451/')
    const state = await response.json()
    return { servers: state.servers };
  }

  render() {
    return (
      <ul>
        {this.props.servers.map((server) => (
          <ServerThumbnail
            key={server.url}
            server={server}
          />
        ))}
      </ul>
    );
  }
}
