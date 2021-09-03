import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@mui/material/CircularProgress';
import { makeStyles } from '@mui/material/styles';
import Typography from '@mui/material/Typography';

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
