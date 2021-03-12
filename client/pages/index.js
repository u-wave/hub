import React from 'react';
import PropTypes from 'prop-types';
import useSWR from 'swr';
import { loadServers, ServerList } from '@u-wave/react-server-list';
import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

const { HUB_SERVER } = process.env;

function App() {
  const { data, error } = useSWR(HUB_SERVER, loadServers);

  return (
    <Layout>
      {!data ? (
        <Loading message="Loading available servers..." />
      ) : (
        <ServerList servers={data} />
      )}
    </Layout>
  );
}

export default App;
