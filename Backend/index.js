import dotenv from 'dotenv'
dotenv.config();
import express from 'express';
import {dbConnect} from './config/db.js';
import router from './route/userRoute.js';
import adminRoute from './route/adminRoute.js'
import chatRoute from './route/chatRoute.js'
import aiRoute from './route/aiRoute.js'
import notificationRoute from './route/notificationRoute.js'
import fileUpload from 'express-fileupload';
import cors from 'cors'
const app=express();
app.use(express.json());
app.use(fileUpload());
app.use(cors());
const PORT= process.env.PORT || 9000; 
app.use('/img', express.static('uploads'));
app.use('/api/ai', aiRoute);
app.use('/api', router);
app.use('/api', adminRoute);
app.use('/api/chat', chatRoute);
app.use('/api/notifications', notificationRoute);

const startServer = async () => {
    try {
        await dbConnect();
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}...`);
        });
    } catch (err) {
        console.error("Critical: Failed to start server due to DB connection error.");
        process.exit(1);
    }
};

startServer();
