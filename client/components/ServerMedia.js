import React from 'react';
import { CardMedia, CardTitle } from 'material-ui/Card';

const overlayContentStyle = {
  background: 'rgba(0, 0, 0, 0.75)',
};

const CurrentMedia = ({
  media,
}) => (media ? (
  <CardMedia
    overlay={(
      <CardTitle
        title={media.title}
        subtitle={media.artist}
      />
    )}
    overlayContentStyle={overlayContentStyle}
  >
    <img src={media.thumbnail} />
  </CardMedia>
) : (
  <span />
));

export default CurrentMedia;
