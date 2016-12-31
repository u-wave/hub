import React from 'react';
import fetch from 'isomorphic-fetch';
import ms from 'ms';
import CircularProgress from 'material-ui/CircularProgress';

import Layout from '../components/Layout';
import Text from '../components/Text';
import ServerListing from '../components/ServerListing';
import { SERVERS_ENDPOINT } from '../config';

async function loadServers() {
  const response = await fetch(SERVERS_ENDPOINT);
  const state = await response.json();
  return state.servers;
}

export default class App extends React.Component {
  static async getInitialProps({ req }) {
    return {
      servers: await loadServers(),
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
          <div className="loading">
            <CircularProgress
              size={300}
              thickness={7}
              mode="indeterminate"
            />
            <Text>Loading available servers...</Text>
            <style jsx>{`
              .loading {
                width: 100%;
                text-align: center;
              }
            `}</style>
          </div>
        ) : (
          <ServerListing servers={this.state.servers} />
        )}
      </Layout>
    );
  }
}
