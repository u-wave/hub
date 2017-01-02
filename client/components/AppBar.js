import React from 'react';
import Link from 'next/link';
import router from 'next/router';
import MuiAppBar from 'material-ui/AppBar';
import FlatButton from 'material-ui/FlatButton';

const AppBar = () => (
  <span>
    <MuiAppBar
      iconElementLeft={<span />}
      title={(
        <Link href="/">
          <div className="logo">
            <img src="/static/logo-white.png" />
          </div>
        </Link>
      )}
      iconElementRight={(
        <FlatButton
          label="About"
          href="/about"
          onClick={event => event.preventDefault()}
          onTouchTap={() => router.push('/about')}
        />
      )}
    />
    <style jsx>{`
      .logo {
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
);

export default AppBar;
