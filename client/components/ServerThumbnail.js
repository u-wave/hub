import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withProps from 'recompose/withProps';
import { Card, CardHeader } from 'material-ui/Card';
import IconButton from 'material-ui/IconButton';
import DescriptionIcon from 'material-ui/svg-icons/navigation/more-vert';

import DescriptionDialog from './DescriptionDialog';
import CurrentMedia from './ServerMedia';

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const headerContentStyle = {
  paddingRight: 0,
};

const descriptionIconStyle = {
  width: 40,
  height: 40,
  padding: 4,
};

const enhance = compose(
  withState('isOpen', 'setDescriptionOpen', false),
  withProps(({ setDescriptionOpen }) => ({
    onOpenDescription: (event) => {
      event.preventDefault();
      event.stopPropagation();
      setDescriptionOpen(true);
    },
    onCloseDescription: () => setDescriptionOpen(false),
  }))
);

const ServerThumbnail = ({
  server,
  media,
  isOpen,
  onOpenDescription,
  onCloseDescription,
}) => (
  <div className="thumb">
    <Card>
      <CardHeader
        style={headerStyle}
        textStyle={headerContentStyle}
        title={server.name}
        subtitle={server.subtitle}
      >
        <IconButton
          style={descriptionIconStyle}
          onTouchTap={onOpenDescription}
        >
          <DescriptionIcon />
        </IconButton>
      </CardHeader>

      <a href={server.url}>
        <CurrentMedia media={media} />
      </a>

      <DescriptionDialog
        server={server}
        isOpen={isOpen}
        onCloseDescription={onCloseDescription}
      />
    </Card>
    <style jsx>{`
      .thumb {
        width: 360px;
        margin: 0 20px 20px 20px;
      }
    `}</style>
  </div>
);

export default enhance(ServerThumbnail);
