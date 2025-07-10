import { expect, describe, it } from 'vitest';
// eslint-disable-next-line import/no-extraneous-dependencies
import build from '@u-wave/hub-server';
import { keyPair, sign } from './signatures.js';

describe('/announce', () => {
  it('validates inputs', async () => {
    const app = build();

    const noPublicKey = await app.inject({ method: 'POST', url: '/announce/' });
    expect(noPublicKey.statusCode).toBe(400);

    const wrongPublicKey = await app.inject({ method: 'POST', url: '/announce/some-nonsense-that-is-not-a-key' });
    expect(wrongPublicKey.statusCode).toBe(400);

    const kp = await keyPair();
    const publicKey = Buffer.from(kp.publicKey).toString('hex');

    const data = '{"json":"data"}';
    const wrongShape = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        notSignature: 'abcdef1234567890',
      },
    });
    expect(wrongShape.statusCode).toBe(400);
    expect(wrongShape.json().message).toBe("body must have required property 'signature'");

    const wrongSignatureLength = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        signature: 'abcdef1234567890',
      },
    });
    expect(wrongSignatureLength.statusCode).toBe(400);
    expect(wrongSignatureLength.json().message).toBe('invalid signature length');

    const wrongSignature = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        signature: Buffer.from(await sign(` ${data}`, kp.secretKey)).toString('hex'),
      },
    });
    expect(wrongSignature.statusCode).toBe(400);
    expect(wrongSignature.json().message).toBe('Invalid signature');

    const wrongDataShape = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        signature: Buffer.from(await sign(data, kp.secretKey)).toString('hex'),
      },
    });
    expect(wrongDataShape.statusCode).toBe(400);
    expect(wrongDataShape.json().message).toBe("data must have required property 'name'");
  });
});

it('publishes announces without media', async () => {
  const app = build();

  const kp = await keyPair();
  const publicKey = Buffer.from(kp.publicKey).toString('hex');

  const data = JSON.stringify({
    name: 'Test',
    subtitle: 'Just for testing',
    url: 'https://example.com/',
    apiUrl: 'https://example.com/api',
    socketUrl: 'wss://example.com/api',
  });

  const published = await app.inject({
    method: 'POST',
    url: `/announce/${publicKey}`,
    payload: {
      data,
      signature: Buffer.from(await sign(data, kp.secretKey)).toString('hex'),
    },
  });
  expect(published.statusCode).toBe(200);

  const list = await app.inject({ method: 'GET', url: '/' });
  expect(list.statusCode).toBe(200);
  expect(list.json().servers).toMatchObject([
    { name: 'Test', publicKey },
  ]);
});

it('publishes multiple announces without media', async () => {
  const app = build();

  const kp1 = await keyPair();
  const publicKey1 = Buffer.from(kp1.publicKey).toString('hex');
  const kp2 = await keyPair();
  const publicKey2 = Buffer.from(kp2.publicKey).toString('hex');

  const data1 = JSON.stringify({
    name: 'Test',
    subtitle: 'Just for testing',
    url: 'https://example.com/',
    apiUrl: 'https://example.com/api',
    socketUrl: 'wss://example.com/api',
  });

  const data2 = JSON.stringify({
    name: 'Other',
    subtitle: 'Also just for testing',
    url: 'https://example.net/',
    apiUrl: 'https://example.net/api',
    socketUrl: 'wss://example.net/api',
  });

  const published1 = await app.inject({
    method: 'POST',
    url: `/announce/${publicKey1}`,
    payload: {
      data: data1,
      signature: Buffer.from(await sign(data1, kp1.secretKey)).toString('hex'),
    },
  });
  expect(published1.statusCode).toBe(200);

  const published2 = await app.inject({
    method: 'POST',
    url: `/announce/${publicKey2}`,
    payload: {
      data: data2,
      signature: Buffer.from(await sign(data2, kp2.secretKey)).toString('hex'),
    },
  });
  expect(published2.statusCode).toBe(200);

  // Override one of them
  const published3 = await app.inject({
    method: 'POST',
    url: `/announce/${publicKey1}`,
    payload: {
      data: data1,
      signature: Buffer.from(await sign(data1, kp1.secretKey)).toString('hex'),
    },
  });
  expect(published3.statusCode).toBe(200);

  const list = await app.inject({ method: 'GET', url: '/' });
  expect(list.statusCode).toBe(200);
  expect(list.json().servers).toMatchObject([
    { name: 'Test', publicKey: publicKey1 },
    { name: 'Other', publicKey: publicKey2 },
  ]);
});
