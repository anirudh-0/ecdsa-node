const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");
const fs = require("node:fs");
const path = require("node:path");

function generateCredentials(index) {
  const privateKey = secp256k1.utils.randomPrivateKey();
  const publicKey = secp256k1.getPublicKey(privateKey);
  const address = keccak256(publicKey.slice(1)).slice(-20);
  console.log("private key:", toHex(privateKey));
  console.log("public key:", toHex(publicKey));
  console.log("address :", toHex(address));
  return {
    privateKey: toHex(privateKey),
    publicKey: toHex(publicKey),
    address: toHex(address),
    balance: [100, 50, 75][index],
  };
}

const credentials = {};

for (let i = 0; i < process.argv[2] || 0; i++) {
  const creds = generateCredentials(i);
  credentials[creds.address] = creds;
}

fs.writeFileSync(
  path.join(__dirname, "../credentials.json"),
  JSON.stringify(credentials, undefined, 2)
);
