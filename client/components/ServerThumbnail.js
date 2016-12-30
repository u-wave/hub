import React from 'react'

export default ({
  server
}) => (
  <div>
    <header>
      {server.name}
    </header>
    {server.booth && server.booth.media && (
      <figure>
        <img
          src={server.booth.media.media.thumbnail}
          title={`${server.booth.media.artist} - ${server.booth.media.title}`}
        />
      </figure>
    )}
    <style jsx>{`
      div {
        width: 300px;
      }
      header: {
        font-size: 125%;
        border-bottom: 1px solid red;
      }
      figure {
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
