import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SvgIcon from '@mui/material/SvgIcon';
import { intlFormatDistance } from 'date-fns';
import DescriptionDialog from './DescriptionDialog';
import CurrentMedia from './CurrentMedia';
import * as styles from './ServerThumbnail.module.css';
import type { Media, Server } from '../utils/hub';

const mdiAlert = 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z';
const mdiMenu = 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z';

const downTimeout = 600_000; // 10 minutes

function WarningIcon() {
  return (
    <SvgIcon
      style={{
        height: 16,
        width: 16,
        verticalAlign: 'sub',
      }}
    >
      <path d={mdiAlert} />
    </SvgIcon>
  );
}

type WarningTextProps = {
  children: React.ReactNode,
};
function WarningText({ children }: WarningTextProps) {
  return (
    <Typography variant="body1" style={{ color: '#ed404f' }}>
      {children}
    </Typography>
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
      <Card>
        <CardContent>
          <div className={styles.header}>
            <div>
              <Typography variant="h5">
                {server.name}
              </Typography>
              <Typography variant="body2">
                {server.subtitle}
              </Typography>
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
                <SvgIcon>
                  <path d={mdiMenu} />
                </SvgIcon>
              </IconButton>
            )}
          </div>
        </CardContent>

        {media ? (
          <a href={server.url} className={styles.link} aria-label="Join">
            <CurrentMedia media={media} />
          </a>
        ) : (
          <>
            <a href={server.url} className={styles.link}>
              <CardContent className={styles.nobodyPlaying}>
                <Typography>Nobody is playing!</Typography>
              </CardContent>
            </a>
            <CardActions className={styles.actions}>
              <Button
                variant="contained"
                color="primary"
                href={server.url}
              >
                Join
              </Button>
            </CardActions>
          </>
        )}

        {server.timeSincePing >= downTimeout ? (
          <CardContent>
            <WarningText>
              <WarningIcon />
              {timedOutMessage(intlFormatDistance(
                new Date(Date.now() - server.timeSincePing),
                new Date(),
              ))}
            </WarningText>
          </CardContent>
        ) : null}

        {hasDescription(server) ? (
          <DescriptionDialog
            server={server}
            isOpen={isOpen}
            onCloseDescription={() => setDescriptionOpen(false)}
          />
        ) : null}
      </Card>
    </div>
  );
}

export default ServerThumbnail;
