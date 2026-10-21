import type { Media } from '../utils/hub';
import styles from './CurrentMedia.module.css';

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
