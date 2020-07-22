import React from 'react'
import Head from 'next/head'
import Typography from '@material-ui/core/Typography'
import { MuiThemeProvider, makeStyles } from '@material-ui/core/styles'
import theme from '../muiTheme'
import AppBar from './AppBar'

const useStyles = makeStyles({
  app: {
    background: '#1b1b1b',
    color: '#fff',
    position: 'absolute',
    height: '100%',
    width: '100%'
  },
  main: {
    position: 'absolute',
    paddingTop: 20,
    top: 64,
    bottom: 0,
    right: 0,
    left: 0,
    overflowY: 'auto'
  },
  footer: {
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 50,
    color: '#777'
  },
  src: {
    textDecoration: 'none',
    color: '#aaa',
    borderBottom: '1px solid #aaa'
  }
}, { name: 'Layout' })

const globalCss = `
  body {
    margin: 0;
    font-family: 'open sans', arial, sans-serif;
  }
`

function LayoutElements ({ children }) {
  const classes = useStyles()

  return (
    <div className={classes.app}>
      <Head>
        <title>üWave</title>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style dangerouslySetInnerHTML={{ __html: globalCss }} />
      </Head>

      <AppBar />

      <main className={classes.main}>
        {children}

        <footer className={classes.footer}>
          <Typography component='p'>
            <a className={classes.src} href='https://github.com/u-wave/hub/tree/master/client'>view source</a>
          </Typography>
        </footer>
      </main>
    </div>
  )
}

function Layout ({ children }) {
  return (
    <MuiThemeProvider theme={theme}>
      <LayoutElements>
        {children}
      </LayoutElements>
    </MuiThemeProvider>
  )
}

export default Layout
