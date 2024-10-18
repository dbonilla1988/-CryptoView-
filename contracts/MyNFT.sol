// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// Import required OpenZeppelin contracts
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";  // For tracking token IDs
import "@openzeppelin/contracts/access/Ownable.sol";  // For contract ownership
import "@openzeppelin/contracts/utils/Strings.sol";   // For converting uint to string

contract MyNFT is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    // Base URI for metadata
    string private _baseTokenURI;

    // Optional mapping for token URIs
    mapping(uint256 => string) private _tokenURIs;

    // Event for minting
    event NFTMinted(address to, uint256 tokenId);

    // Constructor to initialize the token and set base URI
    constructor(string memory baseURI) ERC721("MyNFT", "MNFT") {
        _baseTokenURI = baseURI;
    }

    // Function to mint new NFTs
    function mintNFT(address to) public onlyOwner {
        uint256 newTokenId = _tokenIdCounter.current();
        _safeMint(to, newTokenId);
        _tokenIdCounter.increment();
        emit NFTMinted(to, newTokenId);  // Emit minting event
    }

    // Batch minting function
    function mintBatchNFT(address to, uint256 numTokens) public onlyOwner {
        for (uint256 i = 0; i < numTokens; i++) {
            mintNFT(to);
        }
    }

    // Function to set token-specific URI
    function setTokenURI(uint256 tokenId, string memory _tokenURI) public onlyOwner {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }

    // Override tokenURI to return dynamic metadata for each token
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();

        // If there is a specific token URI, return that
        if (bytes(_tokenURI).length > 0) {
            return _tokenURI;
        }

        // Otherwise, concatenate base URI and token ID
        return string(abi.encodePacked(base, Strings.toString(tokenId)));
    }

    // Function to set the base URI (can only be called by the owner)
    function setBaseURI(string memory baseURI) public onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Function to retrieve the base URI
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }
}