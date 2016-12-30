import React from 'react'

export default ({
  server
}) => (
  <div className="thumb">
    <header>
      {server.name}
    </header>
    {server.booth && server.booth.media && (
      <div className="media">
        <img
          src={server.booth.media.media.thumbnail}
          title={`${server.booth.media.artist} - ${server.booth.media.title}`}
        />
      </div>
    )}
    <style jsx>{`
      .thumb {
        width: 300px;
      }
      header: {
        font-size: 125%;
        border-bottom: 1px solid red;
      }
      .media {
        width: 100%;
        padding-bottom: 56.25%;
        position: relative;
        overflow: hidden;
      }
      img {
        position: absolute;
        width: 100%;
      }
    `}</style>
  </div>
);
