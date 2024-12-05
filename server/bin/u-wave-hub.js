#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
import hub from '@u-wave/hub-server';

await hub().listen({
  port: Number(process.env.PORT || 6451),
});
