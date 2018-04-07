import React from 'react'
import Markdown from 'react-markdown'
import { withStyles } from 'material-ui/styles'
import getUserAgent from '../util/getUserAgent'
import Layout from '../components/Layout'

const text = `
  üWave is a self-hosted collaborative listening platform. Users take
  turns playing media—songs, talks, gameplay videos, or anything else—from a
  variety of media sources like YouTube and SoundCloud.

  ![Screenshot](/static/screenshot.png)
`

const Image = props => (
  <img
    style={{ maxWidth: '100%' }}
    alt={props.alt}
    src={props.src}
  />
)

const enhance = withStyles({
  about: {
    width: 800,
    maxWidth: '90%',
    fontSize: '110%',
    margin: 'auto',
    color: '#ccc'
  }
}, { name: 'About' })

class About extends React.Component {
  static async getInitialProps ({ req }) {
    return {
      userAgent: getUserAgent(req)
    }
  }

  render () {
    const { classes, userAgent } = this.props
    return (
      <Layout userAgent={userAgent}>
        <div className={classes.about}>
          <Markdown
            source={text}
            renderers={{ image: Image }}
          />
        </div>
      </Layout>
    )
  }
}

export default enhance(About)
