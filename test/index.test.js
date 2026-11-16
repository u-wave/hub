import { expect, it, vi } from 'vitest';
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

  // It depends on a network request, so even though it's local it's hard to know exactly when we should check
  vi.waitFor(async () => {
    const list = await hub.inject({ method: 'GET', url: '/' });
    expect(list.statusCode).toBe(200);
    expect(list.json().servers).toMatchObject([
      { name: 'Test' },
    ]);
  }, { timeout: 1_000 });

  await uw.close();
});

it('publishing test with active booth', async () => {
  const hub = hubServer();
  const url = await hub.listen();

  const uw = core({
    sqlite: ':memory:',
    secret: '7763b10778550dd5314656213e616519dcbad7e88fa15ca5c99477d9f761821e',
  });
  uw.use(plugin, {
    seed: Buffer.from('e682d7d60ffb8262a00e2a4f0a2e4e797510f69b248beaf8b355b0fe849e6327', 'hex'),
  });
  uw.source(() => ({
    name: 'test-source',
    search: async () => [],
    get: async () => [{
      sourceType: 'test-source',
      sourceID: '1234',
      artist: 'ABC',
      title: 'Song!',
      thumbnail: 'https://placedog.net/280',
      duration: 60,
    }],
  }));

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

  const user = await uw.users.createUser({
    username: 'Test user',
    password: 'unhashed',
    email: 'testuser@example.com',
  });

  // Set up the playlist
  const { playlist } = await uw.playlists.createPlaylist(user, { name: 'Test playlist' });
  await uw.playlists.addPlaylistItems(playlist, [{ sourceType: 'test-source', sourceID: '1234' }]);

  // Join the waitlist (& auto-advance)
  await uw.waitlist.addUser(user.id);

  // It depends on a network request, so even though it's local it's hard to know exactly when we should check
  vi.waitFor(async () => {
    const list = await hub.inject({ method: 'GET', url: '/' });
    expect(list.statusCode).toBe(200);
    expect(list.json().servers).toMatchObject([
      {
        name: 'Test',
        booth: {
          media: {
            title: 'Song!',
          },
        }
      },
    ]);
  }, { timeout: 1_000 });

  await uw.close();
});
