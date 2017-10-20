import React from 'react';
import PropTypes from 'prop-types';
import stripIndent from 'strip-indent';
import Markdown from 'react-markdown';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';
import getContext from 'recompose/getContext';

const enhance = getContext({
  isMobile: PropTypes.bool,
});

const DescriptionDialog = ({
  server,
  isMobile,
  isOpen,
  onCloseDescription,
}) => (
  <Dialog
    open={isOpen}
    fullScreen={isMobile}
    onRequestClose={onCloseDescription}
  >
    <DialogTitle>
      {server.name}
    </DialogTitle>
    <DialogContent>
      <div className="markdown">
        <Markdown source={stripIndent(server.description)} />
      </div>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCloseDescription}>
        Close
      </Button>
      <Button
        primary
        raised
        href={server.url}
      >
        Join
      </Button>
    </DialogActions>
    <style jsx>{`
      .markdown {
        color: rgba(255, 255, 255, 0.6);
      }
    `}</style>
  </Dialog>
);

export default enhance(DescriptionDialog);
