import React from 'react';

export default class extends React.Component {
  async getInitialProps() {
    const servers = fetch('http://localhost:6451/').then((response) => response.json());
    return { servers: await servers };
  }

  render() {
    return (
      <ul>
        {this.props.servers.map((server) => server.title)}
      </ul>
    );
  }
}