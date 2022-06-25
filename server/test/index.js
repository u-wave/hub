/* eslint-env mocha */
import assert from 'assert/strict';
import build from '@u-wave/hub-server'; // eslint-disable-line import/no-extraneous-dependencies
import { keyPair, sign } from '../src/signatures.js';

describe('/announce', () => {
  it('validates inputs', async () => {
    const app = build();

    const noPublicKey = await app.inject({ method: 'POST', url: '/announce/' });
    assert.equal(noPublicKey.statusCode, 400);

    const wrongPublicKey = await app.inject({ method: 'POST', url: '/announce/some-nonsense-that-is-not-a-key' });
    assert.equal(wrongPublicKey.statusCode, 400);

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
    assert.equal(wrongShape.statusCode, 400);
    assert.equal(wrongShape.json().message, "body must have required property 'signature'");

    const wrongSignatureLength = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        signature: 'abcdef1234567890',
      },
    });
    assert.equal(wrongSignatureLength.statusCode, 400);
    assert.equal(wrongSignatureLength.json().message, 'invalid signature length');

    const wrongSignature = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        signature: Buffer.from(await sign(` ${data}`, kp.secretKey)).toString('hex'),
      },
    });
    assert.equal(wrongSignature.statusCode, 400);
    assert.equal(wrongSignature.json().message, 'Invalid signature');

    const wrongDataShape = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data,
        signature: Buffer.from(await sign(data, kp.secretKey)).toString('hex'),
      },
    });
    assert.equal(wrongDataShape.statusCode, 400);
    assert.equal(wrongDataShape.json().message, "data must have required property 'name'");
  });
});
