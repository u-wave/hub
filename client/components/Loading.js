import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

const enhance = withStyles({
  root: {
    width: '100%',
    textAlign: 'center',
  },
}, { name: 'Loading' });

const Loading = ({ classes, message }) => (
  <div className={classes.root}>
    <CircularProgress size={300} mode="indeterminate" />
    <Typography>{message}</Typography>
  </div>
);

Loading.propTypes = {
  classes: PropTypes.shape({
    root: PropTypes.string.isRequired,
  }).isRequired,
  message: PropTypes.string.isRequired,
};

export default enhance(Loading);
