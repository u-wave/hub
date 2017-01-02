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
    <div
      className="image"
      style={{ backgroundImage: `url(${JSON.stringify(media.thumbnail)})` }}
    />

    <style jsx>{`
      .image {
        width: 100%;
        padding-bottom: 75%;
        background-color: black;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
      }
    `}</style>
  </CardMedia>
) : (
  <span />
));

export default CurrentMedia;
