import React from 'react';
import Link from 'next/link';
import styled from '@emotion/styled';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';

const LOGO_HEIGHT = 114;
const LOGO_SQUARE_WIDTH = 104;

const Logo = styled.a((props) => ({
  height: 48,
  marginRight: 48,
  [props.theme.breakpoints.down('md')]: {
    width: `${(LOGO_SQUARE_WIDTH * 48) / LOGO_HEIGHT}px`,
    overflow: 'hidden',
    marginRight: 12,
  },
  '& > img': {
    maxHeight: '100%',
  },
}));

function Header() {
  return (
    <AppBar enableColorOnDark elevation={0}>
      <Toolbar>
        <Logo href="https://u-wave.net/">
          <img alt="üWave" src="/logo-white.png" />
        </Logo>
        <Link href="/" passHref>
          <Button variant="text" color="inherit">
            Join
          </Button>
        </Link>
        <Button href="https://u-wave.net/install" variant="text" color="inherit">
          Install
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
