#!/usr/bin/env node

import micro from 'micro';
import hub from '@u-wave/hub-server';

micro(hub).listen(process.env.PORT || 6451);
