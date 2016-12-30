import React from 'react';
import fetch from 'isomorphic-fetch';

import ServerThumbnail from '../components/ServerThumbnail';

export default class ServerListing extends React.Component {
  static async getInitialProps() {
    const response = await fetch('http://localhost:6451/')
    const state = await response.json()
    return { servers: state.servers };
  }

  render() {
    return (
      <div className="servers">
        {this.props.servers.map((server) => (
          <ServerThumbnail
            key={server.url}
            server={server}
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
  }
}
