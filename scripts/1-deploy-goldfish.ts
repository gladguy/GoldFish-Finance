import { Address, getRandomNonce, toNano } from "locklift";

async function main() {
  const json1 = {
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

  const json = {
    "type": "DeFi",
    "name": "GoldFish Finance 🐡🐡",
    "description": "GoldFish Finance - Community Voted, Zero Collateral Loan in Venom chain",
    "preview": {
      "source": "https://goldfishfinance.web.app/goldfish.jpg",
      "mimetype": "image/png"
    },
    "files": [
      {
        "source": "https://goldfishfinance.web.app/goldfish.jpg",
        "mimetype": "image/jpg"
      }
    ],
    "external_url": "https://goldfishfinance.web.app/"
  };
  const signer = (await locklift.keystore.getSigner("0"))!;
  //const contract = locklift.getDeployedContract();

  const nft = locklift.factory.getContractArtifacts("Nft");
  const index = locklift.factory.getContractArtifacts("Index");
  const indexBasis = locklift.factory.getContractArtifacts("IndexBasis");
  const { contract: GoldFish, tx } = await locklift.factory.deployContract({
    contract: "GoldFish",
    publicKey: signer.publicKey,
    initParams: {
      nonce: getRandomNonce(),
      owner: `0x${signer.publicKey}`,
    },
    constructorParams: {
      _state: 0, // Below is the INR Contract
      supply: 10000000000000000, // Token Supply
      rate: 1000000000, // Cost of Token

      root_: new Address("0:f7c7581ddf1f1600d961e22dd21e1a21216468f3dd682f58c3cd2e5c5cf3e8e0"), // USD address
      json: JSON.stringify(json),
      codeNft: nft.code,
      codeIndex: index.code,
      codeIndexBasis: indexBasis.code
    },
    value: locklift.utils.toNano(5),
  });
  console.log(`GoldFish deployed at: ${GoldFish.address.toString()}`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.log(e);
    process.exit(1);
  });
