import React from 'react';
import Link from 'next/link';
import MuiAppBar from 'material-ui/AppBar';

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
