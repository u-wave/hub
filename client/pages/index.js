import React from 'react';
import fetch from 'isomorphic-fetch';
import ms from 'ms';
import { CircularProgress } from 'material-ui/Progress';

import Layout from '../components/Layout';
import Loading from '../components/Loading';
import ServerListing from '../components/ServerListing';

const HUB_SERVER = process.env.HUB_SERVER || 'https://announce.u-wave.net';

async function loadServers() {
  const response = await fetch(HUB_SERVER);
  const state = await response.json();
  return state.servers;
}

export default class App extends React.Component {
  static async getInitialProps({ req }) {
    return {
      // If we're serving a new request, preload the servers.
      // If we're transitioning on the client, show a loading indicator.
      servers: req ? await loadServers() : null,
      userAgent: req ? req.headers['user-agent'] : navigator.userAgent,
    };
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
      <Layout userAgent={this.props.userAgent}>
        {this.state.servers == null ? (
          <Loading message="Loading available servers..." />
        ) : (
          <ServerListing servers={this.state.servers} />
        )}
      </Layout>
    );
  }
}
