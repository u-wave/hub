import PropTypes from 'prop-types';
import getContext from 'recompose/getContext';

const enhance = getContext({
  styleManager: PropTypes.object
});
export let manager;

const SSR = ({ styleManager }) => {
  manager = styleManager;
  return null;
};

export default enhance(SSR);
