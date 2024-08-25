import { useState } from 'react';
import { mdiAlert, mdiMenu } from '@mdi/js';
import Icon from '@mdi/react';
import { intlFormatDistance } from 'date-fns';
import DescriptionDialog from './DescriptionDialog';
import CurrentMedia from './CurrentMedia';
import styles from './ServerThumbnail.module.css';
import type { Media, Server } from '../utils/hub';

const downTimeout = 600_000; // 10 minutes

function IconButton(props: React.ComponentPropsWithoutRef<'button'>) {
  return (
    <button type="button" className={styles.iconButton} {...props} />
  )
}

function WarningIcon() {
  return (
    <Icon size={1} style={{ verticalAlign: 'sub' }} path={mdiAlert} />
  );
}

type WarningTextProps = {
  children: React.ReactNode,
};
function WarningText({ children }: WarningTextProps) {
  return (
    <p className={styles.warning}>
      {children}
    </p>
  );
}

function timedOutMessage(since: string) {
  return ` This server may be down. It has not responded since ${since}.`;
}

function hasDescription(server: Server): server is Server & { description: string } {
  return typeof server.description === 'string';
}

type ServerThumbnailProps = {
  server: Server,
  media?: Media | null,
};
function ServerThumbnail({ server, media }: ServerThumbnailProps) {
  const [isOpen, setDescriptionOpen] = useState(false);

  return (
    <div className={styles.root}>
      <div className={styles.header}>
        <div>
          <h5 className={styles.title}>
            {server.name}
          </h5>
          <p className={styles.subtitle}>
            {server.subtitle}
          </p>
        </div>
        {server.description && (
          <IconButton
            aria-label={`View description for ${server.name}`}
            onClick={(event) => {
              event.preventDefault();
              event.stopPropagation();
              setDescriptionOpen(true);
            }}
          >
            <Icon size={1} path={mdiMenu} />
          </IconButton>
        )}
      </div>

      {media ? (
        <a href={server.url} className={styles.link} aria-label="Join">
          <CurrentMedia media={media} />
        </a>
      ) : (
        <>
          <a href={server.url} className={styles.nobodyPlaying}>
            Nobody is playing!
          </a>
          <div className={styles.actions}>
            <a href={server.url} className={styles.joinButton}>
              Join
            </a>
          </div>
        </>
      )}

      {server.timeSincePing >= downTimeout ? (
        <WarningText>
          <WarningIcon />
          {timedOutMessage(intlFormatDistance(
            new Date(Date.now() - server.timeSincePing),
            new Date(),
          ))}
        </WarningText>
      ) : null}

      {hasDescription(server) ? (
        <DescriptionDialog
          server={server}
          isOpen={isOpen}
          onCloseDescription={() => setDescriptionOpen(false)}
        />
      ) : null}
    </div>
  );
}

export default ServerThumbnail;
