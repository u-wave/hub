import React from 'react';

const Text = ({ children }) => (
  <p>
    {children}

    <style jsx>{`
      p {
        font-size: 125%;
      }
    `}</style>
  </p>
);

export default Text;
