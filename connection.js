import mongoose from "mongoose";

const connectDB = async (connectionUrl) => {
    try {
        if (!connectionUrl) {
            throw new Error('MongoDB connection string is not defined. Please check your .env file.');
        }

        const conn = await mongoose.connect(connectionUrl);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
        return conn;

    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        throw err; // Re-throw to prevent server from starting
    }
}

export default connectDB;