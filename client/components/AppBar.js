'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styled from '@emotion/styled';
import { ThemeProvider } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import theme from '../muiTheme';
import logo from '../public/logo-white.png';

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
    <ThemeProvider theme={theme}>
      <AppBar enableColorOnDark elevation={0}>
        <Toolbar>
          <Logo href="https://u-wave.net/">
            <Image alt="üWave" src={logo} height={48} />
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
    </ThemeProvider>
  );
}

export default Header;
