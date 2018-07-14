import React from 'react'
import Link from 'next/link'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'

const LOGO_HEIGHT = 114
const LOGO_SQUARE_WIDTH = 104

const enhance = withStyles(theme => ({
  logo: {
    height: 48,
    marginRight: 48,
    [theme.breakpoints.down('md')]: {
      width: `${LOGO_SQUARE_WIDTH * 48 / LOGO_HEIGHT}px`,
      overflow: 'hidden',
      marginRight: 12
    }
  },
  logoImg: {
    maxHeight: '100%'
  }
}))

const Header = ({ classes }) => (
  <AppBar elevation={0}>
    <Toolbar>
      <Link href='https://u-wave.net/'>
        <a className={classes.logo}>
          <img src='/static/logo-white.png' className={classes.logoImg} />
        </a>
      </Link>
      <Link href='/' passHref>
        <Button variant='flat'>
          Join
        </Button>
      </Link>
      <Link href='https://u-wave.net/install' passHref>
        <Button variant='flat'>
          Install
        </Button>
      </Link>
    </Toolbar>
  </AppBar>
)

export default enhance(Header)
