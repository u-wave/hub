import React from 'react'
import Link from 'next/link'
import router from 'next/router'
import MuiAppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'

const AppBar = () => (
  <span>
    <MuiAppBar>
      <Toolbar>
        <div className='gutter' />
        <Link href='/'>
          <div className='logo'>
            <img src='/static/logo-white.png' />
          </div>
        </Link>
        <Button
          contrast
          className='gutter'
          href='/about'
          onClick={(event) => {
            event.preventDefault()
            router.push('/about')
          }}
        >
          About
        </Button>
      </Toolbar>
    </MuiAppBar>
    <style jsx>{`
      .gutter {
        flex: 0.1;
      }
      .logo {
        flex: 1;
        box-sizing: border-box;
        padding: 7px 0;
        height: 100%;
        text-align: center;
      }
      .logo img {
        max-height: 100%;
      }
    `}</style>
  </span>
)

export default AppBar
