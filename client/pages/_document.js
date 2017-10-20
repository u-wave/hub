import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import { manager } from '../components/SSR'

export default class SSRDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const page = renderPage()
    const jss = manager && manager.sheetsToString()
    return {
      ...page,
      jss,
      styledJsx: flush()
    }
  }

  render () {
    return (
      <html>
        <Head>
          <title>üWave</title>
          <style id='ssr'>{this.props.jss || ''}</style>
          {this.props.styledJsx}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
