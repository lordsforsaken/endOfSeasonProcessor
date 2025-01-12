import db from "./db.js"
import fs from "fs";
import path from "path";
import axios from "axios";

const __dirname = path.dirname(new URL(import.meta.url).pathname);

const seasonNumber = "4";

async function main() {
	await db.init()
	// Reward structure is uploaded on CDN game config file, update file accordingly
	const rewards = await axios.get(`https://d1ji3mpeqp3ic0.cloudfront.net/rewards/official-2.json`).then(res => res.data)
	// Every end of season create a postgress JSON export to this local repository in /results folder
	const results = JSON.parse(fs.readFileSync(path.join(__dirname, `./results/season${seasonNumber}.json`)))
	const payload = {
		key: `season${seasonNumber}`,
		value: {
			results,
			rewards
		}
	}
	// console.log(rewards)
	try {
		await db.insert(payload)
		console.log(`Season 4 data succesfully stored in local mongodb`)
	} catch(e) {
		console.log("Error saving season data:", e)
	}
}

main()