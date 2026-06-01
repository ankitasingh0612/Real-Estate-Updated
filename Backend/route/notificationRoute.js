import express from 'express';
import { notificationModel, preferenceModel, userModel, announcementQueueModel } from '../model/table.js';
import { sendNotificationEmail } from '../config/mailer.js';

const notificationRoute = express.Router();

// --- Preferences ---
notificationRoute.post('/save-preferences', async (req, res) => {
    try {
        const { userId, location, minBudget, maxBudget, propertyType, emailNotifications } = req.body;
        const update = { location, minBudget, maxBudget, propertyType, emailNotifications, updatedAt: new Date() };
        const result = await preferenceModel.findOneAndUpdate(
            { userId },
            update,
            { upsert: true, new: true }
        );
        res.json({ code: 200, message: "Preferences saved successfully", data: result });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Error saving preferences" });
    }
});

notificationRoute.get('/get-preferences/:userId', async (req, res) => {
    try {
        const data = await preferenceModel.findOne({ userId: req.params.userId });
        res.json({ code: 200, data });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Error fetching preferences" });
    }
});

// --- Notifications ---
notificationRoute.get('/get-notifications/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const { messageModel } = await import('../model/table.js');
        
        const data = await notificationModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
        const unreadNotifs = await notificationModel.countDocuments({ userId, isRead: false });
        
        // Count unread messages for this user (including 'admin' alias)
        const mongoose = (await import('mongoose')).default;
        let searchIds = [userId];
        if (mongoose.Types.ObjectId.isValid(userId)) {
            const user = await userModel.findById(userId);
            if (user && user.userType === 'admin') searchIds.push('admin');
        }

        const unreadMsgs = await messageModel.countDocuments({
            receiverId: { $in: searchIds },
            isRead: false
        });

        res.json({ code: 200, data, unreadCount: unreadNotifs + unreadMsgs });
    } catch (err) {
        console.error("Error fetching notifications", err);
        res.status(500).json({ code: 500, message: "Error fetching notifications" });
    }
});

notificationRoute.post('/mark-as-read', async (req, res) => {
    try {
        const { notificationId, userId } = req.body;
        if (notificationId) {
            await notificationModel.findByIdAndUpdate(notificationId, { isRead: true });
        } else if (userId) {
            await notificationModel.updateMany({ userId, isRead: false }, { isRead: true });
        }
        res.json({ code: 200, message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ code: 500, message: "Error updating notification" });
    }
});

notificationRoute.post('/send-announcement', async (req, res) => {
    try {
        const pendingActivities = await announcementQueueModel.find();
        if (pendingActivities.length === 0) {
            return res.json({ code: 400, message: "No pending announcements to send." });
        }

        const allUsers = await userModel.find({});
        
        // Group activities for a cleaner message
        const added = pendingActivities.filter(a => a.action === 'Added');
        const deleted = pendingActivities.filter(a => a.action === 'Deleted');

        let message = "";
        if (added.length > 0) {
            message += `New properties added: ${added.map(a => a.propertyTitle).join(', ')}. `;
        }
        if (deleted.length > 0) {
            message += `Some properties have been removed: ${deleted.map(a => a.propertyTitle).join(', ')}.`;
        }

        const title = "New Platform Updates!";

        // Create notifications for all users
        for (const user of allUsers) {
            await new notificationModel({
                userId: user._id,
                title,
                message,
                type: 'System'
            }).save();
        }

        // Clear the queue
        await announcementQueueModel.deleteMany({});

        res.json({ code: 200, message: `Announcement sent to ${allUsers.length} users successfully.` });
    } catch (err) {
        console.error("Error sending announcement:", err);
        res.status(500).json({ code: 500, message: "Error sending announcement: " + err.message });
    }
});

export default notificationRoute;

// --- Notification Logic Helper (Internal) ---
export const triggerNewPropertyAlert = async (property) => {
    try {
        // Find users matching location, price, type
        const matches = await preferenceModel.find({
            $and: [
                { $or: [{ location: { $exists: false } }, { location: "" }, { location: property.location }] },
                { minBudget: { $lte: Number(property.price) } },
                { maxBudget: { $gte: Number(property.price) } }
            ]
        });

        for (const pref of matches) {
            const user = await userModel.findById(pref.userId);
            if (!user) continue;

            const title = "New Property Matching Your Interest!";
            const message = `A new property "${property.title}" in ${property.location} for ₹${property.price} has been added.`;

            // 1. In-app notification
            await new notificationModel({
                userId: user._id,
                title,
                message,
                type: 'NewProperty',
                propertyId: property._id
            }).save();

            // 2. Email notification
            if (pref.emailNotifications && user.email) {
                const html = `
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px;">
                        <h2 style="color: #FF5A3C;">Quirex New Property Alert</h2>
                        <p>Hi ${user.name},</p>
                        <p>We found a property that matches your preferences:</p>
                        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px;">
                            <h3>${property.title}</h3>
                            <p><b>Price:</b> ₹${property.price}</p>
                            <p><b>Location:</b> ${property.location}</p>
                            <p><b>BHK:</b> ${property.bhk}</p>
                        </div>
                        <p style="margin-top: 20px;">
                            <a href="http://localhost:5173/property" style="background: #FF5A3C; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Property</a>
                        </p>
                    </div>
                `;
                await sendNotificationEmail(user.email, title, html);
            }
        }
    } catch (err) {
        console.error("❌ Notification Trigger Error:", err);
    }
};

export const triggerPriceDropAlert = async (property, oldPrice) => {
    try {
        // Find users who have this property in their wishlist
        const interestedUsers = await userModel.find({}); 
        // Logic for price drop...
    } catch (err) {
        console.error("❌ Price Drop Notification Error:", err);
    }
};
