import { ethers } from "hardhat";

async function main() {
  const Storage = await ethers.getContractFactory("Storage");
  const storage = await Storage.deploy();

  await storage.deployed();

  console.log(`Contract Storage deployed at ${storage.address}`);
  
  console.log(`Trying to save to contract: ${512}`)
  const storeTransaction = await storage.store(512);

  console.log(`Transaction executed: ${storeTransaction.hash}`)
  
  const storedValue = await storage.retrieve();

  console.log(`Value stored in Storage is ${storedValue.toNumber()}`)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
