import React from 'react';
import fetch from 'isomorphic-fetch';
import ms from 'ms';

import Layout from '../components/Layout';
import ServerListing from '../components/ServerListing';

async function loadServers() {
  const response = await fetch('http://localhost:6451/')
  const state = await response.json()
  return state.servers;
}

export default class App extends React.Component {
  static async getInitialProps() {
    return { servers: await loadServers() };
  }

  state = {
    servers: this.props.servers,
  };

  componentDidMount() {
    if (!this.state.servers) {
      this.update();
    } else {
      this.timer = setTimeout(this.update, ms('20 seconds'));
    }
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
    this.timer = null;
  }

  update = async () => {
    try {
      this.setState({
        servers: await loadServers(),
      });
    } finally {
      this.timer = setTimeout(this.update, ms('20 seconds'));
    }
  };

  render() {
    return (
      <Layout>
        <ServerListing
          servers={this.state.servers}
        />
      </Layout>
    );
  }
}
