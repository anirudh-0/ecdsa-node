const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes, toHex } = require("ethereum-cryptography/utils");
const creds = require("./credentials.json");

function hashMessage(message) {
  const hash = keccak256(utf8ToBytes(message));
  return toHex(hash);
}

app.use(cors());
app.use(express.json());

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = creds[address].balance || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  const valid = secp256k1.verify(
    signature,
    hashMessage(
      JSON.stringify({
        sender,
        amount,
        recipient,
      })
    ),
    creds[sender].publicKey
  );

  if (!valid) {
    res.status(401).send({ message: "You're not who you say you are" });
    return;
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (creds[sender].balance < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    creds[sender].balance -= amount;
    creds[recipient].balance += amount;
    res.send({ balance: creds[sender].balance });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!creds[address].balance) {
    creds[address].balance = 0;
  }
}
