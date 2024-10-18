async function main() {
  const MyNFT = await ethers.getContractFactory("MyNFT");
  const baseURI = "https://ipfs.io/ipfs/your-base-metadata-uri/";

  const myNFT = await MyNFT.deploy(baseURI);
  await myNFT.deployed();

  console.log("MyNFT deployed to:", myNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});