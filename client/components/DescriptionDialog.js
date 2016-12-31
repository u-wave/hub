import React from 'react';
import stripIndent from 'strip-indent';
import Markdown from 'react-markdown';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';

const dialogStyle = {
  minWidth: 320,
};

const joinLabelStyle = {
  color: 'white',
};

const DescriptionDialog = ({
  server,
  isOpen,
  onCloseDescription,
}) => (
  <Dialog
    title={server.name}
    open={isOpen}
    contentStyle={dialogStyle}
    onRequestClose={onCloseDescription}
    autoScrollBodyContent
    actions={[
      <FlatButton
        key="close"
        label="Close"
        onTouchTap={onCloseDescription}
      />,
      <RaisedButton
        key="join"
        label="Join"
        href={server.url}
        labelStyle={joinLabelStyle}
        primary
      />
    ]}
  >
    <Markdown
      source={stripIndent(server.description)}
    />
  </Dialog>
);

export default DescriptionDialog;
