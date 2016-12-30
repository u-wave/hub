#!/usr/bin/env node

const hub = require('../');

hub().listen(process.env.PORT || 6451);
