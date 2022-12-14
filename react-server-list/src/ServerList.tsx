import Typography from '@mui/material/Typography';
import type { Server } from './hub';
import ServerThumbnail from './ServerThumbnail';
import './ServerList.css';

export type ServerListProps = {
  servers: Server[],
};
function ServerList({ servers }: ServerListProps) {
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
          media={server.booth?.media}
        />
      ))}
    </div>
  );
}

export default ServerList;
