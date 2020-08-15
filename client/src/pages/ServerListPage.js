import React from 'react';
import PropTypes from 'prop-types';
import { Container as ServerList } from '@u-wave/react-server-list';
import '@u-wave/react-server-list/dist/u-wave-react-server-list.css';
import Layout from '../components/Layout';
import Loading from '../components/Loading';

const HUB_SERVER = process.env.HUB_SERVER;

function ServerListPage() {
  return (
    <Layout>
      <ServerList hub={HUB_SERVER} />
    </Layout>
  );
}

export default ServerListPage;
