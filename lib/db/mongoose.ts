import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://127.0.0.1:27017/carteazy';

declare global {
  var mongooseCache: { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null } | undefined;
}

const cache = global.mongooseCache || { conn: null, promise: null };

global.mongooseCache = cache;

export async function dbConnect() {
  if (cache.conn) return cache.conn;
  cache.promise ??= mongoose.connect(MONGO_URI, { maxPoolSize: 20 });
  cache.conn = await cache.promise;
  return cache.conn;
}
