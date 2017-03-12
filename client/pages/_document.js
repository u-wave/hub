import React from 'react';
import Document, { Head, Main, NextScript } from 'next/document'
import flush from 'styled-jsx/server'
import { manager } from '../components/SSR'

export default class SSRDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const page = renderPage();
    const jss = manager.sheetsToString();
    return {
      ...page,
      jss,
      styledJsx: flush()
    };
  }

  render () {
    return (
      <html>
        <Head>
          <title>My page</title>
          <style id="ssr">{this.props.jss}</style>
          <style>{this.props.styledJsx}</style>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
