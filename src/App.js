import React from "react";
import { HashRouter, Route } from "react-router-dom";
import './App.css';
import Web3 from "web3";
import WebHeader from "./components/header/header";
import AllNFT from "./components/AllNFT/AllNFT";
import CreateNFT from "./components/CreateNFT";
import MyNFT from "./components/MyNFT/MyNFT"
import loading from "./assets/loading/loading.jpg";
import NFTAuction from "./build/contracts/NFTAuction.json";

class App extends React.Component {

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillMount = async () => {
        await this.loadWeb3();
        await this.loadBlockChain();
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick = async() => {
        if (this.state.NFTContract) {
            let currentTime = await this.state.NFTContract.methods.getTime().call();
            // console.log("time:", currentTime);
            this.setState({currentTime});
        }
    }

    loadWeb3 = async () => {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
        else if (window.web3) {
            window.web3 = new Web3(window.web3.currentProvider);
        }
        else {
            window.alert("Non-Ethereum browser detected. You should consider trying MetaMask.");
        }
    }

    loadBlockChain = async () => {
        const web3 = window.web3;
        const accounts = await web3.eth.getAccounts();

        if (accounts.length === 0) 
            this.setState({metamaskConnected: false});
        else {
            this.setState({metamaskConnected: true});
            this.setState({loading: true});
            this.setState({accountAddress: accounts[0]});
            
            let balance = await web3.eth.getBalance(accounts[0]);
            balance = web3.utils.fromWei(balance, "ether");
            this.setState({accountBalance: balance});
            this.setState({loading: false});

            const netID = await web3.eth.net.getId();
            const netData = NFTAuction.networks[netID];
            if (netData) {
                this.setState({loading: true});
                const NFTContract = new web3.eth.Contract(
                    NFTAuction.abi,
                    netData.address
                );
                this.setState({NFTContract});
                this.setState({contractDetected: true});
                
                const NFTCount = await NFTContract.methods.NFTCounter().call();
                this.setState({NFTCount});

                for (let i = 1; i <= NFTCount; i++) {
                    const nft = await NFTContract.methods.allNFTs(i).call();
                    this.setState({NFTs: [...this.state.NFTs, nft],});
                    const auction = await NFTContract.methods.AuctionsOfNFT(i).call();
                    this.setState({Auctions: [...this.state.Auctions, auction],})
                }

                let NFTNumOfAccount = await NFTContract.methods.getTotalNumberOfTokensOwnedByAnAddress(this.state.accountAddress).call();
                this.setState({NFTNumOfAccount});
                this.setState({loading: false});
            }
        }
    }

    connectToMetamask = async () => {
        await window.ethereum.enable();
        this.setState({metamaskConnected: true});
        window.location.reload();
    }

    constructor(props) {
        super(props);
        this.state = {
            accountAddress: "",
            accountBalance: "",
            NFTContract: null,
            NFTCount: 0,
            NFTs: [],
            loading: true,
            metamaskConnected: false,
            contractDetected: false,
            NFTNumOfAccount: 0,
            nameIsUsed: false,
            lastMintTime: null,
            Auctions: [],
            currentTime: null,
        };
    }

    render() {
        return (
            <div>
            {
                !this.state.metamaskConnected ? (
                    <div className="jumbotron">
                        <hr className="my-4" />
                            请连接MetaMask
                    </div>
                ) : ! this.state.contractDetected ? (
                    <div className="jumbotron">
                        <h3>当前网络没有NFT合约</h3>
                        <hr className="my-4" />
                        <p className="lead">
                            请检查连接网络
                        </p>
                    </div>
                ) : this.state.loading ? (
                    <img src={loading} alt="Loading.." className="d-block m-auto" />
                ) : (
                    <HashRouter basename="/">
                    <WebHeader 
                        accountAddress={this.state.accountAddress}
                        accountBalance={this.state.accountBalance}
                    />
                    <Route
                        path="/"
                        exact
                        render={() => (
                            <MyNFT
                                accountAddress={this.state.accountAddress}
                                NFTs={this.state.NFTs}
                                NFTNumOfAccount={this.state.NFTNumOfAccount}
                                NFTContract={this.state.NFTContract}
                                Auctions={this.state.Auctions}
                                currentTime={this.state.currentTime}
                            />
                        )}
                    />
                    <Route
                        path="/marketplace"
                        exact
                        render={() => (
                            <AllNFT 
                                accountAddress={this.state.accountAddress}
                                NFTs={this.state.NFTs}
                                NFTCount={this.state.NFTCount}
                                NFTContract={this.state.NFTContract}
                                Auctions={this.state.Auctions}
                            />
                        )}
                    />
                    <Route
                        path="/createNFT"
                        exact
                        render={() => (
                            <CreateNFT
                                accountAddress={this.state.accountAddress}
                                NFTContract={this.state.NFTContract}
                            />
                        )}
                    />
                </HashRouter>
                )
            }
            </div>
        )
    }
}

export default App;