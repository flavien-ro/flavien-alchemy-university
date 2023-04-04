const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");

const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();

const publicKey = secp.getPublicKey(privateKey);

const publicKeyWithoutFormat = publicKey.slice(1);
const hash = keccak256(publicKeyWithoutFormat);
const address = hash.slice(-20);

console.log("public key: " + toHex(address));
console.log("private key: " + toHex(privateKey));
