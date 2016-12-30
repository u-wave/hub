import React from 'react';
import MuiAppBar from 'material-ui/AppBar';

const AppBar = () => (
  <span>
    <MuiAppBar
      title={(
        <div className="logo">
          <img src="/static/logo-white.png" />
        </div>
      )}
    />
    <style jsx>{`
      .logo {
        box-sizing: border-box;
        padding: 7px 0;
        height: 100%;
      }
      .logo img {
        max-height: 100%;
      }
    `}</style>
  </span>
);

export default AppBar;
