import mongoose from 'mongoose';

// Cache connection across serverless function warm invocations
const cached = (global as any).__mongoose || ((global as any).__mongoose = { conn: null, promise: null });

const ConnectDB = async () => {
    if (cached.conn) return cached.conn;

    if (!cached.promise) {
        cached.promise = mongoose.connect(process.env.MONGODB_URI as string, {
            bufferCommands: false,
        });
    }

    try {
        cached.conn = await cached.promise;
    } catch (err) {
        cached.promise = null;
        throw err;
    }

    return cached.conn;
};

export default ConnectDB;
