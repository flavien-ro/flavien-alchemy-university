import React, { useState } from "react";

function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

const BlockInfos = ({ blockInfo }) => {
  const [moreDetails, setMoreDetails] = useState(false);

  return (
    <div style={{ width: "48%", background: "lightyellow", padding: "25px" }}>
      <h2>Current Block Informations</h2>

      {!moreDetails ? (
        <div>
          <p>Block hash: {blockInfo.hash}</p>
          <p>Block number: {blockInfo.number}</p>
          <p>Gas used: {numberWithSpaces(parseInt(blockInfo.gasUsed._hex))}</p>
          <button onClick={() => setMoreDetails(true)}>See more details</button>
        </div>
      ) : (
        <div>
          <p>Block hash: {blockInfo.hash}</p>
          <p>Block number: {blockInfo.number}</p>
          <p>Block miner: {blockInfo.miner}</p>
          <p>Block nonce: {blockInfo.nonce}</p>
          <p>Block miner: {blockInfo.miner}</p>
          <p>Gas used: {numberWithSpaces(parseInt(blockInfo.gasUsed._hex))}</p>
          <p>
            Gas limit: {numberWithSpaces(parseInt(blockInfo.gasLimit._hex))}
          </p>
          <p>
            Transactions: {blockInfo.transactions.length} transactions in this
            block
          </p>
          <button onClick={() => setMoreDetails(false)}>Less details</button>
        </div>
      )}
    </div>
  );
};

export default BlockInfos;
