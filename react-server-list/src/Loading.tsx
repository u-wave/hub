import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import './Loading.css';

type LoadingProps = {
  message: string,
};
function Loading({ message }: LoadingProps) {
  return (
    <div className="usl-Loading">
      <CircularProgress size={300} variant="indeterminate" />
      <Typography>
        {message}
      </Typography>
    </div>
  );
}

export default Loading;
