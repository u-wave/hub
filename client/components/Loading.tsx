import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import * as styles from './Loading.module.css';

type LoadingProps = {
  message: string,
};
function Loading({ message }: LoadingProps) {
  return (
    <div className={styles.root}>
      <CircularProgress size={300} variant="indeterminate" />
      <Typography>
        {message}
      </Typography>
    </div>
  );
}

export default Loading;
