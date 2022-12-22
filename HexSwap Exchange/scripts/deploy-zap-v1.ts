import { ethers, network, run } from "hardhat";
import config from "../config";

const main = async () => {
  // Compile contracts
  await run("compile");
  console.log("Compiled contracts.");

  const networkName = network.name;

  // Sanity checks
  if (networkName === "mainnet") {
    if (!process.env.KEY_MAINNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  } else if (networkName === "testnet") {
    if (!process.env.KEY_TESTNET) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  }

  if (!config.HexSwapRouter[networkName] || config.HexSwapRouter[networkName] === ethers.constants.AddressZero) {
    throw new Error("Missing router address, refer to README 'Deployment' section");
  }

  if (!config.WBNB[networkName] || config.WBNB[networkName] === ethers.constants.AddressZero) {
    throw new Error("Missing WBNB address, refer to README 'Deployment' section");
  }

  console.log("Deploying to network:", networkName);

  // Deploy HexSwapZapV1
  console.log("Deploying HexSwapZap V1..");

  const HexSwapZapV1 = await ethers.getContractFactory("HexSwapZapV1");

  const HexSwapZap = await HexSwapZapV1.deploy(
    config.WBNB[networkName],
    config.HexSwapRouter[networkName],
    config.MaxZapReverseRatio[networkName]
  );

  await HexSwapZap.deployed();

  console.log("HexSwapZap V1 deployed to:", HexSwapZap.address);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
