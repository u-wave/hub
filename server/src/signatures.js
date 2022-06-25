// Based on https://github.com/mafintosh/sodium-signatures/blob/master/index.js
import sodium from 'libsodium-wrappers';

/**
 * @param {Buffer} seed
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
 * @param {Buffer} message
 * @param {Buffer} secretKey
 */
async function sign(message, secretKey) {
  await sodium.ready;
  return sodium.crypto_sign_detached(message, secretKey);
}

/**
 * @param {Buffer} message
 * @param {Buffer} signature
 * @param {Buffer} publicKey
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
