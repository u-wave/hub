import React from 'react';
import stripIndent from 'strip-indent';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
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
      <DialogTitle>
        {server.name}
      </DialogTitle>
      <DialogContent>
        <React.Suspense fallback={loading}>
          <div className={styles.markdown} style={contentStyle}>
            <Markdown>{stripIndent(server.description)}</Markdown>
          </div>
        </React.Suspense>
      </DialogContent>
      <DialogActions>
        <button onClick={onCloseDescription} className={styles.closeButton}>
          Close
        </button>
        <a href={server.url} className={styles.joinButton}>
          Join
        </a>
      </DialogActions>
    </Dialog>
  );
}

export default DescriptionDialog;
