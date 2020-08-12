import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles({
  root: {
    width: '100%',
    textAlign: 'center',
  },
}, { name: 'Loading' });

function Loading({ message }) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CircularProgress size={300} mode="indeterminate" />
      <Typography>{message}</Typography>
    </div>
  );
}

Loading.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Loading;
