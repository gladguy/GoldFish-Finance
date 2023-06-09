import { Address, getRandomNonce, toNano } from "locklift";

async function main() {
  const json = {
    "type": "NFT",
    "name": "Venom Apes in Venom",
    "description": "Apes jumped in to Venom chain",
    "preview": {
      "source": "https://i.seadn.io/gcs/files/35c90cbb8d9466adb1440400fda51d04.jpg?auto=format&dpr=1&w=250",
      "mimetype": "image/png"
    },
    "files": [
      {
        "source": "https://i.seadn.io/gcs/files/35c90cbb8d9466adb1440400fda51d04.jpg?auto=format&dpr=1&w=250",
        "mimetype": "image/jpg"
      }
    ],
    "external_url": "https://venomapes.com/"
  };
  const signer = (await locklift.keystore.getSigner("0"))!;
  //const contract = locklift.getDeployedContract();

  const nft = locklift.factory.getContractArtifacts("Nft");
  const index = locklift.factory.getContractArtifacts("Index");
  const indexBasis = locklift.factory.getContractArtifacts("IndexBasis");
  const { contract: WenomUnion, tx } = await locklift.factory.deployContract({
    contract: "MoneyExchange",
    publicKey: signer.publicKey,
    initParams: {
      nonce: getRandomNonce(),
      owner: `0x${signer.publicKey}`,
    },
    constructorParams: {
      _state: 0, // Below is the INR Contract
      supply: 10000000000000000, // Token Supply
      rate: 1000000000, // Cost of Token

      root_: new Address("0:65c3ff8fdd39c2487a9b0536c785ef8d528b1a6e8cefa9c2d03ddb1981255b6b"), // Token address
      json: JSON.stringify(json),
      codeNft: nft.code,
      codeIndex: index.code,
      codeIndexBasis: indexBasis.code
    },
    value: locklift.utils.toNano(5),
  });
  console.log(`WenomUnion deployed at: ${WenomUnion.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
