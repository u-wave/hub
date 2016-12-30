import React from 'react';
import ServerThumbnail from './ServerThumbnail';

const ServerListing = ({
  servers
}) => (
  <div className="servers">
    {servers.map((server) => (
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
