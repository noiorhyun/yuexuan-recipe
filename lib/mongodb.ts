import { MongoClient } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local or Vercel environment variables');
}

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
};

// Cache the MongoDB connection in development
let cachedClient: MongoClient | null = null;
let cachedPromise: Promise<MongoClient> | null = null;

export async function connectToDatabase(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  if (!cachedPromise) {
    const client = new MongoClient(uri, options);
    cachedPromise = client.connect()
      .then((client) => {
        cachedClient = client;
        return client;
      })
      .catch((err) => {
        cachedPromise = null;
        throw err;
      });
  }

  return cachedPromise;
} 