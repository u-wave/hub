import ServerThumbnail from './ServerThumbnail';
import type { Server } from '../utils/hub';
import * as styles from './ServerList.module.css';

type ServerListProps = {
  servers: Server[],
};
function ServerList({ servers }: ServerListProps) {
  return (
    <div className={styles.root}>
      {servers.length === 0 ? (
        <p className={styles.typography}>
          No servers are currently available.
        </p>
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
