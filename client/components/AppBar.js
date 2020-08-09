import React from 'react';
import Link from 'next/link';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';

const LOGO_HEIGHT = 114;
const LOGO_SQUARE_WIDTH = 104;

const enhance = withStyles((theme) => ({
  logo: {
    height: 48,
    marginRight: 48,
    [theme.breakpoints.down('md')]: {
      width: `${LOGO_SQUARE_WIDTH * 48 / LOGO_HEIGHT}px`,
      overflow: 'hidden',
      marginRight: 12,
    },
  },
  logoImg: {
    maxHeight: '100%',
  },
}));

const Header = ({ classes }) => (
  <AppBar elevation={0}>
    <Toolbar>
      <a href="https://u-wave.net/" className={classes.logo}>
        <img src="/logo-white.png" className={classes.logoImg} />
      </a>
      <Link href="/" passHref>
        <Button variant="text">
          Join
        </Button>
      </Link>
      <Button href="https://u-wave.net/install" variant="text">
        Install
      </Button>
    </Toolbar>
  </AppBar>
);

export default enhance(Header);
