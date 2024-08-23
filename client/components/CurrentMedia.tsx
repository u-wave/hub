import './CurrentMedia.css';
import type { Media } from './hub';

type CurrentMediaProps = {
  media: Media,
};
function CurrentMedia({ media }: CurrentMediaProps) {
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

export default CurrentMedia;
