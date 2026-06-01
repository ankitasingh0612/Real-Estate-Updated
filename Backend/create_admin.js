import mongoose from 'mongoose';
import { userModel } from './model/table.js';

const MONGO_URI = 'mongodb+srv://akhils88815_db_user:OKr0qFbfEM5Bidx1@akhil.nl69xgn.mongodb.net/Quirex?retryWrites=true&w=majority&appName=Akhil';

const createAdmin = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("🚀 Connected to MongoDB...");

        const email = 'akhil_admin@quirex.com';
        const existing = await userModel.findOne({ email });

        if (existing) {
            console.log("⚠️ Admin account already exists!");
        } else {
            await userModel.create({
                name: 'Akhil Singh (Admin)',
                email: email,
                password: 'admin123',
                contact: '09076827270',
                address: 'Koilgraha',
                profile: 'a.jpeg',
                userType: 'admin'
            });
            console.log("✅ Admin account created successfully!");
            console.log("📧 Email: " + email);
            console.log("🔑 Password: admin123");
        }
        process.exit(0);
    } catch (error) {
        console.error("❌ Error creating admin:", error.message);
        process.exit(1);
    }
};

createAdmin();
