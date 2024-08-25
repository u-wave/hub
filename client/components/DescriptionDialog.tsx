import React from 'react';
import stripIndent from 'strip-indent';
import Dialog from '@mui/material/Dialog';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Loading from './Loading';
import * as styles from './DescriptionDialog.module.css';
import type { Server } from '../utils/hub';

const Markdown = React.lazy(() => import('react-markdown'));

type DescriptionDialogProps = {
  server: Server & { description: string },
  isOpen: boolean,
  onCloseDescription: () => void,
};
function DescriptionDialog({ server, isOpen, onCloseDescription }: DescriptionDialogProps) {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const contentStyle = {
    width: `${theme.breakpoints.values.sm}px`,
  };

  const loading = (
    <div className={styles.loading} style={contentStyle}>
      <Loading message="Loading description..." />
    </div>
  );

  return (
    <Dialog open={isOpen} fullScreen={isFullScreen} onClose={onCloseDescription}>
      <h2 className={styles.title}>
        {server.name}
      </h2>
      <div className={styles.content}>
        <React.Suspense fallback={loading}>
          <div className={styles.markdown} style={contentStyle}>
            <Markdown>{stripIndent(server.description)}</Markdown>
          </div>
        </React.Suspense>
      </div>
      <div className={styles.actions}>
        <button onClick={onCloseDescription} className={styles.closeButton}>
          Close
        </button>
        <a href={server.url} className={styles.joinButton}>
          Join
        </a>
      </div>
    </Dialog>
  );
}

export default DescriptionDialog;
