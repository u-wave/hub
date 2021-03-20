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
  const { data, error } = useServers(hub);

  if (error) {
    return <Loading message={error.message} />;
  }
  if (data) {
    return <ServerList servers={data} />;
  }

  return <Loading message="Loading available servers..." />;
}

Container.propTypes = {
  /**
   * URL of the announce server to use to discover üWave servers.
   */
  hub: PropTypes.string,
};

export default Container;
