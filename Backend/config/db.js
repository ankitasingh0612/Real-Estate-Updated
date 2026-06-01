import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

export const dbConnect = async () => {
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) {
            throw new Error("MONGODB_URI is not defined in .env file");
        }

        const conn = await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 5000, 
        });

        if (conn) {
            console.log("-----------------------------------------");
            console.log("✅ Database connected successfully!");
            console.log(`📡 Host: ${conn.connection.host}`);
            console.log("-----------------------------------------");
        }
    } catch (err) {
        console.log("-----------------------------------------");
        console.log("❌ Database connection FAILED!");
        console.log(`❗ Error: ${err.message}`);
        console.log("-----------------------------------------");
        process.exit(1); // Stop the server if DB connection fails
    }
}