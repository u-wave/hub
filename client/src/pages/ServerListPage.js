import React from 'react';
import PropTypes from 'prop-types';
import { loadServers, announceEvents, ServerList } from '@u-wave/react-server-list';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

const HUB_SERVER = process.env.HUB_SERVER;

function addServer(list, update) {
  const servers = list.map((server) => (server.publicKey === update.publicKey ? update : server));
  if (servers.indexOf(update) === -1) {
    servers.unshift(update);
  }
  return servers;
}

export default class ServerListPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      servers: null,
    };

    this.update = this.update.bind(this);
    this.handleUpdate = this.handleUpdate.bind(this);
  }

  componentDidMount() {
    const { servers } = this.state;

    if (!servers) {
      this.update();
    }
    this.events = announceEvents(HUB_SERVER, this.handleUpdate);
  }

  componentWillUnmount() {
    this.events.remove();
  }

  async update() {
    this.setState({
      servers: await loadServers(HUB_SERVER),
    });
  }

  handleUpdate(update) {
    this.setState(({ servers }) => ({
      servers: addServer(servers, update),
    }));
  }

  render() {
    const { servers } = this.state;

    return (
      <Layout>
        {servers == null ? (
          <Loading message="Loading available servers..." />
        ) : (
          <ServerList servers={servers} />
        )}
      </Layout>
    );
  }
}
