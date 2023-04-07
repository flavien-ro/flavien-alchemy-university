import React, { useEffect, useState } from "react";

const FloorPrices = ({ contract, alchemy }) => {
  const [floor, setFloor] = useState(0);

  useEffect(() => {
    const getFloor = async () => {
      const res = await alchemy.nft.getFloorPrice(contract);

      if (res.openSea) {
        setFloor(res.openSea.floorPrice);
      } else if (res.looksRare) {
        setFloor(res.looksRare.floorPrice);
      } else {
        setFloor(0);
      }
    };
    getFloor();
  }, [contract, alchemy]);

  return <p>Floor price: {floor ? floor : "no data"}</p>;
};

export default FloorPrices;
