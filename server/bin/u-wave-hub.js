#!/usr/bin/env node

import hub from '@u-wave/hub-server'; // eslint-disable-line import/no-extraneous-dependencies

await hub().listen(process.env.PORT || 6451);
