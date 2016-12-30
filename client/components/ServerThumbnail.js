import React from 'react';
import { Card, CardHeader, CardTitle, CardMedia } from 'material-ui/Card';

const ServerThumbnail = ({
  server,
  media
}) => (
  <Card className="thumb">
    <CardHeader title={server.name} />
    {media && (
      <CardMedia
        overlay={(
          <CardTitle
            title={media.title}
            subtitle={media.artist}
          />
        )}
      >
        <img src={media.media.thumbnail} />
      </CardMedia>
    )}
    <style jsx>{`
      .thumb {
        width: 360px;
      }
    `}</style>
  </Card>
);

export default ServerThumbnail;
