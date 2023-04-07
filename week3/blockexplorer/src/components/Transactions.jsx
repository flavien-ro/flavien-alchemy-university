import React, { useState } from "react";

function numberWithSpaces(x) {
  var parts = x.toString().split(".");
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return parts.join(".");
}

const Transactions = ({ blockWithTransac, alchemy }) => {
  const [moreDetails, setMoreDetails] = useState(false);
  const [details, setDetails] = useState(null);

  const getTransactionDetails = async (transacHash) => {
    setDetails(await alchemy.core.getTransactionReceipt(transacHash));
    setMoreDetails(true);
  };

  return (
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
      <h2>Current Block transactions (5)</h2>

      {!moreDetails ? (
        <div
          style={{
            maxWidth: "100%",
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {blockWithTransac?.transactions
            .slice(0, 5)
            .map((transaction, index) => {
              return (
                <div
                  key={index}
                  style={{
                    padding: "10px 20px",
                    border: "1px solid black",
                    marginBottom: "25px",
                    marginRight: "25px",
                  }}
                >
                  <p>Transaction hash: {transaction.hash}</p>
                  <p>Transaction from: {transaction.from}</p>
                  <p>Transaction to: {transaction.to}</p>
                  <button
                    onClick={() => getTransactionDetails(transaction.hash)}
                  >
                    See transaction details
                  </button>
                </div>
              );
            })}
        </div>
      ) : (
        <div>
          <p>Transaction Hash: {details.transactionHash}</p>
          <p>Transaction from: {details.from}</p>
          <p>Transaction to: {details.to}</p>
          <p>Block Confirmations: {details.confirmations}</p>
          <p>Gas used: {numberWithSpaces(parseInt(details.gasUsed._hex))}</p>
          <button onClick={() => setMoreDetails(false)}>
            See all transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default Transactions;
