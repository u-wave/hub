import 'spinners-react/lib/SpinnerCircular.css';
import { SpinnerCircular } from 'spinners-react';
import * as styles from './Loading.module.css';

type LoadingProps = {
  message: string,
};
function Loading({ message }: LoadingProps) {
  return (
    <div className={styles.root}>
      <SpinnerCircular
        enabled
        size={300}
        color="#9d2053"
        secondaryColor="transparent"
      />
      <p className={styles.label}>
        {message}
      </p>
    </div>
  );
}

export default Loading;
