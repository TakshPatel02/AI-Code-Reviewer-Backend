import mongoose from "mongoose";

const connectDB = async (connectionUrl) => {
    try{
        const conn = await mongoose.connect(connectionUrl);
        return conn;

    } catch(err){
        console.error('Error connecting to MongoDB:', err);
    }
}

export default connectDB;