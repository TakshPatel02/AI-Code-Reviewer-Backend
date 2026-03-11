import mongoose from "mongoose";

// The function responsible for establishing a connection to the MongoDB database using Mongoose. It takes the connection URL as an argument, attempts to connect to the database, and handles any errors that may occur during the connection process. If the connection is successful, it returns the connection object; otherwise, it logs the error and re-throws it to prevent the server from starting.
const connectDB = async (connectionUrl) => {
    try {
        if (!connectionUrl) {
            throw new Error('MongoDB connection string is not defined. Please check your .env file.');
        }

        const conn = await mongoose.connect(connectionUrl);
        return conn;

    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        throw err; // Re-throw to prevent server from starting
    }
}

export default connectDB;