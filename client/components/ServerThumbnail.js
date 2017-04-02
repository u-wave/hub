import React from 'react';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withProps from 'recompose/withProps';
import { Card, CardContent } from 'material-ui/Card';
import Text from 'material-ui/Text';
import IconButton from 'material-ui/IconButton';
import DescriptionIcon from 'material-ui-icons/Menu';

import DescriptionDialog from './DescriptionDialog';
import CurrentMedia from './ServerMedia';

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
      <CardContent>
        <div className="header">
          <div>
            <Text type="headline">
              {server.name}
            </Text>
            <Text type="body1" secondary>
              {server.subtitle}
            </Text>
          </div>
          <IconButton onClick={onOpenDescription}>
            <DescriptionIcon />
          </IconButton>
        </div>
      </CardContent>

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

      .header {
        display: flex;
        justify-content: space-between;
      }
    `}</style>
  </div>
);

export default enhance(ServerThumbnail);
