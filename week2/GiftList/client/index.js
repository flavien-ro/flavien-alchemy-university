const axios = require("axios");
const niceList = require("../utils/niceList.json");
const MerkleTree = require("../utils/MerkleTree");

const serverUrl = "http://localhost:1225";

async function main() {
  // TODO: how do we prove to the server we're on the nice list?

  // get name from CMD line
  const nameInput = process.argv.slice(2);
  let name = "Basic Name";

  if (nameInput.length > 0) {
    name = "";
    for (let i = 0; i < nameInput.length; i++) {
      name = name + " " + nameInput[i];
    }
  }
  name = name.trimStart();

  const index = niceList.findIndex((n) => n === name);
  const merkleTree = new MerkleTree(niceList);

  const proof = merkleTree.getProof(index);

  const { data: gift } = await axios.post(`${serverUrl}/gift`, {
    name,
    proof,
  });

  console.log({ gift });
}

main();
