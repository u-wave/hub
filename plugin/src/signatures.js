// https://github.com/mafintosh/sodium-signatures/blob/master/index.js
const sodium = require('sodium-javascript')

function keyPair (seed) {
  const publicKey = Buffer.alloc(sodium.crypto_sign_PUBLICKEYBYTES)
  const secretKey = Buffer.alloc(sodium.crypto_sign_SECRETKEYBYTES)

  if (seed) {
    sodium.crypto_sign_seed_keypair(publicKey, secretKey, seed)
  } else {
    sodium.crypto_sign_keypair(publicKey, secretKey)
  }

  return { publicKey, secretKey }
}

function sign (message, secretKey) {
  const signature = Buffer.alloc(sodium.crypto_sign_BYTES)
  sodium.crypto_sign_detached(signature, message, secretKey)
  return signature
}

function verify (message, signature, publicKey) {
  return sodium.crypto_sign_verify_detached(signature, message, publicKey)
}

module.exports = {
  keyPair,
  sign,
  verify
}
