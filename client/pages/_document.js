import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { JssProvider, SheetsRegistry } from 'react-jss'
import { manager } from '../components/SSR'

export default class SSRDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheets = new SheetsRegistry()
    const page = renderPage((Page) => (props) => (
      <JssProvider registry={sheets}>
        <Page {...props} />
      </JssProvider>
    ))

    return {
      ...page,
      jss: sheets.toString()
    }
  }

  render () {
    return (
      <html>
        <Head>
          <title>üWave</title>
          <style id='ssr' dangerouslySetInnerHTML={{ __html: this.props.jss || '' }} />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
