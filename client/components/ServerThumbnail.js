import React from 'react';
import { Card, CardHeader, CardMedia, CardTitle } from 'material-ui/Card';

const overlayContentStyle = {
  background: 'rgba(0, 0, 0, 0.75)',
};

const ServerThumbnail = ({
  server,
  media
}) => (
  <Card className="thumb">
    <a href={server.url}>
      <CardHeader title={server.name} subtitle={server.description} />
      {media && (
        <CardMedia
          overlay={(
            <CardTitle
              title={media.title}
              subtitle={media.artist}
            />
          )}
          overlayContentStyle={overlayContentStyle}
        >
          <img src={media.media.thumbnail} />
        </CardMedia>
      )}
    </a>
    <style jsx>{`
      .thumb {
        width: 360px;
        margin: 0 20px 20px 20px;
      }
    `}</style>
  </Card>
);

export default ServerThumbnail;
