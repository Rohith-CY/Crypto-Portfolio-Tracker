
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  // Deploy the Portfolio contract
  const Portfolio = await hre.ethers.getContractFactory("Portfolio");
  const portfolio = await Portfolio.deploy();

  await portfolio.waitForDeployment();

  const address = await portfolio.getAddress();

  console.log("Portfolio deployed successfully!");
  console.log("Contract address:", address);

  // Read the newly compiled ABI
  const artifact = await hre.artifacts.readArtifact("Portfolio");

  // Update the frontend ABI file
  const abiPath = path.resolve(
    __dirname,
    "../../frontend/src/abi/Portfolio.abi.json"
  );

  fs.mkdirSync(path.dirname(abiPath), { recursive: true });

  fs.writeFileSync(
    abiPath,
    JSON.stringify(artifact.abi, null, 2)
  );

  console.log("Frontend ABI updated:", abiPath);

  // Update the frontend contract address
  const constantsPath = path.resolve(
    __dirname,
    "../../frontend/src/config/constants.js"
  );

  if (fs.existsSync(constantsPath)) {
    let constants = fs.readFileSync(constantsPath, "utf8");

    if (/CONTRACT_ADDRESS/.test(constants)) {
      constants = constants.replace(
        /(CONTRACT_ADDRESS\s*=\s*)["'][^"']*["']/,
        `$1"${address}"`
      );

      fs.writeFileSync(constantsPath, constants);
      console.log("Frontend contract address updated.");
    } else {
      console.log(
        "CONTRACT_ADDRESS was not found. Update constants.js manually."
      );
    }
  } else {
    console.log("constants.js was not found.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
