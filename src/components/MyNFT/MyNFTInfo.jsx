import React from "react";

class MyNFTInfo extends React.Component {
    constructor(props) {
      super(props);
    }

    render() {
        return (
          <div>
            <div key={this.props.NFT.tokenID} className="mt-4">
              <p>
                <span className="font-weight-bold">代币ID : {" "}
                  {this.props.NFT.tokenID}
                </span>
              </p>
              <p>
                <span className="font-weight-bold">名称 : {" "}
                  {this.props.NFT.tokenName}
                </span>
              </p>
              <p>
                <span className="font-weight-bold">价格 : {" "}
                  {window.web3.utils.fromWei(this.props.NFT.price, "Ether")} ETH
                </span>
              </p>
              <p>
                <span className="font-weight-bold">转手次数 : {" "}
                  {this.props.NFT.transNum}
                </span>
              </p>
            </div>
            {this.props.NFT.onSale ? (
              <div>
              <p>
                  <span className="font-weight-bold">最高出价者 :{" "}
                    {this.props.Auction.highestBidder}
                  </span>
              </p>
              <p>
                  <span className="font-weight-bold">最高价 :{" "}
                    {this.props.Auction.highestBid}
                  </span>
              </p>
              <p>
                  <span className="font-weight-bold">结束时间 :{" "}
                    {this.props.Auction.endTime}
                  </span>
              </p>
              {this.props.currentTime >= this.props.Auction.endTime ? (
                !this.props.Auction.ended ? (
                  <button
                  className="btn btn-outline-primary mt-4"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                  onClick={ () => {
                    this.props.NFTContract.methods.endAuction(this.props.NFT.tokenID).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                      window.location.reload();
                    });
                  }}
                  >
                    结束
                  </button>
                ) : (
                  <botton
                  className="btn btn-outline-primary mt-4"
                  style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                  >
                      等待交易确认
                  </botton>
                )
                
              ) : (
                <button
                className="btn btn-outline-primary mt-4"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
              >
                尚未结束
              </button>
              )}
              </div>
            ) : (
              <button
                className="btn btn-outline-primary mt-4"
                style={{ fontSize: "0.8rem", letterSpacing: "0.14rem" }}
                onClick={ () => {
                  let minBid = prompt("请输入初始金额");
                  let duration = prompt("请输入持续时间");
                  this.props.NFTContract.methods.beginAuction(this.props.NFT.tokenID, minBid, duration).send({ from: this.props.accountAddress, gas: '3000000'}).on("confirmation", () => {
                    window.location.reload();
                  });
                }}
              >
                出售
              </button>
            )}
          </div>
        )
    }
}

export default MyNFTInfo;