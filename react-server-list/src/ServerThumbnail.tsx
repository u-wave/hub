import { useCallback, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon';
import ms from 'ms';
import type { Media, Server } from './hub';
import DescriptionDialog from './DescriptionDialog';
import CurrentMedia from './CurrentMedia';
import './ServerThumbnail.css';

const mdiAlert = 'M13 14H11V9H13M13 18H11V16H13M1 21H23L12 2L1 21Z';
const mdiMenu = 'M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z';

const downTimeout = ms('10 minutes');

function WarningIcon(props: SvgIconProps) {
  return (
    <SvgIcon
      {...props} // eslint-disable-line react/jsx-props-no-spreading
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
  return ` This server may be down. It has not responded for ${since}.`;
}

function hasDescription(server: Server): server is { description: string } {
  return typeof server.description === 'string';
}

type ServerThumbnailProps = {
  server: Server,
  media?: Media,
};
function ServerThumbnail({ server, media }: ServerThumbnailProps) {
  const [isOpen, setDescriptionOpen] = useState(false);
  const onOpenDescription = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      event.stopPropagation();
      setDescriptionOpen(true);
    },
    [],
  );
  const onCloseDescription = useCallback(() => {
    setDescriptionOpen(false);
  }, []);

  return (
    <div className="usl-ServerThumbnail">
      <Card>
        <CardContent>
          <div className="usl-ServerThumbnail-header">
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
                onClick={onOpenDescription}
              >
                <SvgIcon>
                  <path d={mdiMenu} />
                </SvgIcon>
              </IconButton>
            )}
          </div>
        </CardContent>

        {media ? (
          <a href={server.url} className="usl-ServerThumbnail-link">
            <CurrentMedia media={media} />
          </a>
        ) : (
          <>
            <a href={server.url} className="usl-ServerThumbnail-link">
              <CardContent className="usl-ServerThumbnail-nobodyPlaying">
                <Typography>Nobody is playing!</Typography>
              </CardContent>
            </a>
            <CardActions className="usl-ServerThumbnail-actions">
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
              {timedOutMessage(ms(server.timeSincePing, { long: true }))}
            </WarningText>
          </CardContent>
        ) : null}

        {hasDescription(server) ? (
          <DescriptionDialog
            server={server}
            isOpen={isOpen}
            onCloseDescription={onCloseDescription}
          />
        ) : null}
      </Card>
    </div>
  );
}

export default ServerThumbnail;
