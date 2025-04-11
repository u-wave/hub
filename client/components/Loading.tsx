import styles from './Loading.module.css';

type LoadingProps = {
  message: string,
};
function Loading({ message }: LoadingProps) {
  return (
    <div className={styles.root}>
      <svg fill="none" className={styles.spinner} viewBox="0 0 66 66">
        <circle
          className={styles.spinnerFill}
          cx="33"
          cy="33"
          fill="none"
          r="28"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      <p className={styles.label}>
        {message}
      </p>
    </div>
  );
}

export default Loading;
