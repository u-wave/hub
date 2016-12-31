import React from 'react';
import ServerThumbnail from './ServerThumbnail';
import Text from './Text';

const ServerListing = ({
  servers
}) => (
  <div className="servers">
    {servers.length === 0 ? (
      <Text>No servers are currently available.</Text>
    ) : servers.map((server) => (
      <ServerThumbnail
        key={server.url}
        server={server}
        media={server.booth && server.booth.media}
      />
    ))}
    <style jsx>{`
      .servers {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-around;
      }
    `}</style>
  </div>
);

export default ServerListing;
