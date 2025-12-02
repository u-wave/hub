#!/usr/bin/env node

// eslint-disable-next-line import/no-extraneous-dependencies
import hub from '@u-wave/hub-server';

let store;
if (process.env.SQLITE_PATH) {
  store = `sqlite:${process.env.SQLITE_PATH}`;
}

await hub({ store }).listen({
  port: Number(process.env.PORT || 6451),
});
