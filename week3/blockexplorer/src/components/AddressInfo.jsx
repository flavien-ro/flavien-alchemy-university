import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import FloorPrices from "./FloorPrices";

const AddressInfo = ({ address, alchemy }) => {
  const [balance, setBalance] = useState(0);
  const [nft, setNft] = useState(null);
  const [transfers, setTransfers] = useState(null);

  useEffect(() => {
    const getBalance = async () => {
      if (ethers.isAddress(address)) {
        const res = await alchemy.core.getBalance(address, "latest");
        const resNFT = await alchemy.nft.getNftsForOwner(address);
        const resTrans = await alchemy.core.getAssetTransfers({
          fromBlock: "0x0",
          fromAddress: address,
          category: ["external", "internal", "erc20", "erc721", "erc1155"],
        });
        setTransfers(resTrans.transfers);
        setNft(resNFT);
        setBalance(
          ethers.formatEther(
            parseInt(res._hex).toLocaleString("fullwide", {
              useGrouping: false,
            })
          )
        );
      }
    };
    getBalance();
  }, [address, alchemy]);

  if (ethers.isAddress(address)) {
    return (
      <div style={{ display: "flex", width: "100%" }}>
        <div
          style={{
            width: "48%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "lightyellow",
            padding: "25px",
          }}
        >
          <h2>Address Tokens</h2>
          <p>Eth Balance: {balance}</p>
          <h2>Wallet transfers (max 15)</h2>
          <div
            style={{
              maxWidth: "100%",
            }}
          >
            {transfers &&
              transfers.slice(0, 15).map((transfer, key) => {
                return (
                  <div
                    key={key}
                    style={{
                      maxWidth: "100%",
                      padding: "20px",
                      border: "1px solid black",
                      marginBottom: "15px",
                    }}
                  >
                    <p>Asset: {transfer.asset}</p>
                    <p>Category: {transfer.category}</p>
                    <p>From: {transfer.from}</p>
                    <p>To: {transfer.to}</p>
                    <p>Hash: {transfer.hash}</p>
                    <p>Value: {transfer.value}</p>
                  </div>
                );
              })}
          </div>
        </div>
        <div
          style={{
            width: "48%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            background: "lightgray",
            padding: "25px",
          }}
        >
          <h2>Address NFTs</h2>
          {nft && (
            <div>
              <p>This address owns {nft.totalCount} NFTs</p>
              <h2>Wallet NFTs (max 15)</h2>
              {nft?.ownedNfts.slice(0, 15).map((n, key) => {
                return (
                  <div key={key}>
                    <h4>{n.contract.name}</h4>
                    <img
                      style={{
                        height: "250px",
                        maxWidth: "250px",
                        objectFit: "contain",
                      }}
                      src={
                        n.rawMetadata.image ?? "https://via.placeholder.com/200"
                      }
                      alt={n.rawMetadata.name}
                    />
                    <FloorPrices
                      contract={n.contract.address}
                      alchemy={alchemy}
                    />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>The address you entered is not correct...</p>
      </div>
    );
  }
};

export default AddressInfo;
