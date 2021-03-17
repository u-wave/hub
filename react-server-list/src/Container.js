import React from 'react';
import PropTypes from 'prop-types';
import Loading from './Loading';
import ServerList from './ServerList';
import useServers from './useServers';

/**
 * @typedef {object} ContainerProps
 * @prop {string} [hub]
 *
 * @param {ContainerProps} props
 */
function Container({ hub = 'https://announce.u-wave.net/' }) {
  const servers = useServers(hub);

  return servers == null ? (
    <Loading message="Loading available servers..." />
  ) : (
    <ServerList servers={servers} />
  );
}

Container.propTypes = {
  /**
   * URL of the announce server to use to discover üWave servers.
   */
  hub: PropTypes.string,
};

export default Container;
