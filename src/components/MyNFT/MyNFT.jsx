import React, { useState, useEffect } from "react";
import MyNFTInfo from "./MyNFTInfo";

const MyNFT = ({
    accountAddress,
    NFTs,
    NFTNumOfAccount,
    NFTContract,
    Auctions,
    currentTime,
  }) => {
    const [loading, setLoading] = useState(false);
    const [myNFTs, setMyNFTs] = useState([]);
  
    useEffect(() => {
      if (NFTs.length !== 0) {
        if (NFTs[0].metaData !== undefined) {
          setLoading(loading);
        } else {
          setLoading(false);
        }
      }
      const myNFTs = NFTs.filter(
        (NFT) => NFT.currentOwner === accountAddress
      );
      setMyNFTs(myNFTs);
    }, [NFTs]);
  
    return (
      <div>
        <div className='text-center'>
          <mark className='font-weight-bold lead'> 
            您拥有的代币数量 : {NFTNumOfAccount}
          </mark>
        </div>
        <div className="d-flex flex-column mb-2">
          {myNFTs.map((NFT) => {
            return (
              <div
                key={NFT.tokenID}
                className="w-50 p-4 mt-4 border border-info text-center rounded mx-auto"
              >
                  <img src={NFT.tokenURI} id="preview_img" alt=""/>
                  <MyNFTInfo
                    NFT={NFT}
                    accountAddress={accountAddress}
                    NFTContract={NFTContract}
                    Auction={Auctions[parseInt(NFT.tokenID)-1]}
                    currentTime={currentTime}
                  />
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  export default MyNFT;