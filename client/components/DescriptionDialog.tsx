import React from 'react';
import PropTypes from 'prop-types';
import stripIndent from 'strip-indent';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Loading from './Loading';
import './DescriptionDialog.css';

const Markdown = React.lazy(() => import('react-markdown'));

/**
 * @typedef {object} DescriptionDialogProps
 * @prop {import('./hub').Server & { description: string }} server
 * @prop {boolean} isOpen
 * @prop {() => void} onCloseDescription
 *
 * @param {DescriptionDialogProps} props
 */
function DescriptionDialog({ server, isOpen, onCloseDescription }) {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const contentStyle = {
    width: `${theme.breakpoints.values.sm}px`,
  };

  const loading = (
    <div className="usl-DescriptionDialog-loading" style={contentStyle}>
      <Loading message="Loading description..." />
    </div>
  );

  return (
    <Dialog
      className="usl-DescriptionDialog"
      open={isOpen}
      fullScreen={isFullScreen}
      onClose={onCloseDescription}
    >
      <DialogTitle>
        {server.name}
      </DialogTitle>
      <DialogContent>
        <React.Suspense fallback={loading}>
          <div className="usl-DescriptionDialog-markdown" style={contentStyle}>
            <Markdown>{stripIndent(server.description)}</Markdown>
          </div>
        </React.Suspense>
      </DialogContent>
      <DialogActions>
        <Button
          color="inherit"
          onClick={onCloseDescription}
        >
          Close
        </Button>
        <Button
          color="primary"
          variant="contained"
          href={server.url}
        >
          Join
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DescriptionDialog.propTypes = {
  server: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    url: PropTypes.string,
  }).isRequired,
  isOpen: PropTypes.bool,
  onCloseDescription: PropTypes.func.isRequired,
};

export default DescriptionDialog;
