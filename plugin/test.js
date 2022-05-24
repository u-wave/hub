'use strict';

const assert = require('assert');

assert.doesNotThrow(() => {
  // Just to make sure it does not crash :)
  // eslint-disable-next-line global-require
  require('./src/plugin');
});
