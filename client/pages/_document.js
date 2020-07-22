import React from 'react'
import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheets } from '@material-ui/core/styles'

export default class SSRDocument extends Document {
  static async getInitialProps (ctx) {
    // Render app and page and get the context of the page with collected side effects.
    const sheets = new ServerStyleSheets()

    const initialProps = await Document.getInitialProps({
      ...ctx,
      renderPage: () => ctx.renderPage({
        enhanceApp: App => props => sheets.collect(<App {...props} />)
      })
    })

    return {
      ...initialProps,
      // Styles fragment is rendered after the app and page rendering finish.
      styles: [
        <React.Fragment key='styles'>
          {initialProps.styles}
          {sheets.getStyleElement()}
        </React.Fragment>
      ]
    }
  }

  render () {
    return (
      <html>
        <Head>
          {this.props.styles}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}
