import React from 'react';
import Markdown from 'react-markdown';
import Layout from '../components/Layout';

const text = `
  üWave is a self-hosted collaborative listening platform. Users take
  turns playing media—songs, talks, gameplay videos, or anything else—from a
  variety of media sources like YouTube and SoundCloud.

  ![Screenshot](/static/screenshot.png)
`;

const Image = props => (
  <img
    style={{ maxWidth: '100%' }}
    alt={props.alt}
    src={props.src}
  />
);

export default class About extends React.Component {
  static async getInitialProps({ req }) {
    return {
      userAgent: req ? req.headers['user-agent'] : navigator.userAgent,
    };
  }

  render() {
    return (
      <Layout userAgent={this.props.userAgent}>
        <div className="about">
          <Markdown
            source={text}
            renderers={{ ...Markdown.renderers, Image }}
          />
        </div>

        <style jsx>{`
          .about {
            width: 800px;
            max-width: 90%;
            font-size: 110%;
            margin: auto;
            color: #ccc;
          }
        `}</style>
      </Layout>
    );
  }
}
