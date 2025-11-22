import { expect, it } from 'vitest';
import core from 'u-wave-core';
import hubServer from '@u-wave/hub-server';
import plugin from 'u-wave-announce';

it('publishing test', async () => {
  const hub = hubServer();
  const url = await hub.listen();

  const uw = core({
    sqlite: ':memory:',
    secret: '7763b10778550dd5314656213e616519dcbad7e88fa15ca5c99477d9f761821e',
  });
  uw.use(plugin, {
    seed: Buffer.from('e682d7d60ffb8262a00e2a4f0a2e4e797510f69b248beaf8b355b0fe849e6327', 'hex'),
  });

  uw.use(async () => {
    await uw.config.set('u-wave:announce', {
      hub: url,
      enabled: true,
      name: 'Test',
      subtitle: 'Just for testing',
      url: 'https://example.com/',
      apiUrl: 'https://example.com/api',
      socketUrl: 'wss://example.com/api',
    });
  });

  await uw.ready();

  // 500ms is surely enough to do a local network request!
  await new Promise((resolve) => setTimeout(resolve, 500));

  const list = await hub.inject({ method: 'GET', url: '/' });
  expect(list.statusCode).toBe(200);
  expect(list.json().servers).toMatchObject([
    { name: 'Test' },
  ]);

  await uw.close();
});
