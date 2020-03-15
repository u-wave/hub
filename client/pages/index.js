import React from 'react'
import { loadServers, announceEvents, ServerList } from '@u-wave/react-server-list'
import getUserAgent from '../util/getUserAgent'
import Layout from '../components/Layout'
import Loading from '../components/Loading'

const HUB_SERVER = process.env.HUB_SERVER

function addServer (list, update) {
  const servers = list.map((server) => server.publicKey === update.publicKey ? update : server)
  if (servers.indexOf(update) === -1) {
    servers.unshift(update)
  }
  return servers
}

export default class App extends React.Component {
  static async getInitialProps ({ req }) {
    const isExporting = req && !req.headers && typeof navigator === 'undefined'
    return {
      // If we're serving a new request, preload the servers.
      // If we're transitioning on the client, show a loading indicator.
      servers: req && !isExporting ? await loadServers(HUB_SERVER) : null,
      userAgent: getUserAgent(req)
    }
  }

  constructor (props) {
    super(props)

    this.state = {
      servers: this.props.servers
    }

    this.update = this.update.bind(this)
    this.handleUpdate = this.handleUpdate.bind(this)
  }

  componentDidMount () {
    if (!this.state.servers) {
      this.update()
    }
    this.events = announceEvents(HUB_SERVER, this.handleUpdate)
  }

  componentWillUnmount () {
    this.events.remove()
  }

  async update () {
    this.setState({
      servers: await loadServers()
    })
  }

  handleUpdate (update) {
    this.setState(({ servers }) => ({
      servers: addServer(servers, update)
    }))
  };

  render () {
    return (
      <Layout userAgent={this.props.userAgent}>
        {this.state.servers == null ? (
          <Loading message='Loading available servers...' />
        ) : (
          <ServerList servers={this.state.servers} />
        )}
      </Layout>
    )
  }
}
