import React from 'react';
import { Card, CardHeader, CardMedia, CardTitle } from 'material-ui/Card';

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
        >
          <img src={media.media.thumbnail} />
        </CardMedia>
      )}
    </a>
    <style jsx>{`
      .thumb {
        width: 360px;
      }
    `}</style>
  </Card>
);

export default ServerThumbnail;
