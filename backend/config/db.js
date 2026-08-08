const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    // Attempt connecting to configured MONGODB_URI fast
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] Connected to MongoDB: ${conn.connection.host}`);
  } catch (err) {
    console.log('[Database] MONGODB_URI unreachable. Initializing MongoMemoryServer in-memory DB...');
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const uri = mongoMemoryServer.getUri();
      await mongoose.connect(uri);
      console.log(`[Database] Connected to MongoMemoryServer at ${uri}`);
    } catch (fallbackErr) {
      console.error('[Database] MongoMemoryServer error:', fallbackErr.message);
    }
  }
};

module.exports = connectDB;
