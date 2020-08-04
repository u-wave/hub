#!/usr/bin/env node

const micro = require('micro')
const hub = require('../')

micro(hub).listen(process.env.PORT || 6451)
