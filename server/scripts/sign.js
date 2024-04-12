const { secp256k1 } = require("ethereum-cryptography/secp256k1");

const PRIVATE_KEY =
  "09f270d7de0e14631104188dc384b51abd95de070f8805fbc9bf91851bcc3a7e";

function signMessage(hash) {
  return secp256k1.sign(hash, PRIVATE_KEY).toCompactHex();
}

console.log(signMessage(process.argv[2]));
