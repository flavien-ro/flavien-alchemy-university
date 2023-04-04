const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "0x8cb2a9ddfb06e436f878479e6862b461829927aa": 100, // private key 8a44d632d8856813dc99326c4c3e64358447145657daa621ffeffa33f940469b
  "0x09e2c5a04a50a629c105e68ff984528a60be250f": 50, // private key 8d3afda0112c204be923213d0adab6144ec73b2945e775a5fd6c4bfeb749156d
  "0x0233e6e305526dcb82a87d47022646d43d57c31b": 75, // private key 9923090ebd40b652d410c85d4a7b31a4e39ea955756f0f098315534d7979e8fc
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

function hashMessage(message) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return hash;
}

async function recoverKey(message, signature, recoveryBit) {
  const recover = secp.recoverPublicKey(
    hashMessage(message),
    signature,
    recoveryBit
  );
  return recover;
}

app.post("/send", async (req, res) => {
  // get a signature from client side
  // recover the public key from the signature

  const { recoveryBit, message, signature, recipient, amount } = req.body;

  const recover = await recoverKey(message, signature, recoveryBit);

  const publicKeyWithoutFormat = recover.slice(1);
  const hash = keccak256(publicKeyWithoutFormat);
  const address = hash.slice(-20);
  const ethAddress = "0x" + toHex(address);

  setInitialBalance(ethAddress);
  setInitialBalance(recipient);

  if (balances[ethAddress] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[ethAddress] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[ethAddress] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
