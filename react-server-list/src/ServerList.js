import React from 'react';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import ServerThumbnail from './ServerThumbnail';
import './ServerList.css';

/**
 * @typedef {object} ServerListProps
 * @prop {import('./hub').Server[]} servers
 *
 * @param {ServerListProps} props
 */
function ServerList({ servers }) {
  return (
    <div className="usl-ServerList">
      {servers.length === 0 ? (
        <Typography>
          No servers are currently available.
        </Typography>
      ) : servers.map((server) => (
        <ServerThumbnail
          key={server.url}
          server={server}
          media={server.booth && server.booth.media}
        />
      ))}
    </div>
  );
}

ServerList.propTypes = {
  servers: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default ServerList;
