import React from 'react';
import stripIndent from 'strip-indent';
import Markdown from 'react-markdown';
import Button from 'material-ui/Button';
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
      <Button
        key="close"
        label="Close"
        onTouchTap={onCloseDescription}
      />,
      <Button
        key="join"
        raised
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
