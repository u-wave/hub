import * as styles from './CurrentMedia.module.css';
import type { Media } from '../utils/hub';

type CurrentMediaProps = {
  media: Media,
};
function CurrentMedia({ media }: CurrentMediaProps) {
  return (
    <div className={styles.root}>
      <div
        className={styles.image}
        style={{ backgroundImage: `url(${JSON.stringify(media.thumbnail)})` }}
      />

      <div className={styles.nowPlaying}>
        <p className={styles.title}>
          {media.title}
        </p>
        <p className={styles.artist}>
          {media.artist}
        </p>
      </div>
    </div>
  );
}

export default CurrentMedia;
