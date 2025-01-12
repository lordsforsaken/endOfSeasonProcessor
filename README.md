# Lords Forsaken - End of Season Payment Processor

This repository contains the **End of Season Payment Processor** for **Lords Forsaken**, designed to handle the distribution of rewards to players at the end of each season. The payment processor interacts with multiple APIs, interacts with a database, and performs the reward minting and Faith token transfers.

## Features

- **Automatic End of Season Reward Distribution**: Calculates rewards, mint promo cards, and transfers Faith tokens.
- **Customizable**: Supports different seasons and reward configurations.
- **Handles Multiple Networks**: Specifically supports MetaMask network for reward distribution.
- **Checks Price Feed**: Ensures that the Faith token reward distribution is based on a valid USD price feed.

## Overview

The script fetches data from various sources and performs the following tasks:

1. **Fetches Season Data**: 
    - Retrieves player data from the database.
    - Fetches the reward configuration (number of cards, promo cards, etc.) from the database.
  
2. **Processes Each Player's Reward**:
    - Verifies player names against a list.
    - Skips players on non-MetaMask networks.
    - Randomly selects promo cards.
  
3. **Faith Token Distribution**:
    - Calculates Faith tokens based on USD price feed.
    - Transfers the corresponding Faith tokens to players' addresses.

4. **Transaction Hashes**:
    - Logs transaction IDs for each reward.

5. **Database Updates**:
    - Updates the database with the payment details (Faith tokens, promo cards, and transaction hashes).

## Requirements

1. **Node.js**: This script uses **Node.js** to run.
2. **MongoDB**: The script interacts with a MongoDB database to retrieve player data and reward configurations.
3. **Axios**: Used to fetch data from external APIs.
4. **Dotenv**: Used for managing environment variables securely.

### Install Dependencies

To get started, clone the repository and install the required dependencies:

```bash
git clone https://github.com/your-repo/lordsforsaken-end-of-season-processor.git
cd lordsforsaken-end-of-season-processor
npm install
