import React from 'react'
import Link from 'next/link'
import MuiAppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
import { withStyles } from 'material-ui/styles'

const enhance = withStyles({
  gutter: {
    flex: 0.1
  },
  logo: {
    flex: 1,
    boxSizing: 'border-box',
    padding: '7px 0',
    height: 64,
    textAlign: 'center'
  },
  logoImg: {
    maxHeight: '100%'
  }
}, { name: 'AppBar' })

const AppBar = ({ classes }) => (
  <span>
    <MuiAppBar>
      <Toolbar>
        <div className={classes.gutter} />
        <Link href='/'>
          <div className={classes.logo}>
            <img className={classes.logoImg} src='/static/logo-white.png' />
          </div>
        </Link>
        <Button
          contrast
          className={classes.gutter}
          href='https://u-wave.net'
        >
          About
        </Button>
      </Toolbar>
    </MuiAppBar>
  </span>
)

export default enhance(AppBar)
