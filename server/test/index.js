/* eslint-env mocha */
import assert from 'assert/strict';
import crypto from 'crypto';
import build from '@u-wave/hub-server';

describe('/announce', () => {
  it('validates inputs', async () => {
    const app = build();

    const noPublicKey = await app.inject({ method: 'POST', url: '/announce/' });
    assert.equal(noPublicKey.statusCode, 400);

    const wrongPublicKey = await app.inject({ method: 'POST', url: '/announce/some-nonsense-that-is-not-a-key' });
    assert.equal(wrongPublicKey.statusCode, 400);

    const publicKey = crypto.randomBytes(32).toString('hex');

    const wrongShape = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data: '{"json":"data"}',
        notSignature: 'abcdef1234567890',
      },
    });
    assert.equal(wrongShape.statusCode, 400);
    assert.equal(wrongShape.json().message, "body must have required property 'signature'");

    const wrongSignatureLength = await app.inject({
      method: 'POST',
      url: `/announce/${publicKey}`,
      payload: {
        data: '{"json":"data"}',
        signature: 'abcdef1234567890',
      },
    });
    assert.equal(wrongSignatureLength.statusCode, 400);
    assert.equal(wrongShape.json().message, 'wrong signature length');
  });
});
