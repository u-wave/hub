import React from 'react'
import PropTypes from 'prop-types'
import Head from 'next/head'
import Typography from 'material-ui/Typography'
import ThemeProvider from 'material-ui/styles/MuiThemeProvider'
import { withStyles } from 'material-ui/styles'
import compose from 'recompose/compose'
import withContext from 'recompose/withContext'
import isMobile from 'is-mobile'
import createUwaveTheme from '../muiTheme'
import AppBar from './AppBar'
import SSR from './SSR'

const enhance = compose(
  withContext({
    isMobile: PropTypes.bool
  }, ({ userAgent }) => ({
    isMobile: isMobile(userAgent)
  })),
  withStyles({
    app: {
      background: '#1b1b1b',
      color: '#fff',
      position: 'absolute',
      height: '100%',
      width: '100%',
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
  })
)

const Layout = ({
  classes,
  children
}) => (
  <ThemeProvider theme={createUwaveTheme()}>
    <div className={classes.app}>
      <SSR />

      <Head>
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <style>{`
          body {
            margin: 0;
            font-family: 'open sans', arial, sans-serif;
          }
        `}</style>
      </Head>

      <AppBar />

      <main className={classes.main}>
        {children}

        <footer className={classes.footer}>
          <Typography component="p">
            <a className={classes.src} href='https://github.com/u-wave/hub/tree/master/client'>view source</a>
          </Typography>
        </footer>
      </main>
    </div>
  </ThemeProvider>
)

export default enhance(Layout)
