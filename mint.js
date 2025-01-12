// import { ethers } from 'ethers';
import { dependencies } from './loadDependencies.js';

// const dbApiUrl = process.env.DB_API_URL;
const MAX_FEE = 266666666n / 4n;
const tip = 2000n;

export default async function mintPromoCard(address, cardId, foilIndex) {
  const { contracts, provider } = dependencies;

  try {
    let feeData = await provider.getFeeData()
    
    let fee = MAX_FEE;

    if (feeData.maxFeePerGas < MAX_FEE)
      fee = feeData.maxFeePerGas;

    console.log("Minting ..")
    const tx = await contracts.nft.mintPromoCard(
      cardId, 
      foilIndex, 
      address,
      {
        // nonce,
        maxFeePerGas: fee.toString(),
        maxPriorityFeePerGas: (fee - tip).toString()

        // for legacy network (non EIP-1559), we use gas price
        // gasPrice: feeData.gasPrice.toString()
      }
    )
    console.log("Mint Transaction sent! Waiting for confirmation...");
    await tx.wait()
    console.log(`Mint successful! Transaction Hash: ${tx.hash}`);
    return tx.hash;
  } catch(error) {
    console.error("Error Minting:", error);
  }
}


