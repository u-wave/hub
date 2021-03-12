import React from 'react';
import useSWR from 'swr';
import { loadServers, ServerList } from '@u-wave/react-server-list';
import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

const { HUB_SERVER } = process.env;

function App() {
  const { data, error } = useSWR(HUB_SERVER, loadServers, {
    refreshInterval: 30_000,
  });

  let component = <Loading message="Loading available servers..." />;
  if (error) {
    component = <Loading message={error.message} />;
  }
  if (data) {
    component = <ServerList servers={data} />;
  }

  return (
    <Layout>
      {component}
    </Layout>
  );
}

export default App;
