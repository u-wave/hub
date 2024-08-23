import React from 'react';
import PropTypes from 'prop-types';
import './CurrentMedia.css';

/**
 * @typedef {object} CurrentMediaProps
 * @prop {import('./hub').Media} media
 *
 * @param {CurrentMediaProps} props
 */
function CurrentMedia({ media }) {
  return (
    <div className="usl-CurrentMedia">
      <div
        className="usl-CurrentMedia-image"
        style={{ backgroundImage: `url(${JSON.stringify(media.thumbnail)})` }}
      />

      <div className="usl-CurrentMedia-nowPlaying">
        <p className="usl-CurrentMedia-title">
          {media.title}
        </p>
        <p className="usl-CurrentMedia-artist">
          {media.artist}
        </p>
      </div>
    </div>
  );
}

CurrentMedia.propTypes = {
  media: PropTypes.shape({
    thumbnail: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    artist: PropTypes.string.isRequired,
  }).isRequired,
};

export default CurrentMedia;
