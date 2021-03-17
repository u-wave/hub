import React from 'react';
import PropTypes from 'prop-types';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import './Loading.css';

/**
 * @typedef {object} LoadingProps
 * @prop {string} message
 *
 * @param {LoadingProps} props
 */
function Loading({ message }) {
  return (
    <div className="usl-Loading">
      <CircularProgress size={300} variant="indeterminate" />
      <Typography>
        {message}
      </Typography>
    </div>
  );
}

Loading.propTypes = {
  message: PropTypes.string,
};

export default Loading;
