
import { ethers } from 'ethers';
import { dependencies } from "./loadDependencies.js";

// Function to transfer FAITH tokens
export default async function transferFaithToken(destination, amount) {
  const { contracts, wallet } = dependencies;
  try {
    // Check sender's token balance
    const senderBalance = await contracts.faith.balanceOf(wallet.address);

    const amountInWei = ethers.parseUnits(amount, 18);

    // Use native BigInt for comparison
    if (senderBalance < amountInWei) throw new Error("Insufficient token balance for transfer")
    // Transfer FAITH tokens
    console.log(`Transferring ${amount} FAITH tokens to ${destination}...`);
    const tx = await contracts.faith.transfer(destination, ethers.parseUnits(amount, 18));

    // Wait for transaction confirmation
    console.log("Faith transfer Transaction sent! Waiting for confirmation...");
    await tx.wait();

    console.log(`Transfer successful! Transaction Hash: ${tx.hash}`);
    return tx.hash;
  } catch (error) {
    console.error("Error transferring tokens:", error);
  }
}


