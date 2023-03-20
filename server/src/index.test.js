import { expect, describe, it } from 'vitest';
import build from '@u-wave/hub-server'; // eslint-disable-line import/no-extraneous-dependencies
import { keyPair, sign } from '../src/signatures.js';

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
