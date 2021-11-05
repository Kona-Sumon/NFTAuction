// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFTAuction is ERC721URIStorage{

    address public benefiter; // 拍卖的受益人
    uint public timeOfAuctionEnd; // 拍卖的结束时间
    address public highestBidder; // 当前的最高出价者
    uint public highestBid; // 当前的最高出价

    mapping(uint => address) myToken; //记录每次拍卖的最高出价者
    mapping(uint => string) tokenName; // 记录每次拍卖的物品名
    mapping(address => uint) pendingReturns; // 记录每个人没有达成交易的投入金额
    mapping(uint256 => NFT) public allNFTs;
    mapping(uint256 => Auction) public AuctionsOfNFT;
    mapping(uint256 => mapping(address => uint256)) public fundsByBidder;
    mapping(address => uint256[]) public attendAuctions;
    mapping(address => uint) public attendAuctionsNum;
    mapping(string => bool) public tokenNameExists;
    mapping(string => bool) public tokenURIExists;

    string public collectionName;
    string public collectionNameSymbol;
    uint256 public NFTCounter;
    string s = "Nothing"; // 当前拍卖的物品名
    uint x = 0; // 当前的剩余时间
    string checkn = ""; //查询的拍卖品名
    uint index = 0; //当前拍卖的序号
    bool begin = false; // 是否有进行中的拍卖

    struct NFT {
        uint256 tokenID;
        string tokenName;
        string tokenURI;
        address payable mintedBy;
        address payable currentOwner;
        address payable previousOwner;
        uint256 price;
        uint256 transNum;
        bool onSale;
    }

    struct Auction {
        uint256 minBid;
        address payable highestBidder;
        uint256 highestBid;
        uint endTime;
        bool ended;
        bool claimed;
    }

    constructor() ERC721("NFT Collection", "NFT") {
        collectionName = name();
        collectionNameSymbol = symbol();
    }

    function createAuction(string memory name) public returns (bool) {
        require(begin != true);
        index ++;
        s = name;
        uint _biddingTime = 100; // 每次拍卖持续的时间
        benefiter = msg.sender;
        highestBidder = msg.sender;
        highestBid = 0;
        timeOfAuctionEnd = block.timestamp + _biddingTime;
        begin = true;
        changeNow();
        return true;
    }

    function claimNFT(uint256 _tokenID) public payable tokenExist(_tokenID) notZeroAddress returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(auction.ended, "Auction not yet ended.");
        require(!auction.claimed);
        require(msg.sender == auction.highestBidder);
        address tokenOwner = ownerOf(_tokenID);
        require(tokenOwner != address(0));

        NFT memory nft = allNFTs[_tokenID];
        _transfer(tokenOwner, msg.sender, _tokenID);
        payable(tokenOwner).transfer(msg.value);
        nft.previousOwner = nft.currentOwner;
        nft.currentOwner = payable(msg.sender);
        nft.price = auction.highestBid;
        nft.transNum += 1;
        nft.onSale = false;
        allNFTs[_tokenID] = nft;
        return true;
    }

    function changeNow() public {
        if(block.timestamp > timeOfAuctionEnd || begin == false) {
            x = 0;
        }
        else{
            x = timeOfAuctionEnd - block.timestamp;
        }
    }

    function bid() public payable {

        require(block.timestamp <= timeOfAuctionEnd);
        require(msg.value > highestBid);

        if (highestBid != 0) {
            pendingReturns[highestBidder] += highestBid;
        }
        highestBidder = msg.sender;
        highestBid = msg.value;
        changeNow();
    }

    function increaseBid(uint256 _tokenID, uint256 newBid) tokenExist(_tokenID) notOwner(_tokenID) notEnded(_tokenID) public returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        if (newBid <= auction.highestBid) revert();

        NFT memory nft = allNFTs[_tokenID];
        nft.price = newBid;
        allNFTs[_tokenID] = nft;
        
        attendAuctionsNum[msg.sender] += 1;
        attendAuctions[msg.sender].push(_tokenID);
        fundsByBidder[_tokenID][msg.sender] = newBid;
        auction.highestBidder = payable(msg.sender);
        auction.highestBid = newBid;
        AuctionsOfNFT[_tokenID] = auction;
        return true;
    }

    function withdraw() public returns (bool) {
        uint amount = pendingReturns[msg.sender];
        require(amount > 0);
        if (amount > 0) {
            pendingReturns[msg.sender] = 0;
        }
        return true;
    }

    function getTotalNumberOfTokensOwnedByAnAddress(address _owner) public view returns(uint256) {
        uint256 totalNumberOfTokensOwned = balanceOf(_owner);
        return totalNumberOfTokensOwned;
    }

    function endAuction(uint256 _tokenID) tokenExist(_tokenID) public returns (bool success) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(block.timestamp >= auction.endTime, "Auction not yet ended.");

        auction.ended = true;

        AuctionsOfNFT[_tokenID] = auction;
        return true;
    }

    function getTokenOwner(uint256 _tokenID) public view returns  (address) {
        address _tokenOwner = ownerOf(_tokenID);
        return _tokenOwner;
    }

    function End() public {
        require(block.timestamp >= timeOfAuctionEnd);
        require(highestBidder == msg.sender);
        begin = false;
        highestBid = 0;
        tokenName[index] = s;
        myToken[index] = highestBidder;
        s = "Nothing";
    }

    modifier isOwner(uint256 _tokenID) {
        require(
            msg.sender == ownerOf(_tokenID),
            "Only owner can call this function."
        );
        _;
    }

    modifier notOwner(uint256 _tokenID) {
        require(
            msg.sender != ownerOf(_tokenID),
            "Owner cannot call this function."
        );
        _;
    }

    modifier notEnded(uint256 _tokenID) {
        Auction memory auction = AuctionsOfNFT[_tokenID];
        require(
            block.timestamp <= auction.endTime,
            "Auction already ended."
        );
        _;
    }

    modifier tokenExist(uint256 _tokenID) {
        require(
            _exists(_tokenID),
            "Token ID does not exist."
        );
        _;
    }

    function getTime() public view returns (uint) {
        return block.timestamp;
    }

    function mintNFT(string memory _name, string memory  _tokenURI, uint256 _price) external notZeroAddress {
        NFTCounter++;
        require(!_exists(NFTCounter));
        require(!tokenURIExists[_tokenURI]);
        require(!tokenNameExists[_name]);
    
        _safeMint(msg.sender, NFTCounter);
        _setTokenURI(NFTCounter, _tokenURI);

        tokenURIExists[_tokenURI] = true;
        tokenNameExists[_name] = true;

        NFT memory newNFT = NFT(
            NFTCounter,
            _name,
            _tokenURI,
            payable(msg.sender),
            payable(msg.sender),
            payable(address(0)),
            _price,
            0,
            false
        );
        allNFTs[NFTCounter] = newNFT;
    }

    modifier notZeroAddress() {
        require(
            msg.sender != address(0),
            "The fucntion caller is zero address account."
        );
        _;
    }
  
    function getTokenMetaData(uint _tokenID) public view returns  (string memory) {
        string memory tokenMetaData = tokenURI(_tokenID);
        return tokenMetaData;
    }
  
    function beginAuction(uint256 _tokenID, uint256 _minBid, uint _duration) tokenExist(_tokenID) isOwner(_tokenID) public returns (bool success) {
        uint _endTime = block.timestamp+_duration;
        NFT memory nft = allNFTs[_tokenID];
        nft.onSale = true;
        Auction memory newAuction = Auction(
            _minBid,
            payable(msg.sender),
            _minBid,
            _endTime,
            false,
            false
        );

        allNFTs[_tokenID] = nft;
        AuctionsOfNFT[_tokenID] = newAuction;
        return true;
    }
}