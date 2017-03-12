import React from 'react';
import stripIndent from 'strip-indent';
import Markdown from 'react-markdown';
import Button from 'material-ui/Button';
import Dialog, { DialogTitle, DialogContent, DialogActions } from 'material-ui/Dialog';

const DescriptionDialog = ({
  server,
  isOpen,
  onCloseDescription,
}) => (
  <Dialog
    open={isOpen}
    onRequestClose={onCloseDescription}
  >
    <DialogTitle>
      {server.name}
    </DialogTitle>
    <DialogContent>
      <Markdown
        source={stripIndent(server.description)}
      />
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
  </Dialog>
);

export default DescriptionDialog;
