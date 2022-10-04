import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

import '@typechain/hardhat'
import '@nomiclabs/hardhat-ethers'
// import '@nomiclabs/hardhat-waffle'

import { config as dotenvconfig } from 'dotenv'
import syncFetch from 'sync-fetch'

dotenvconfig();

const mnemonic = process.env.MNEMONIC;

if (!mnemonic || mnemonic.split(' ').length !== 12) {
  throw new Error('unable to retrieve mnemonic from .secret');
}

const gasPriceTestnetRaw = syncFetch('https://public-node.testnet.rsk.co/', {
  method: 'POST',
  body: JSON.stringify({
    jsonrpc: '2.0', 
    method: 'eth_gasPrice', 
    params: [], 
    id: 1
  }),
  headers: {
    'Content-Type': 'application/json'
  }
}).json();

const gasPriceTestnet = parseInt(gasPriceTestnetRaw.result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve network gas price from "https://public-node.testnet.rsk.co/"');
}
console.log("Gas price Testnet: " + gasPriceTestnet);

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
    rskTestnet: {
      url: 'https://public-node.testnet.rsk.co/',
      chainId: 31,
      accounts: {
        mnemonic,
        initialIndex: 0,
        path: "m/44'/60'/0'/0",
        count: 10,
      },
      gasPrice: Math.floor(gasPriceTestnet * 1.1),
      gasMultiplier: 1.1,
      timeout: 1e9
    },
    development: {
      url: '127.0.0.1:8545',
      chainId: 5777
    },
  }
};

export default config;
