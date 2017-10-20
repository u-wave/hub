import React from 'react';
import fetch from 'isomorphic-fetch';
import ms from 'ms';
import { CircularProgress } from 'material-ui/Progress';
import getUserAgent from '../util/getUserAgent';
import Layout from '../components/Layout';
import Loading from '../components/Loading';
import ServerListing from '../components/ServerListing';

const HUB_SERVER = process.env.HUB_SERVER || 'https://announce.u-wave.net';

const downTimeout = ms('10 minutes');

async function loadServers() {
  const response = await fetch(HUB_SERVER);
  const state = await response.json();
  return state.servers.sort((a, b) => {
    if (a.timeSincePing >= downTimeout) {
      return 1;
    }
    if (b.timeSincePing >= downTimeout) {
      return -1;
    }
    return 0;
  });
}

function addServer(list, update) {
  const servers = list.map((server) => server.publicKey === update.publicKey ? update : server)
  if (servers.indexOf(update) === -1) {
    servers.unshift(update);
  }
  return servers;
}

function announceEvents(notify) {
  const source = new EventSource(`${HUB_SERVER}/events`);

  const listener = (event) => {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (err) {
      return;
    }

    notify(data);
  };
  source.addEventListener('message', listener);

  const remove = () => {
    source.removeEventListener('message', listener);
    source.close();
  };

  return { remove };
}

export default class App extends React.Component {
  static async getInitialProps({ req }) {
    const isExporting = req && !req.headers && typeof navigator === 'undefined';
    return {
      // If we're serving a new request, preload the servers.
      // If we're transitioning on the client, show a loading indicator.
      servers: req && !isExporting ? await loadServers() : null,
      userAgent: getUserAgent(req),
    };
  }

  state = {
    servers: this.props.servers,
  };

  componentDidMount() {
    if (!this.state.servers) {
      this.update();
    }
    this.events = announceEvents(this.handleUpdate);
  }

  componentWillUnmount() {
    this.events.remove();
  }

  update = async () => {
    this.setState({
      servers: await loadServers(),
    });
  };

  handleUpdate = (update) => {
    this.setState(({ servers }) => ({
      servers: addServer(servers, update)
    }));
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
