import fs from 'fs';
import path from 'path';
import { ethers, JsonRpcProvider, Contract } from 'ethers';
import dotenv from 'dotenv';
import axios from "axios";

// Load environment variables from .env file
dotenv.config();

const __dirname = path.dirname(new URL(import.meta.url).pathname);

// const dbApiUrl = process.env.DB_API_URL;
const cdnUrl = process.env.CDN_URL;
const network = process.env.NETWORK;

const edition = "alphaEdition";

let environment = process.env.ENVIRONMENT;
let rpcNodeIndex = 0;


export const dependencies = {
  provider: {},
  rpcNodes: [],
  addresses: {
    'nft': '',
    'faith': ''
  },
  contracts: {
    'nft' : {},
    'faith': {}
  },
  wallet: null,
  abis: {
    'nft': {}
  }
}

export async function init() {
  const config = await axios.get(`${cdnUrl}/config.json`).then(res => res.data);
  dependencies.addresses.nft = config.contracts[edition][network][environment].nft;
  dependencies.addresses.faith = config.contracts[edition][network][environment].faith;
  dependencies.rpcNodes = config.contracts[edition][network][environment].rpcNodes;
  // console.log(dependencies.rpcNodes)
  dependencies.provider = new JsonRpcProvider(dependencies.rpcNodes[rpcNodeIndex]);
  console.log(dependencies.provider)
  // let feeData = await dependencies.provider.getFeeData()
  // console.log(feeData)
  // console.log(dependencies.rpcNodes[rpcNodeIndex])
  dependencies.wallet = new ethers.Wallet(process.env.PRIV_KEY, dependencies.provider);
  dependencies.abis.nft = JSON.parse(fs.readFileSync(path.join(__dirname, "./abis/nft.json"), "utf8"));
  dependencies.abis.faith = JSON.parse(fs.readFileSync(path.join(__dirname, "./abis/faith.json"), "utf8"));
  dependencies.contracts.faith = new Contract(dependencies.addresses.faith, dependencies.abis.faith, dependencies.wallet);
  dependencies.contracts.nft = new Contract(dependencies.addresses.nft, dependencies.abis.nft, dependencies.wallet);
  // Check connection by getting the latest block number
  await dependencies.provider.getBlockNumber()
  console.log("** Dependencies loaded **")
}
