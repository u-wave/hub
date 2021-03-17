import React from 'react';
import PropTypes from 'prop-types';
import stripIndent from 'strip-indent';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
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
    width: `${theme.breakpoints.width('sm')}px`,
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
