import React, { useState, useEffect } from "react";
import NFTinfo from "./NFTinfo";

const AllNFT = ({
    NFTs,
    accountAddress,
    NFTCount,
    NFTContract,
    Auctions,
}) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (NFTs.length !== 0) {
            if (NFTs[0].metaData !== undefined) {
                setLoading(loading);
            }
            else {
                setLoading(false);
            }
        }
    }, [NFTs]);

    return (
        <div>
            <div className='text-center'>
                <mark className='font-weight-bold lead'> 
                平台上代币总数 : {NFTCount}
                </mark>
            </div>
            <div className="d-flex flex-column mb-2">
                {NFTs.map((NFT) => {
                    return (
                        <div
                            key={NFT.tokenID}
                            className="w-50 p-4 mt-4 border border-info text-center rounded mx-auto"
                        >
                            <img src={NFT.tokenURI} id="preview_img" alt=""/>
                            <NFTinfo
                                NFT={NFT}
                                accountAddress={accountAddress}
                                NFTContract={NFTContract}
                                Auction={Auctions[parseInt(NFT.tokenID)-1]}
                            />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default AllNFT;