import { Alchemy, Network } from "alchemy-sdk";
import { useEffect, useState } from "react";
import BlockInfos from "./components/BlockInfos";
import Transactions from "./components/Transactions";
import AddressInfo from "./components/AddressInfo";

import "./App.css";

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockInfo, setBlockInfo] = useState(null);
  const [blockWithTransac, setBlockWithTransac] = useState(null);
  const [address, setAddress] = useState("");

  useEffect(() => {
    async function getBlockInfo() {
      setBlockInfo(await alchemy.core.getBlock());
      setBlockWithTransac(await alchemy.core.getBlockWithTransactions());
    }

    getBlockInfo();
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <h1>The Ethereum Blockchain Explorer</h1>
        <input
          style={{
            width: "550px",
            height: "50px",
            padding: "5px 15px",
            fontSize: "20px",
          }}
          type="text"
          id="address"
          name="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter an address"
        />
      </div>

      <div className="blockInfo">
        {address && address.length > 40 ? (
          <AddressInfo address={address} alchemy={alchemy} />
        ) : (
          <>
            {blockInfo && <BlockInfos blockInfo={blockInfo} />}
            {blockWithTransac && (
              <Transactions
                blockWithTransac={blockWithTransac}
                alchemy={alchemy}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
