const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri && uri !== 'mongodb://127.0.0.1:27017/ai-interview-prep' && uri !== 'your_mongodb_uri_here') {
    try {
      const conn = await mongoose.connect(uri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Successfully connected to remote MongoDB Atlas: ${conn.connection.host}`);
      return;
    } catch (err) {
      console.warn(`[Database] Failed to connect to MONGODB_URI (${err.message}). Falling back to MongoMemoryServer...`);
    }
  } else {
    console.log('[Database] MONGODB_URI unconfigured or local default. Using MongoMemoryServer...');
  }

  // Fallback in-memory database configuration supporting Linux Debian 12 (Render) and local environments
  try {
    mongoMemoryServer = await MongoMemoryServer.create({
      binary: {
        version: '7.0.3', // Compatible with Linux Debian 12 and Windows/macOS
      },
    });
    const memoryUri = mongoMemoryServer.getUri();
    await mongoose.connect(memoryUri);
    console.log(`[Database] Connected to MongoMemoryServer at ${memoryUri}`);
  } catch (fallbackErr) {
    console.error('[Database] MongoMemoryServer error:', fallbackErr.message);
  }
};

module.exports = connectDB;
