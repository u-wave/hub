import React from 'react';
import PropTypes from 'prop-types';
import { loadServers, announceEvents, ServerList } from '@u-wave/react-server-list';
import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

const { HUB_SERVER } = process.env;

function addServer(list, update) {
  const servers = list.map((server) => (server.publicKey === update.publicKey ? update : server));
  if (servers.indexOf(update) === -1) {
    servers.unshift(update);
  }
  return servers;
}

export default class App extends React.Component {
  static async getInitialProps({ req }) {
    const isExporting = req && !req.headers && typeof navigator === 'undefined';
    return {
      // If we're serving a new request, preload the servers.
      // If we're transitioning on the client, show a loading indicator.
      servers: req && !isExporting ? await loadServers(HUB_SERVER) : null,
    };
  }

  static propTypes = {
    servers: PropTypes.arrayOf(PropTypes.object).isRequired,
  };

  constructor(props) {
    super(props);

    const { servers } = this.props;

    this.state = {
      servers,
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

  handleUpdate(update) {
    this.setState(({ servers }) => ({
      servers: addServer(servers, update),
    }));
  }

  async update() {
    this.setState({
      servers: await loadServers(),
    });
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
