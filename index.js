import axios from "axios"
// import fs from "fs"
// import path from "path";
import transferFaithToken from "./transfer.js";
import { init, dependencies } from "./loadDependencies.js";
import mintPromoCard from "./mint.js";
import db from "./db.js"
import dotenv from "dotenv"
import { wait } from "./utils.js";

dotenv.config()

const dbApiUrl = process.env.DB_API_URL;
const seasonNumber = 5;

// NOTE: MAKE SURE TO INCLUDE ADDRESS IN THE RESULT DUMP BEFORE RESTING THE POSTGRESQL PLAYER TABLE !!!


// const rewards = await axios.get(`https://d1ji3mpeqp3ic0.cloudfront.net/rewards/official-2.json`)
// const results = JSON.parse(fs.readFileSync(path.join(__dirname, './results/season4.json')))
// console.log(results)

async function resetPayments(db) {
  await db.collection.updateOne(
    { _id: `season${seasonNumber}` },              // Find the document with _id: 1
    { $unset: { payments: [] } } // Remove the 'email' field
  );
}

async function main() {
  await init()
  await db.init()

  // Reset
  // await resetPayments(db) // ONLY FOR TESTING

  const faithPrice = await axios.get("https://api.lordsforsaken.com/faith/price").then(res => res.data.faithUsdPrice)
  console.log('faithPrice', faithPrice)
  if (!faithPrice || faithPrice < 0.01) throw new Error("Bad price feed")
  const players = await axios.get(`${dbApiUrl}/players`).then(res => res.data.players)
  const { rewards, results } = await db.collection.find({_id: `season${seasonNumber}`}).toArray().then(res => res[0])

  const numberOfRewards = Object.keys(rewards).length;

  for (let i = 0; i < numberOfRewards; i++) {
    const { name } = results[i]
    let address;
    let network;
    const matches = players.filter(el => el.name == name)
    if (matches.length > 1) {
      throw new Error("duplicate player name")
    } else if (matches == 0) {
      throw new Error("missing name in db")
    } else {
      address = matches[0].address
      network = matches[0].network
    }
    console.log(`${i+1} | ${name} | ${address} | ${network}`)

    if (network !== 'MetaMask') {
      console.log(`skipping, not MetaMask network..`)
      continue;
    }

    const reward = rewards[i+1]
    const txIds = []

    // CARDS
    let promoCardsAmount = 0;
    let foil = 1;

    if (reward['silver-promo-card']) {
      foil = 1
      promoCardsAmount = reward['silver-promo-card']
    } else if (reward['gold-promo-card']) {
      foil = 2
      promoCardsAmount = reward['gold-promo-card']
    }
    console.log(`x${promoCardsAmount} foil ${foil}`)
    // RANDOM CARD GENERATOR
    const cardIds = [43, 44, 45]
    const randomPicks = []
    for (let k = 0; k < promoCardsAmount; k++) {
      const randomIndex = Math.floor(Math.random() * cardIds.length)
      const randomCardId = cardIds[randomIndex]
      console.log(`randomCardId ${randomCardId} foil ${foil}`)
      const txHash = await mintPromoCard(address, randomCardId, foil)
      txIds.push(txHash)
      randomPicks.push(randomCardId)
    }

    const usd = reward.usd;
    const faith = parseFloat(usd / faithPrice).toFixed(3)
    console.log(`FAITH reward: ${faith}`)
    const txHash = await transferFaithToken(address, faith)
    txIds.push(txHash)

    const payload = {
      faith,
      address,
      name,
      faithPrice,
      randomPicks,
      ts: new Date().toISOString(),
      txIds,
      position: i+1
    }

    await db.collection.updateOne(
      { _id: `season${seasonNumber}` },
      {
        $push: { payments: payload }
      },
      { upsert: true }
    );

    await wait(5000)

  }
  process.end(0)
}

main()