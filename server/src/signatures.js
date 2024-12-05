// Based on https://github.com/mafintosh/sodium-signatures/blob/master/index.js
import sodium from 'libsodium-wrappers';

/**
 * @param {Uint8Array} [seed]
 */
async function keyPair(seed) {
  await sodium.ready;

  const { publicKey, privateKey } = seed
    ? sodium.crypto_sign_seed_keypair(seed)
    : sodium.crypto_sign_keypair();

  // Rename for consistency with sodium-signatures
  const secretKey = privateKey;

  return { publicKey, secretKey };
}

/**
 * @param {Uint8Array | string} message
 * @param {Uint8Array} secretKey
 */
async function sign(message, secretKey) {
  await sodium.ready;
  return sodium.crypto_sign_detached(message, secretKey);
}

/**
 * @param {Uint8Array | string} message
 * @param {Uint8Array} signature
 * @param {Uint8Array} publicKey
 */
async function verify(message, signature, publicKey) {
  await sodium.ready;
  return sodium.crypto_sign_verify_detached(signature, message, publicKey);
}

export {
  keyPair,
  sign,
  verify,
};
