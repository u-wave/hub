import React from 'react';

const Text = ({ children }) => (
  <p>
    {children}

    <style jsx>{`
      p {
        font: 125% 'open sans', arial;
      }
    `}</style>
  </p>
);

export default Text;
