
import { MongoClient } from 'mongodb'

// Connection URL
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

// Database Name
const dbName = 'lordsforsaken';

let db = {
  client: null,
  collection: null,
  async init() {
    try {
      await client.connect();
      console.log('Connected successfully to server');
      db.client = client.db(dbName);
      db.collection = db.client.collection('season');
      console.log("DB initialised")
    } catch (err) {
      console.error('Failed to connect to MongoDB:', err);
    }
  },
  async insert(payload) {
    await db.collection.updateOne(
      { _id: payload.key },
      { $set: payload.value },
      { upsert: true }
    )
  },
  close() {
    return db.client.close()
  }
}

export default db;