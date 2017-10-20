import React from 'react'
import { CardMedia } from 'material-ui/Card'

const CurrentMedia = ({
  media
}) => (media ? (
  <CardMedia>
    <div
      className='image'
      style={{ backgroundImage: `url(${JSON.stringify(media.thumbnail)})` }}
    />

    <div className='nowPlaying'>
      <p className='title'>{media.title}</p>
      <p className='artist'>{media.artist}</p>
    </div>

    <style jsx>{`
      .image {
        width: 100%;
        padding-bottom: 75%;
        background-color: black;
        background-position: center center;
        background-size: contain;
        background-repeat: no-repeat;
      }

      .nowPlaying {
        box-sizing: border-box;
        position: absolute;
        width: 100%;
        bottom: 0;
        color: white;
        background: rgba(0, 0, 0, 0.75);
        padding: 16px;
        padding-top: 24px;
      }

      .title, .artist {
        margin: 0;
      }

      .title {
        font-size: 150%;
      }
    `}</style>
  </CardMedia>
) : (
  <span />
))

export default CurrentMedia
