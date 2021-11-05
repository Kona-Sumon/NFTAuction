import React from "react";

class NFTinfo extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div key={this.props.NFT.tokenID} className="mt-4">
                <p>
                    <span className="font-weight-bold">代币ID :{" "}
                    {this.props.NFT.tokenID}
                    </span>
                </p>
                <p>
                    <span className="font-weight-bold">名称 :{" "}
                    {this.props.NFT.tokenName}
                    </span>
                </p>
                <p>
                    <span className="font-weight-bold">铸造人 :{" "}
                    {this.props.NFT.mintedBy}
                    </span>
                </p>
                <p>
                    <span className="font-weight-bold">当前归属 :{" "}
                    {this.props.NFT.currentOwner}
                    </span>
                </p>
                <p>
                    <span className="font-weight-bold">历史归属 :{" "}
                    {this.props.NFT.previousOwner}
                    </span>
                </p>
                <p>
                    <span className="font-weight-bold">价格 :{" "}
                    {window.web3.utils.fromWei(this.props.NFT.price,"Ether")} ETH
                    </span>
                </p>
                <p>
                    <span className="font-weight-bold">转手次数 :{" "}
                    {this.props.NFT.transNum}
                    </span>
                </p>
                {
                    this.props.accountAddress === this.props.NFT.currentOwner ? (
                        !this.props.NFT.onSale ? (
                            <button
                                className="btn btn-outline-primary mt-4"
                                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                onClick={ () => {
                                    let minBid = prompt("Please input minBid");
                                    let duration = prompt("Please input duration");
                                    this.props.NFTContract.methods.beginAuction(this.props.NFT.tokenID, minBid, duration).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                                        window.location.reload();
                                    });
                                }}
                            >
                                出售
                            </button>
                        ) : (
                            <p>
                                <span className="font-weight-bold">截止时间 :{" "}
                                {this.props.Auction.endTime}
                                </span>
                            </p>
                        )
                    ) : (
                        this.props.NFT.onSale ? (
                            !this.props.Auction.ended ? (
                                <div>
                                <p>
                                    <span className="font-weight-bold">最高出价人 :{" "}
                                        {this.props.Auction.highestBidder}
                                    </span>
                                </p>
                                <p>
                                    <span className="font-weight-bold">最高价:{" "}
                                    {this.props.Auction.highestBid}
                                    </span> 
                                </p>
                                <botton
                                    className="btn btn-outline-primary mt-4"
                                    style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                    onClick={ () => {
                                        let bid = prompt("请输出你的出价");
                                        this.props.NFTContract.methods.increaseBid(this.props.NFT.tokenID, bid).send({ from: this.props.accountAddress, gas: '3000000'});
                                      }}
                                >
                                    出价
                                </botton>
                                </div>
                            ) : (
                                !this.props.Auction.claimed ? (
                                    this.props.accountAddress === this.props.Auction.highestBidder ? (
                                        <botton
                                            className="btn btn-outline-primary mt-4"
                                            style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                            onClick={ () =>{
                                                this.props.NFTContract.methods.claimNFT(this.props.NFT.tokenID).send({from: this.props.accountAddress, value: this.props.Auction.highestBid, gas: '3000000'});
                                            }}
                                        >
                                            确认交易
                                        </botton>
                                    ) : (
                                        <botton
                                            className="btn btn-outline-danger mt-4"
                                            style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                                        >
                                            等待交易确认
                                        </botton>
                                    )
                                ) : (
                                    <div></div>
                                )
                            )
        
                        ) : (
                            <botton
                                className="btn btn-outline-danger mt-4"
                                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                            >
                                未在售
                            </botton>
                        )
                    )
                }
            </div>
        )
    }
}

export default NFTinfo;