import Typography from '@mui/material/Typography';
import ServerThumbnail from './ServerThumbnail';
import type { Server } from './hub';
import * as styles from './ServerList.module.css';

type ServerListProps = {
  servers: Server[],
};
function ServerList({ servers }: ServerListProps) {
  return (
    <div className={styles.root}>
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

export default ServerList;
