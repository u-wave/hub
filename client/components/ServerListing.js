import React from 'react';
import ServerThumbnail from './ServerThumbnail';

const ServerListing = ({
  servers
}) => (
  <div className="servers">
    {servers.length === 0 ? (
      <p className="empty">
        No servers are currently available.
      </p>
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

      .empty {
        font: 125% 'open sans', arial;
      }
    `}</style>
  </div>
);

export default ServerListing;
